import {MPSServerClient} from ".";

const client = new MPSServerClient('ws://localhost:2913/jsonrpc');

async function core() {
    await client.connect().catch((reason: any)=> {
        console.error("unable to connect to server", reason);
        process.exit(1);
    });
    const projectName = await client.getProjectInfo();
    console.log("project name", projectName);
    const modulesStatus = await client.getModulesStatus();
    console.log("got modules status");
    modulesStatus.modules.forEach((module) => {
        if (module.name.startsWith("com.strumenta")) {
            console.log(" - got module", module.name);
            void client.getModuleInfo(module.name).then((moduleInfo) => {
                moduleInfo.forEach((model) => {
                    console.log("   - got model", model.qualifiedName);
                    client.getInstancesOfConcept(model.qualifiedName,
                        "com.strumenta.mpsserver.protocol.WebSocketsAPIsGroup")
                        .then((answer) => {
                            const nodes = answer.nodes;
                            nodes.forEach((node) => {
                                console.log("APIS group", node.name);
                            })
                        }).catch((reason) => {
                            console.error("unable to get instances for this model", model.qualifiedName);
                    });
                })
            });
        }
    });
}
void core();