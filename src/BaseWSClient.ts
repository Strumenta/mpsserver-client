import {Client} from "rpc-websockets"

export abstract class BaseWSClient {
    url: string;
    protected client: Client;
    private connected: boolean;

    // this will be overridden by the generated method
    protected abstract keepAlive() : Promise<void>;

    private wsKeepAlive() {
        console.log("keeping alive...", new Date().toLocaleString());
        this.keepAlive();
        setTimeout(() => {this.wsKeepAlive()}, 9000)
    }

    constructor(url: string) {
        this.url = url;
        this.connected = false;
        this.client = new Client(url);
        this.client.on("open", () => {
            this.connected = true;
            this.wsKeepAlive();
        });
    }

    async connect(waitingTime = 5000) : Promise<unknown> {
        let timer : ReturnType<typeof setTimeout>;
        const timeoutPromise = new Promise((resolve, reject) => timer = setTimeout(() => reject(`timeout expired (${waitingTime} ms) while connecting to ${this.url}`), waitingTime));
        const connectionPromise = new Promise<void>((resolve, reject) => {
            if (this.connected) {
                clearInterval(timer);
                resolve();
                return;
            }
            this.client.on("open", () => {
                this.connected = true;
                clearInterval(timer);
                resolve();
                return;
            });
        });
        return Promise.race([timeoutPromise, connectionPromise]);
    }
}
