import { parseString } from 'xml2js';
import { promises as fsPromises } from 'fs';

function convertType(xmlType: any) : string {
    const xmlTypeName = xmlType['$'].name;
    if (xmlTypeName === 'String') {
        return 'string';
    }
    if (xmlTypeName === 'Boolean') {
        return 'boolean';
    }
    if (xmlTypeName === 'Long' || xmlTypeName == 'Int') {
        return 'number';
    }
    if (xmlTypeName === 'Object') {
        return 'any';
    }
    if (xmlTypeName === 'Map') {
        return `{[key:${convertType(xmlType.type[0])}]:${convertType(xmlType.type[1])}}`;
    }
    if (xmlTypeName === 'List') {
        return `${convertType(xmlType.type[0])}[]`;
    }
    return xmlTypeName;
}

function codeForEmptyInterface(name: string) : string {
    return `export type ${name} = { }\n\n`;
}

function hasMetadata(message: any) : boolean {
    const fields = message.field || [];
    const fieldsNames = fields.map((el:any)=>el['$'].name);
    return fieldsNames.indexOf('requestId') !== -1 && fieldsNames.indexOf('type') !== -1;
}

function hasOnlyMetadata(message: any) : boolean {
    const fields = message.field || [];
    return hasMetadata(message) && fields.length == 2;
}

function generateInterface(name: string, fields: any[], fieldsNamesToSkip: string[] = []) : string {
    let gen = "";
    gen += `export interface ${name} {\n`;
    fields.forEach((field: any) => {
        const fieldName = field['$'].name;
        if (fieldsNamesToSkip.indexOf(fieldName) === -1) {
            const type = convertType(field.type[0]);
            gen += `  ${fieldName}: ${type}\n`;
        }
    });
    gen += '}\n\n';
    return gen;
}

async function processXmlFile(paths: string[], generationPath: string) {
    const knownTypes : string[] = [];
    let gen = "";
    paths.forEach((path:string) => {
        fsPromises.readFile(path, 'utf-8').then((xmlCode: string)=> {
            parseString(xmlCode, (err, result: any) => {
                if (err) {
                    console.error('There was an error when parsing: ', err);
                } else {
                    result.wsprotocol.message.forEach((message: any) => {
                        const name = message['$'].name;
                        const fields = message.field || [];
                        const fieldsNames = fields.map((el:any)=>el['$'].name);
                        // console.log("fieldsNames", fieldsNames);
                        if (knownTypes.indexOf(name) == -1) {
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
                    fsPromises.writeFile(generationPath, gen, 'utf-8')
                }
            })
        });
    })
}

const baseDir = "/Users/federico/repos/mpsserver/mpscode/solutions/com.strumenta.mpsserver.server/source_gen/com/strumenta/mpsserver/logic/";

processXmlFile([`${baseDir}/wsprotocol_Actions.xml`,
    `${baseDir}/wsprotocol_Intentions.xml`,
    `${baseDir}/wsprotocol_Make.xml`,
    `${baseDir}/wsprotocol_Nodes.xml`,
    `${baseDir}/wsprotocol_Projects.xml`,
    `${baseDir}/wsprotocol_Status.xml`], "gen/messages.ts");