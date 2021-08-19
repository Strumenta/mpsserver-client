import {MPSServerClient} from ".";

const client = new MPSServerClient('ws://localhost:2906/jsonrpc');

async function core() {
    await client.connect();
    const projectName = await client.getProjetInfo();
    console.log("project name", projectName);
}
core();