import { parseString } from 'xml2js';
import { promises as fsPromises } from 'fs';
import {Project, SourceFile} from "ts-morph";

function convertType(xmlType: any, sourceFile: SourceFile | null = null, fieldName: string | null = null) : string {
    if (fieldName === 'propertyValue') {
        return "PropertyValue";
    }
    const xmlTypeName = xmlType.attrs.name;
    if (xmlTypeName === 'String') {
        return 'string';
    }
    if (xmlTypeName === 'Boolean') {
        return 'boolean';
    }
    if (xmlTypeName === 'Long' || xmlTypeName === 'Int') {
        return 'number';
    }
    if (xmlTypeName === 'Object') {
        return 'unknown';
    }
    if (xmlTypeName === 'Map') {
        return `{[key:${convertType(xmlType.type[0], sourceFile)}]:${convertType(xmlType.type[1], sourceFile)}}`;
    }
    if (xmlTypeName === 'List') {
        return `${convertType(xmlType.type[0], sourceFile)}[]`;
    }
    if (sourceFile !== null) {
        sourceFile.addImportDeclaration({namedImports: [xmlTypeName], moduleSpecifier: "./messages"});
    }
    return xmlTypeName;
}

function codeForEmptyInterface(name: string) : string {
    if (name === 'UUID') {
        return `export type ${name} = string\n\n`
    }
    return `export type ${name} = Record<string, unknown>\n\n`;
}

function hasMetadata(message: any) : boolean {
    const fields = message.field || [];
    const fieldsNames = fields.map((el:any)=>el.attrs.name);
    return fieldsNames.indexOf('requestId') !== -1 || fieldsNames.indexOf('type') !== -1;
}

function hasOnlyMetadata(message: any) : boolean {
    const fields = message.field || [];
    return hasMetadata(message) && fields.length === 2;
}

function generateInterface(name: string, fields: any[], fieldsNamesToSkip: string[] = []) : string {
    let gen = "";
    gen += `export interface ${name} {\n`;
    fields.forEach((field: any) => {
        const fieldName = field.attrs.name;
        if (fieldsNamesToSkip.indexOf(fieldName) === -1) {
            const type = convertType(field.type[0], null, fieldName);
            gen += `  ${fieldName}: ${type}\n`;
        }
    });
    gen += '}\n\n';
    return gen;
}

function uncapitalize(s: string) {
    return s.charAt(0).toLowerCase() + s.slice(1);
}

async function processXmlFile(paths: string[], messagesGenerationPath: string, clientGenerationPath: string) {
    const knownTypes : string[] = [];
    let gen = "";
    let clientGen = "";
    gen += "import {PropertyValue} from \"./base\";\n\n";
    clientGen += "class Client {\n\n";

    const project = new Project();
    const client = project.createSourceFile(clientGenerationPath, "", { overwrite: true });
    await project.emit();

    client.addImportDeclaration({namedImports: ["BaseWSClient"], moduleSpecifier: "./BaseWSClient"})

    const clientClass = client.addClass({
       isAbstract: false,
       isExported: true,
       name: "MPSServerClientGen",
       extends: "BaseWSClient"
    });

    await Promise.all(paths.map(async (path:string) => {
        return new Promise<void>(async (resolve, reject)  => {
            const xmlCode: string = await fsPromises.readFile(path, 'utf-8')
            parseString(xmlCode, {attrkey: 'attrs'}, (err, result: any) => {
                if (err) {
                    console.error('There was an error when parsing: ', err);
                } else {

                    result.wsprotocol.requestEndpoint.forEach((endpoint: any) => {
                        const requestMsgName = endpoint.attrs.messageType;
                        const requestMsg = result.wsprotocol.message.find((message:any)=>message.attrs.name === requestMsgName);
                        const requestFields = requestMsg.field.filter((f:any)=>f.attrs.name !== 'requestId' && f.attrs.name !== 'type');
                        const answers = endpoint.answer;
                        if (answers.length !== 1) {
                            throw Error("Answers found: " + answers);
                        }
                        const answerMsgName = answers[0].attrs.messageType;
                        const answerMsg = result.wsprotocol.message.find((message:any)=>message.attrs.name === answerMsgName);
                        const answerFields = answerMsg.field.filter((f:any)=>f.attrs.name !== 'requestId' && f.attrs.name !== 'type');
                        const singleValue = answerFields.length === 1;
                        const methodName = uncapitalize(requestMsgName);

                        if (singleValue) {
                            client.addImportDeclaration({
                                namedImports: [requestMsgName, `${answerMsgName}WithMetadata`],
                                moduleSpecifier: "./messages"
                            });

                            const singleValueType = convertType(answerFields[0].type[0], client);
                            clientClass.addMethod({
                                name: methodName,
                                isAsync: true,
                                returnType: `Promise<${singleValueType}>`,
                                parameters: requestFields.map((f: any) => {return {name: f.attrs.name, type: convertType(f.type[0], client)}}),
                                statements: [
                                    `const _params : ${requestMsgName} = {${requestFields.map((f: any)=>f.attrs.name).join(", ")}};`,
                                    `const res = await this.client.call('${requestMsgName}', _params) as ${answerMsgName}WithMetadata;`,
                                    `return res.${answerFields[0].attrs.name};`]
                            })
                        } else {
                            client.addImportDeclaration({
                                namedImports: [requestMsgName, answerMsgName, `${answerMsgName}WithMetadata`],
                                moduleSpecifier: "./messages"
                            });
                            clientClass.addMethod({
                                name: methodName,
                                isAsync: true,
                                returnType: `Promise<${answerMsgName}>`,
                                parameters: requestFields.map((f: any) => {return {name: f.attrs.name, type: convertType(f.type[0], client)}}),
                                statements: [
                                    `const _params : ${requestMsgName} = {${requestFields.map((f: any)=>f.attrs.name).join(", ")}};`,
                                    `const res = await this.client.call('${requestMsgName}', _params) as ${answerMsgName}WithMetadata;`,
                                    `return {${answerFields.map((f: any) => `${f.attrs.name}: res.${f.attrs.name}`).join(", ")}} as ${answerMsgName};`]
                            })
                        }
                    });

                    (result.wsprotocol.commandEndpoint || []).forEach((endpoint: any) => {
                        // console.log("endpoint", JSON.stringify(endpoint, null, 2));
                        const requestMsgName = endpoint.attrs.messageType;
                        const requestMsg = result.wsprotocol.message.find((message:any)=>message.attrs.name === requestMsgName);
                        const requestFields = requestMsg.field.filter((f:any)=>f.attrs.name !== 'requestId' && f.attrs.name !== 'type');
                        const methodName = uncapitalize(requestMsgName);


                        client.addImportDeclaration({
                            namedImports: [requestMsgName],
                            moduleSpecifier: "./messages"
                        });
                        clientClass.addMethod({
                            name: methodName,
                            isAsync: true,
                            returnType: `Promise<void>`,
                            parameters: requestFields.map((f: any) => {return {name: f.attrs.name, type: convertType(f.type[0], client)}}),
                            statements: [
                                `const _params : ${requestMsgName} = {${requestFields.map((f: any)=>f.attrs.name).join(", ")}};`,
                                `await this.client.notify('${requestMsgName}', _params);`]
                        })
                    });

                    gen += "//\n";
                    gen += `// messages for group ${result.wsprotocol.attrs.name}\n`;
                    gen += "//\n\n";

                    result.wsprotocol.message.forEach((message: any) => {

                        const name = message.attrs.name;
                        const fields = message.field || [];

                        if (knownTypes.indexOf(name) === -1) {
                            knownTypes.push(name);
                            if (fields.length === 0) {
                                gen += codeForEmptyInterface(name);
                            } else if (hasMetadata(message)) {
                                gen += generateInterface(`${name}WithMetadata`, fields);

                                if (hasOnlyMetadata(message)) {
                                    gen += codeForEmptyInterface(name);
                                } else {
                                    gen += generateInterface(name, fields,
                                        ['requestId', 'type']);
                                }
                            } else {
                                gen += generateInterface(name, fields);
                            }
                        }
                    })

                }
                //console.log("resolving for", path);
                resolve();
            });
        });
    }));

    clientGen += "}\n";
    //console.log("printing");
    //console.log("clientGen", clientGen);
    fsPromises.writeFile(messagesGenerationPath, gen, 'utf-8');
    //fsPromises.writeFile(clientGenerationPath, clientGen, 'utf-8');

    await project.save();
}

const baseDir = "/Users/federico/repos/mpsserver/mpscode/solutions/com.strumenta.mpsserver.server/source_gen/com/strumenta/mpsserver/logic/";
const modelixDir = "/Users/federico/repos/mpsserver/mpscode/solutions/com.strumenta.mpsserver.modelix/source_gen/com/strumenta/mpsserver/modelix/serveraddons/"

processXmlFile([`${baseDir}/wsprotocol_Actions.xml`,
    `${baseDir}/wsprotocol_Intentions.xml`,
    `${baseDir}/wsprotocol_Make.xml`,
    `${baseDir}/wsprotocol_Nodes.xml`,
    `${baseDir}/wsprotocol_Projects.xml`,
    `${baseDir}/wsprotocol_Status.xml`,
    `${modelixDir}/wsprotocol_ModelixIntegration.xml`], "gen/messages.ts", "src/MPSServerClientGen.ts");