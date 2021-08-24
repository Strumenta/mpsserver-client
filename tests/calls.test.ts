import { expect } from 'chai';
import {MPSServerClient} from "../src";
import WebSocket from 'ws';
import {ErrorsForModelReported, NodeAdded, NodeRemoved} from "../src/notifications";
import {CreateIntentionsBlockAnswer} from "../src/messages";

describe('calls', () => {
    it('call createIntentionsBlock', done => {
        const wss = new WebSocket.Server({
            port: 9001
        });
        const fakeURL = 'ws://localhost:9001';

        wss.on('connection', socket => {
            socket.on('message', (datatxt: string) => {
                const data = JSON.parse(datatxt);
                // console.log("server got", data);
                if (data.method === "CreateIntentionsBlock") {
                    socket.send(JSON.stringify({
                        jsonrpc: '2.0',
                        id: data.id,
                        result: {
                            blockUUID: "ebc6f2c6-65dc-4379-bcb5-f82a7c202767",
                            intentions: [
                                {index: 0, description: "intention A"},
                                {index: 1, description: "intention B"}
                            ]
                        } as CreateIntentionsBlockAnswer
                    }));
                }
            });
        });

        const client = new MPSServerClient(fakeURL);
        client.connect(500).then(res1 => {
            client.createIntentionsBlock({
                model: "mymodel.a.b",
                id: {
                    regularNodeID: "NODE-abc"
                }
            }).then( res2 => {
                wss.close();
                expect(res2 === {
                    blockUUID: "ebc6f2c6-65dc-4379-bcb5-f82a7c202767",
                    intentions: [
                        {index: 0, description: "intention A"},
                        {index: 1, description: "intention B"}
                    ]
                } as CreateIntentionsBlockAnswer);

                done();
            });
        }).catch(err => {
            done(`failed because not connected ${err}`)
        });
    });
});