import WebSocket from "ws";

type MsgHandler = (data:any, socket: WebSocket)=>void;

export class SimpleWSServer {
    private wss: WebSocket.Server;
    private port: number;

    url() : string {
        return `ws://localhost:${this.port}`;
    }

    constructor(port: number, handlers: {[msgType:string]:MsgHandler}) {
        this.port = port;
        this.wss = new WebSocket.Server({
            port
        });

        this.wss.on('connection', socket => {
            socket.on('message', (datatxt: string) => {
                const data = JSON.parse(datatxt);
                const msgHandler : MsgHandler = handlers[data.method];
                if (msgHandler != null) {
                    msgHandler(data, socket);
                }
            });
        });

    }

    close() {
        this.wss.close();
    }
}