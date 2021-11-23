import { parseString } from 'xml2js';
import { promises as fsPromises, existsSync, lstatSync, readdirSync } from 'fs';
import {
    ExpressionStatement, IfStatement,
    OptionalKind,
    ParameterDeclarationStructure,
    Project,
    SourceFile,
    StatementStructures,
    ts
} from "ts-morph";

function convertType(xmlType: any, sourceFile: SourceFile | null = null, fieldName: string | null = null) : string {
    if (fieldName === 'propertyValue') {
        return "PropertyValue";
    }
    if (fieldName === 'propertiesValues') {
        return "{[key:string]:PropertyValue}";
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
        let fieldName = field.attrs.name;
        if (field.attrs.optional == "true") {
            fieldName = `${fieldName}?`
        }
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

function createIfStmt(client: SourceFile, f: ts.NodeFactory, eventName: string, notifications: string[], index: number) : ts.IfStatement {
    const factory = f;
    const notificationName = notifications[index];
    client.addImportDeclaration({moduleSpecifier:"./messages", namedImports: [
            notificationName
        ]});
    let elseStmt : ts.Statement = factory.createThrowStatement(factory.createNewExpression(
        factory.createIdentifier("Error"),
        undefined,
        [factory.createTemplateExpression(
            factory.createTemplateHead(
                `unknown ${eventName} notification type: `,
                `unknown ${eventName} notification type: `
            ),
            [factory.createTemplateSpan(
                factory.createAsExpression(
                    factory.createPropertyAccessExpression(
                        factory.createIdentifier("eventData"),
                        factory.createIdentifier("type")
                    ),
                    factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
                ),
                factory.createTemplateTail(
                    "",
                    ""
                )
            )]
        )]
    ));
    if ((index + 1) < notifications.length) {
        elseStmt = createIfStmt(client, f, eventName, notifications, index + 1);
    }
    const ifStmt = factory.createIfStatement(
        factory.createBinaryExpression(
            factory.createPropertyAccessExpression(
                factory.createIdentifier("eventData"),
                factory.createIdentifier("type")
            ),
            factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
            factory.createStringLiteral(notificationName)
        ),
        factory.createBlock(
            [factory.createIfStatement(
                factory.createBinaryExpression(
                    factory.createPropertyAccessExpression(
                        factory.createIdentifier("listener"),
                        factory.createIdentifier(`on${notificationName}`)
                    ),
                    factory.createToken(ts.SyntaxKind.ExclamationEqualsToken),
                    factory.createNull()
                ),
                factory.createBlock(
                    [factory.createExpressionStatement(factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                            factory.createIdentifier("listener"),
                            factory.createIdentifier(`on${notificationName}`)
                        ),
                        undefined,
                        [factory.createAsExpression(
                            factory.createIdentifier("eventData"),
                            factory.createTypeReferenceNode(
                                factory.createIdentifier(notificationName),
                                undefined
                            )
                        )]
                    ))],
                    true
                ),
                undefined
            )],
            true
        ),
        elseStmt
    );
    return ifStmt;
}

async function processXmlFile(paths: string[], messagesGenerationPath: string, clientGenerationPath: string) {
    const knownTypes : string[] = [];
    let gen = "";
    let clientGen = "";
    gen += "import {PropertyValue} from \"../base\";\n\n";
    clientGen += "class Client {\n\n";

    const project = new Project();
    const client = project.createSourceFile(clientGenerationPath, "", { overwrite: true });
    await project.emit();

    client.addImportDeclaration({namedImports: ["BaseWSClient"], moduleSpecifier: "../BaseWSClient"})
    client.addImportDeclaration({namedImports: ["PropertyValue"], moduleSpecifier: "../base"})

    const clientClass = client.addClass({
       isAbstract: false,
       isExported: true,
       name: "MPSServerClient",
       extends: "BaseWSClient"
    });

    const constructor = clientClass.addConstructor({
        parameters: [{name: "url", type: "string"}],
        statements: [`super(url);`]
    });

    const notificationsToEndpoint : {[key:string]:string} = {};

    for (const path of paths) {
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
                        const parameters = requestFields.map((f: any) => {
                            let name = f.attrs.name;
                            if (f.attrs.optional === "true") {
                                name = `${name}?`
                            }
                            return {name,
                            type: convertType(f.type[0], client)}});
                        clientClass.addMethod({
                            name: methodName,
                            isAsync: true,
                            returnType: `Promise<${singleValueType}>`,
                            parameters: parameters,
                            statements: [
                                `await this.connect();`,
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
                            parameters: requestFields.map((f: any) => {return {name: f.attrs.name, type: convertType(f.type[0], client, f.attrs.name)}}),
                            statements: [
                                `await this.connect();`,
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
                        parameters: requestFields.map((f: any) => {return {name: f.attrs.name, 
                            type: convertType(f.type[0], client, f.attrs.name),
                            optional: f.optional}}),
                        statements: [
                            `await this.connect();`,
                            `const _params : ${requestMsgName} = {${requestFields.map((f: any)=>f.attrs.name).join(", ")}};`,
                            `await this.client.notify('${requestMsgName}', _params);`]
                    })
                });


                gen += "//\n";
                gen += `// messages for group ${result.wsprotocol.attrs.name}\n`;
                gen += "//\n\n";

                (result.wsprotocol.registrationEndpoint || []).forEach((endpoint: any) => {
                    gen += `export interface ${endpoint.attrs.messageType}Listener {\n`;
                    (endpoint.notification || []).forEach((notification:any) => {
                       notificationsToEndpoint[notification.attrs.messageType] = endpoint.attrs.messageType;
                       gen += `  on${notification.attrs.messageType}?: On${notification.attrs.messageType}\n`;
                    });
                    gen += "}\n\n";

                    (endpoint.notification || []).forEach((notification:any) => {
                        gen += `type On${notification.attrs.messageType} = (event: ${notification.attrs.messageType}) => void;\n`;
                    });
                    gen += '\n';

                    gen += `export interface ${endpoint.attrs.messageType}Notification {\n`;
                    gen += `  type: "${endpoint.notification[0].attrs.messageType}"\n`;
                    endpoint.notification.slice(1).forEach((notification:any) => {
                        gen += `      | "${notification.attrs.messageType}"\n`;
                    });
                    gen += "}\n\n";

                    // async registerForModelChanges(modelName: string, modelListener: RegisterForChangesListener = {}) : Promise<void> {
                    const methodParams : OptionalKind<ParameterDeclarationStructure>[] = [];
                    const msgName = endpoint.attrs.messageType;
                    const msg = result.wsprotocol.message.find((message:any)=>message.attrs.name === msgName);
                    const fields = msg.field.filter((f:any)=>f.attrs.name !== 'requestId' && f.attrs.name !== 'type');
                    fields.forEach((field: any)=>{
                        methodParams.push({
                           name: field.attrs.name,
                           type: convertType(field.type[0], client, field.attrs.name)
                        });
                    });
                    methodParams.push({
                       name: "listener",
                       type: `${endpoint.attrs.messageType}Listener`,
                       initializer: "{}"
                    });
                    let methodName = `registerFor${endpoint.attrs.messageType}`;
                    if (endpoint.attrs.messageType.toLowerCase().startsWith('registerfor')) {
                        methodName = uncapitalize(endpoint.attrs.messageType);
                    }
                    const registerMethod = clientClass.addMethod({
                        name: methodName,
                        isAsync: true,
                        parameters: methodParams,
                        returnType: "Promise<void>",
                    });

                    client.addImportDeclaration({moduleSpecifier:"./messages", namedImports: [
                        `${endpoint.attrs.messageType}Notification`,
                        `${endpoint.attrs.messageType}Listener`
                        ]});

                    const f = ts.factory;

                    const notifications = (endpoint.notification || []).map((n: any) => n.attrs.messageType);
                    const ifStmt : ts.IfStatement = createIfStmt(client, f, endpoint.attrs.messageType, notifications, 0);

                    const lambda = f.createArrowFunction(
                        undefined,
                        undefined,
                        [f.createParameterDeclaration(
                            undefined,
                            undefined,
                            undefined,
                            f.createIdentifier("eventData"),
                            undefined,
                            f.createTypeReferenceNode(
                                f.createIdentifier(`${endpoint.attrs.messageType}Notification`),
                                undefined
                            ),
                            undefined
                        )],
                        undefined,
                        f.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                        f.createBlock(
                            [ifStmt],
                            true
                        )
                    );
                    const s = f.createExpressionStatement(f.createCallExpression(
                        f.createPropertyAccessExpression(
                            f.createPropertyAccessExpression(
                                f.createThis(),
                                f.createIdentifier("client")
                            ),
                            f.createIdentifier("addListener")
                        ), undefined, [f.createStringLiteral(endpoint.attrs.messageType), lambda]));
                    let registerParams : ts.Expression[] = [f.createStringLiteral(endpoint.attrs.messageType)];
                    fields.forEach((field:any)=>{
                        registerParams.push(f.createIdentifier(field.attrs.name));
                    });
                    registerMethod.transform(traversal => {
                        return f.createMethodDeclaration(
                            undefined,
                            [f.createModifier(ts.SyntaxKind.AsyncKeyword)],
                            undefined,
                            f.createIdentifier(methodName),
                            undefined,
                            undefined,
                            [
                                f.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    f.createIdentifier("modelName"),
                                    undefined,
                                    f.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                                    undefined
                                ),
                                f.createParameterDeclaration(
                                    undefined,
                                    undefined,
                                    undefined,
                                    f.createIdentifier("listener"),
                                    undefined,
                                    f.createTypeReferenceNode(
                                        f.createIdentifier(`${endpoint.attrs.messageType}Listener`),
                                        undefined
                                    ),
                                    f.createObjectLiteralExpression(
                                        [],
                                        false
                                    )
                                )
                            ],
                            f.createTypeReferenceNode(
                                f.createIdentifier("Promise"),
                                [f.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)]
                            ),
                            f.createBlock(
                                [f.createExpressionStatement(f.createAwaitExpression(f.createCallExpression(
                                    f.createPropertyAccessExpression(
                                        f.createThis(),
                                        f.createIdentifier("connect")
                                    ),
                                    undefined,
                                    []
                                ))),
                                s,
                                    f.createExpressionStatement(f.createAwaitExpression(f.createCallExpression(
                                        f.createPropertyAccessExpression(
                                            f.createPropertyAccessExpression(
                                                f.createThis(),
                                                f.createIdentifier("client")
                                            ),
                                            f.createIdentifier("subscribe")
                                        ),
                                        undefined,
                                        [f.createArrayLiteralExpression(
                                            registerParams,
                                            false
                                        )]
                                    )))],
                                true
                            )
                        )
                    });
                });

                result.wsprotocol.message.forEach((message: any) => {

                    const name = message.attrs.name;
                    const fields = message.field || [];
                    //console.log("message", message, message.attrs)


                    if (knownTypes.indexOf(name) === -1) {
                        knownTypes.push(name);
                        if (message.attrs.type === 'notification') {
                            gen += `export interface ${message.attrs.name} extends ${notificationsToEndpoint[message.attrs.name]}Notification {\n`;
                            gen += `  type: "${message.attrs.name}"\n`;
                            message.field.forEach((field:any)=>{
                                let fieldName = field.attrs.name;
                                if (fieldName !== 'type') {
                                    const type = convertType(field.type[0], null, fieldName);
                                    if (field.optional) {
                                        fieldName = `${fieldName}?`
                                    }
                                    gen += `  ${field.attrs.name}: ${type}\n`;
                                }
                            });
                            gen += '}\n\n';
                        } else if (fields.length === 0) {
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
        });
    }

    const myImports : {[path:string]:string[]} = {};
    client.getImportDeclarations().forEach((importDecl) => {
        const path = importDecl.getModuleSpecifier().getLiteralValue();
        if (!(path in myImports)) {
            myImports[path] = [];
        }
        importDecl.getNamedImports().map((ni)=>ni.getName()).forEach((ni)=>myImports[path].push(ni));
        importDecl.remove();
    });

    const importPaths = [];
    for (const path in myImports) {
        importPaths.push(path);
    }
    importPaths.sort().forEach((path:string)=>{
        const uniques = myImports[path].filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        }).sort();
        client.addImportDeclaration({namedImports: uniques, moduleSpecifier: path});
    });

    clientGen += "}\n";
    //console.log("printing");
    //console.log("clientGen", clientGen);
    fsPromises.writeFile(messagesGenerationPath, gen, 'utf-8');
    //fsPromises.writeFile(clientGenerationPath, clientGen, 'utf-8');

    await project.save();
}

if (process.argv.length != 3) {
    console.error("Exactly one parameter should be specified. That parameter should indicate the MPSServer directory");
    process.exit(1);
}
const mpsServerDir = process.argv[2];
try {
    if (!lstatSync(mpsServerDir).isDirectory() ) {
        console.error("Specified path is not a directory");
        process.exit(1);
    }
} catch(err) {
    console.error("Specified path does not exist");
    process.exit(1);
}

const baseDir = `${mpsServerDir}/mpscode/solutions/com.strumenta.mpsserver.server/source_gen/com/strumenta/mpsserver/logic/`;
const modelixDir = `${mpsServerDir}/mpscode/solutions/com.strumenta.mpsserver.modelix/source_gen/com/strumenta/mpsserver/modelix/serveraddons/`;

function findProtocolFiles(dir: string) : string[] {
    const candidates: (string|null)[] = readdirSync(dir).flatMap((item) => {
        const path = dir.endsWith("/") ? `${dir}${item}` : `${dir}/${item}`;
        if (lstatSync(path).isDirectory()) {
            return findProtocolFiles(path);
        }
        if (item.startsWith("wsprotocol_") && item.endsWith(".xml")) {
            return path;
        } else {
            return null;
        }
    });
    return candidates.filter((item)=> item != null).map((item) => item as string);
}

const protocolFiles : string[] = findProtocolFiles(baseDir).concat(findProtocolFiles(modelixDir))
if (protocolFiles.length == 0) {
    console.error("No protocol files found. Have they been generated?");
    process.exit(1);
}
processXmlFile(protocolFiles, "src/gen/messages.ts", "src/gen/MPSServerClient.ts");
