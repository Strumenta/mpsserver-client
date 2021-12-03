import {MPSServerClient} from ".";

const client = new MPSServerClient('ws://localhost:2904/jsonrpc');

async function core() {
    await client.connect().catch((reason: any)=> {
        console.error("unable to connect to server", reason);
        process.exit(1);
    });
    const myName = await client.introduceSelf("example");
    console.log("assigned name", myName);
    await client.overrideNode("com.strumenta.businessorg.sandbox.acmeinc", {
        id: {
            regularId: "3916594349471932797"
        },
        concept: "com.strumenta.businessorg.Organization",
        children: {
            roles: [
                {
                    id: {
                        regularId: "1234569"
                    },
                    concept: "com.strumenta.businessorg.Role",
                    refs: {},
                    children: {},
                    properties: {
                        name: "asasas"
                    },
                }
            ],
            persons: [
                {
                    id: {
                        regularId: "123457"
                    },
                    concept: "com.strumenta.businessorg.Person",
                    refs: {},
                    children: {
                        roles: [
                            {
                                id: {
                                    regularId: "123458"
                                },
                                concept: "com.strumenta.businessorg.RolePlayed",
                                refs: {
                                    role: {
                                        id: {
                                            regularId: "1234569"
                                        },
                                        model: "com.strumenta.businessorg.sandbox.acmeinc"
                                    }
                                },
                                children: {
                                },
                                properties: {
                                },
                            }
                        ]
                    },
                    properties: {
                        name: "Jack"
                    },
                }
            ]
        },
        refs: {},
        properties: {
            name: "ABC"
        }
    })
    console.log("changes done")
}
void core();
