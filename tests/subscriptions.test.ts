// import test from 'ava';
import { Server } from 'mock-socket';
import { expect } from 'chai';
import {MPSServerClient} from "../src";
import WebSocket from 'ws';
import {NodeAdded} from "../src/messages";


class ChatApp {
    messages: any[];
    private connection: WebSocket;
    constructor(url: string) {
        this.messages = [];
        this.connection = new WebSocket(url);

        this.connection.onmessage = event => {
            this.messages.push(event.data);
        };
    }

    sendMessage(message: string) {
        this.connection.send(message);
    }
}
//
// // test.cb('that chat app can be mocked', t => {
//     const fakeURL = 'ws://localhost:9000';
//     const mockServer = new Server(fakeURL);
//
//     mockServer.on('connection', socket => {
//         socket.on('message', data => {
//             t.is(data, 'test message from app', 'we have intercepted the message and can assert on it');
//             socket.send('test message from mock server');
//         });
//     });
//
//     const app = new ChatApp(fakeURL);
//     app.sendMessage('test message from app'); // NOTE: this line creates a micro task
//
//     // NOTE: this timeout is for creating another micro task that will happen after the above one
//     setTimeout(() => {
//         t.is(app.messages.length, 1);
//         t.is(app.messages[0], 'test message from mock server', 'we have subbed our websocket backend');
//         // @ts-ignore
//         mockServer.stop(t.done);
//     }, 100);
// // });
describe('subscriptions', () => {
    it('modelChanges', done => {
        // console.log("starting");
        const wss = new WebSocket.Server({
            port: 9000
        });

        // const result = 5 + 2;
        // expect(result).equal(7);
        const fakeURL = 'ws://localhost:9000';
        //const mockServer = new Server(fakeURL);


        wss.on('connection', socket => {
           // console.log("connection");
            socket.on('message', (datatxt: string) => {
                // t.is(data, 'test message from app', 'we have intercepted the message and can assert on it');
                // socket.send('test message from mock server');
                const data = JSON.parse(datatxt);
                // console.log("Server received", data);
                if (data.method === 'rpc.on') {
                    socket.send(JSON.stringify({"jsonrpc": "2.0", "id": data.id, "result": "ok"}))
                    socket.send(JSON.stringify({"notification": "modelChanges", "params": {
                        type: "NodeAdded", parentNodeId : null, child: null, index: 2, relationName: "foos"
                        }}))
                }
            });
        });

        const client = new MPSServerClient(fakeURL);
        const onNodeAddedReceived : NodeAdded[] = [];
        client.connect(500).then(res1 => {
            client.registerForModelChanges("mymodel.foo.bar", {
                onNodeAdded: (notification) => {
                   // console.log("callback for onNodeAdded", notification);
                   onNodeAddedReceived.push(notification);
                }
            }).then( res2 => {
                // console.log("got answer to registerForModelChanges");
                wss.close();
                expect(onNodeAddedReceived.length === 1);
                expect(onNodeAddedReceived[0].index === 2);
                done();
            });
        }).catch(err => {
            done(`failed because not connected ${err}`)
        });
    });
});