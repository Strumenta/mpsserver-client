import { expect } from 'chai';
import {MPSServerClient} from "../src";
import WebSocket from 'ws';
import {NodeAdded, NodeRemoved} from "../src/notifications";

describe('subscriptions', () => {
    it('add node', done => {
        const wss = new WebSocket.Server({
            port: 9000
        });
        const fakeURL = 'ws://localhost:9000';

        wss.on('connection', socket => {
            socket.on('message', (datatxt: string) => {
                const data = JSON.parse(datatxt);
                if (data.method === 'rpc.on') {
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
                            id: "nodeID-234",
                            interfaceConcept: false,
                            name: "MyNode",
                            properties: {},
                            refs: {}
                        },
                        index: 2,
                        relationName: "foos"
                    } as NodeAdded;
                    socket.send(JSON.stringify({"notification": "modelChanges", "params": nodeAdded}));
                }
            });
        });

        const client = new MPSServerClient(fakeURL);
        const onNodeAddedReceived : NodeAdded[] = [];
        client.connect(500).then(res1 => {
            client.registerForModelChanges("mymodel.foo.bar", {
                onNodeAdded: (notification) => {
                   onNodeAddedReceived.push(notification);
                }
            }).then( res2 => {
                wss.close();
                expect(onNodeAddedReceived.length === 1);
                expect(onNodeAddedReceived[0] === {
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
                        id: "nodeID-234",
                        interfaceConcept: false,
                        name: "MyNode",
                        properties: {},
                        refs: {}
                    },
                    index: 2,
                    relationName: "foos"
                } as NodeAdded);
                done();
            });
        }).catch(err => {
            done(`failed because not connected ${err}`)
        });
    });
    it('remove node', done => {
        const wss = new WebSocket.Server({
            port: 9000
        });
        const fakeURL = 'ws://localhost:9000';

        wss.on('connection', socket => {
            socket.on('message', (datatxt: string) => {
                const data = JSON.parse(datatxt);
                if (data.method === 'rpc.on') {
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
                            id: "nodeID-234",
                            interfaceConcept: false,
                            name: "MyNode",
                            properties: {},
                            refs: {}
                        },
                        index: 2,
                        relationName: "foos"
                    } as NodeRemoved;
                    socket.send(JSON.stringify({"notification": "modelChanges", "params": event}));
                }
            });
        });

        const client = new MPSServerClient(fakeURL);
        const received : NodeRemoved[] = [];
        client.connect(500).then(res1 => {
            client.registerForModelChanges("mymodel.foo.bar", {
                onNodeRemoved: (notification) => {
                    received.push(notification);
                }
            }).then( res2 => {
                wss.close();
                expect(received.length === 1);
                expect(received[0] === {
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
                        id: "nodeID-234",
                        interfaceConcept: false,
                        name: "MyNode",
                        properties: {},
                        refs: {}
                    },
                    index: 2,
                    relationName: "foos"
                } as NodeRemoved);
                done();
            });
        }).catch(err => {
            done(`failed because not connected ${err}`)
        });
    });
});