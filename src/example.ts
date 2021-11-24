import {MPSServerClient} from ".";
//import {GetInstancesOfConceptAnswer, ModelInfo, ModuleStatus, NodeInfo} from ".";

const client = new MPSServerClient('ws://localhost:2904/jsonrpc');

async function core() {
    await client.connect().catch((reason: any)=> {
        console.error("unable to connect to server", reason);
        process.exit(1);
    });
    const myName = await client.introduceSelf("example");
    console.log("assigned name", myName);
    client.registerForChanges("com.strumenta.financialcalc.sandbox.company", {
        onNodeAdded: (event) => {
            console.log("node added", event)  
        },
        onNodeRemoved: (event) => {
            console.log("node removed", event)
        },
        onReferenceChanged: (event) => {
            console.log("reference changed", event)
        },        
        onPropertyChange: (event) => {
            console.log("property changed", event)
        }
        
    })
    
    client.requestForPropertyChange({
        model: 'com.strumenta.financialcalc.sandbox.company',
            id: { regularId: '516698799897574170' }
    },
    'name',
        'zum7'
)
}
void core();