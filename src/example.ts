import {MPSServerClient} from ".";
//import {GetInstancesOfConceptAnswer, ModelInfo, ModuleStatus, NodeInfo} from ".";

const client = new MPSServerClient('ws://localhost:2904/jsonrpc');

async function core() {
    await client.connect().catch((reason: any)=> {
        console.error("unable to connect to server", reason);
        process.exit(1);
    });
    client.registerForChanges("com.strumenta.financialcalc.sandbox.company", {
        onPropertyChange: (event) => {
            console.log("property changed", event)
        }
    })
    //process.exit(0)
}
void core();