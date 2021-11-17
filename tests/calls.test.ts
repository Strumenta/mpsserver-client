import {MPSServerClient} from "../src";
import WebSocket from 'ws';
import {CreateIntentionsBlockAnswer, GetIntentionsBlockAnswer} from "../src";
import {SimpleWSServer} from "./support";
import * as assert from "assert";

describe('calls', () => {
    it('call createIntentionsBlock', async () => {
        const wsServer = new SimpleWSServer(9001, {
            "CreateIntentionsBlock": (data: any, socket: WebSocket) => {
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
        const client = new MPSServerClient(wsServer.url());
        await client.connect(500)
        const res = await client.createIntentionsBlock({
                model: "mymodel.a.b",
                id: {
                    regularNodeID: "NODE-abc"
                }
        });
        wsServer.close();
        assert.deepEqual(res, {
            blockUUID: "ebc6f2c6-65dc-4379-bcb5-f82a7c202767",
            intentions: [
                {index: 0, description: "intention A"},
                {index: 1, description: "intention B"}
            ]
        } as CreateIntentionsBlockAnswer);
    });
    it('call getIntentionsBlock', async () => {
        const wsServer = new SimpleWSServer(9001, {
            "GetIntentionsBlock": (data: any, socket: WebSocket) => {
                socket.send(JSON.stringify({
                    jsonrpc: '2.0',
                    id: data.id,
                    result: {
                        blockUUID: "ebc6f2c6-65dc-4379-bcb5-f82a7c202767",
                        intentions: [
                            {index: 0, description: "intention A"},
                            {index: 1, description: "intention B"}
                        ],
                        result: {
                            success: true
                        }
                    } as GetIntentionsBlockAnswer
                }));
            }
        });
        const client = new MPSServerClient(wsServer.url());
        await client.connect(500)
        const res = await client.getIntentionsBlock("ebc6f2c6-65dc-4379-bcb5-f82a7c202767");
        wsServer.close();
        assert.deepEqual(res, {
            blockUUID: "ebc6f2c6-65dc-4379-bcb5-f82a7c202767",
            intentions: [
                {index: 0, description: "intention A"},
                {index: 1, description: "intention B"}
            ],
            result: {
                success: true
            }
        } as GetIntentionsBlockAnswer);
    });
});