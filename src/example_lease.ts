import {MPSServerClient} from ".";

const clientA = new MPSServerClient('ws://localhost:2904/jsonrpc');
const clientB = new MPSServerClient('ws://localhost:2904/jsonrpc');
const clientC = new MPSServerClient('ws://localhost:2904/jsonrpc');

async function core() {
    await clientA.connect().catch((reason: any)=> {
        console.error("unable to connect to server", reason);
        process.exit(1);
    });
    await clientB.connect().catch((reason: any)=> {
        console.error("unable to connect to server", reason);
        process.exit(1);
    });
    await clientC.connect().catch((reason: any)=> {
        console.error("unable to connect to server", reason);
        process.exit(1);
    });
    const nameA = await clientA.introduceSelf("client-A");
    const nameB = await clientA.introduceSelf("client-B");
    const nameC = await clientA.introduceSelf("client-C");
    console.log("assigned names", nameA, nameB, nameC);
    await clientA.askAndKeepLease("model1");
    await clientB.askAndKeepLease("model2");
    await clientC.askAndKeepLease("model3");
    await clientA.askAndKeepLease("model1");
    await clientB.askAndKeepLease("model4");
    await clientC.askAndKeepLease("model2");
    await clientA.askAndKeepLease("model4");
}
void core();
