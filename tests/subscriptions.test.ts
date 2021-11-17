import {MPSServerClient} from "../src";
import {ErrorsForModelReport, NodeAdded, NodeRemoved} from "../src";
import {SimpleWSServer} from "./support";
import * as assert from "assert";

describe('subscriptions', () => {
    it('add node', async () => {
        const wsServer = new SimpleWSServer(9000, {
            "rpc.on": (data, socket) => {
                socket.send(JSON.stringify({"jsonrpc": "2.0", "id": data.id, "result": "ok"}));

                const nodeAdded : NodeAdded = {
                    type: "NodeAdded",
                    parentNodeId :{
                        regularId: "nodeID-123"
                    },
                    child: {
                        abstractConcept: false,
                        children: [],
                        concept: "myconcept",
                        conceptAlias:"my",
                        containingLink: "myparentlink",
                        id: {
                            regularNodeID: "nodeID-234"
                        },
                        interfaceConcept: false,
                        name: "MyNode",
                        properties: {},
                        refs: {}
                    },
                    index: 2,
                    relationName: "foos"
                } as NodeAdded;
                socket.send(JSON.stringify({"notification": "RegisterForChanges", "params": nodeAdded}));
            }
        });

        const client = new MPSServerClient(wsServer.url());
        const onNodeAddedReceived : NodeAdded[] = [];
        await client.connect(500);
        await client.registerForChanges("mymodel.foo.bar", {
            onNodeAdded: (notification) => {
               onNodeAddedReceived.push(notification);
            }
        });
        wsServer.close();
        assert.deepEqual(onNodeAddedReceived.length, 1);
        assert.deepEqual(onNodeAddedReceived[0], {
            type: "NodeAdded",
            parentNodeId :{
                regularId: "nodeID-123"
            },
            child: {
                abstractConcept: false,
                children: [],
                concept: "myconcept",
                conceptAlias:"my",
                containingLink: "myparentlink",
                id:  {
                    regularNodeID: "nodeID-234"
                },
                interfaceConcept: false,
                name: "MyNode",
                properties: {},
                refs: {}
            },
            index: 2,
            relationName: "foos"
        } as NodeAdded);
    });
    it('add node without connect', async () => {
        const wsServer = new SimpleWSServer(9000, {
            "rpc.on": (data, socket) => {
                socket.send(JSON.stringify({"jsonrpc": "2.0", "id": data.id, "result": "ok"}));

                const nodeAdded : NodeAdded = {
                    type: "NodeAdded",
                    parentNodeId :{
                        regularId: "nodeID-123"
                    },
                    child: {
                        abstractConcept: false,
                        children: [],
                        concept: "myconcept",
                        conceptAlias:"my",
                        containingLink: "myparentlink",
                        id: {
                            regularNodeID: "nodeID-234"
                        },
                        interfaceConcept: false,
                        name: "MyNode",
                        properties: {},
                        refs: {}
                    },
                    index: 2,
                    relationName: "foos"
                } as NodeAdded;
                socket.send(JSON.stringify({"notification": "RegisterForChanges", "params": nodeAdded}));
            }
        });

        const client = new MPSServerClient(wsServer.url());
        const onNodeAddedReceived : NodeAdded[] = [];
        await client.registerForChanges("mymodel.foo.bar", {
            onNodeAdded: (notification) => {
                onNodeAddedReceived.push(notification);
            }
        });
        wsServer.close();
        assert.deepEqual(onNodeAddedReceived.length, 1);
        assert.deepEqual(onNodeAddedReceived[0], {
            type: "NodeAdded",
            parentNodeId :{
                regularId: "nodeID-123"
            },
            child: {
                abstractConcept: false,
                children: [],
                concept: "myconcept",
                conceptAlias:"my",
                containingLink: "myparentlink",
                id: {
                    regularNodeID: "nodeID-234"
                },
                interfaceConcept: false,
                name: "MyNode",
                properties: {},
                refs: {}
            },
            index: 2,
            relationName: "foos"
        } as NodeAdded);
    });
    it('remove node', async () => {
        const wsServer = new SimpleWSServer(9000, {
            "rpc.on": (data, socket) => {
                socket.send(JSON.stringify({"jsonrpc": "2.0", "id": data.id, "result": "ok"}));

                const event : NodeRemoved = {
                    type: "NodeRemoved",
                    parentNodeId :{
                        regularId: "nodeID-123"
                    },
                    child: {
                        abstractConcept: false,
                        children: [],
                        concept: "myconcept",
                        conceptAlias:"my",
                        containingLink: "myparentlink",
                        id: {
                            regularNodeID: "nodeID-234"
                        },
                        interfaceConcept: false,
                        name: "MyNode",
                        properties: {},
                        refs: {}
                    },
                    index: 2,
                    relationName: "foos"
                } as NodeRemoved;
                socket.send(JSON.stringify({"notification": "RegisterForChanges", "params": event}));
            }
        });

        const client = new MPSServerClient(wsServer.url());
        const received : NodeRemoved[] = [];
        await client.connect(500)
        await client.registerForChanges("mymodel.foo.bar", {
            onNodeRemoved: (notification) => {
                received.push(notification);
            }
        });
        wsServer.close();
        assert.deepEqual(received.length, 1);
        assert.deepEqual(received[0], {
            type: "NodeRemoved",
            parentNodeId :{
                regularId: "nodeID-123"
            },
            child: {
                abstractConcept: false,
                children: [],
                concept: "myconcept",
                conceptAlias:"my",
                containingLink: "myparentlink",
                id: {
                    regularNodeID: "nodeID-234"
                },
                interfaceConcept: false,
                name: "MyNode",
                properties: {},
                refs: {}
            },
            index: 2,
            relationName: "foos"
        } as NodeRemoved);
    });
    it('errors for model reported', async () => {
        const wsServer = new SimpleWSServer(9000, { "rpc.on": (data, socket) => {
            socket.send(JSON.stringify({"jsonrpc": "2.0", "id": data.id, "result": "ok"}));

            const event : ErrorsForModelReport = {
                type: "ErrorsForModelReport",
                issues: [
                    {
                        node: {
                            regularId: "nodeId-789"
                        },
                        severity: "error",
                        message: "An error was found"
                    }
                ],
                model: "mymodel.foo.bar"
            } as ErrorsForModelReport;
            socket.send(JSON.stringify({"notification": "RegisterForChanges", "params": event}));
        }});

        const client = new MPSServerClient(wsServer.url());
        const received : ErrorsForModelReport[] = [];
        await client.connect(500);
        await client.registerForChanges("mymodel.foo.bar", {
            onErrorsForModelReport: (notification) => {
                received.push(notification);
            }
        });
        wsServer.close();
        assert.deepEqual(received.length, 1);
        assert.deepEqual(received[0],  {
            type: "ErrorsForModelReport",
            issues: [
                {
                    node: {
                        regularId: "nodeId-789"
                    },
                    severity: "error",
                    message: "An error was found"
                }
            ],
            model: "mymodel.foo.bar"
        } as ErrorsForModelReport);
    });
});