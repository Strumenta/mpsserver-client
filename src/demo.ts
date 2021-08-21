import {MPSServerClient} from ".";

const client = new MPSServerClient('ws://localhost:2908/jsonrpc');

async function core() {
    await client.connect().catch((reason: any)=> {
        console.error("timeout, unable to connect to server");
        process.exit(1);
    });
    const projectName = await client.getProjectInfo();
    console.log("project name", projectName);
    const modulesStatus = await client.getModulesStatus();
    console.log("got modules status");
    modulesStatus.modules.forEach(async (module) => {
        // console.log(" - got module", module.name);
        const moduleInfo = await client.getModuleInfo(module.name);
        moduleInfo.forEach(async (model) => {
            //console.log("   - got model", model.qualifiedName);
            const nodes = (await client.getInstancesOfConcept(model.qualifiedName, "com.strumenta.mpsserver.protocol.structure.WebSocketsAPIsGroup")).nodes;
            nodes.forEach(async (node)=> {
                console.log("APIS group", node.name);
            })
        })
    });
}
core();