import {Client} from "rpc-websockets"

export abstract class BaseWSClient {
    url: string;
    protected client: Client;
    private connected: boolean;

    constructor(url: string) {
        this.url = url;
        this.connected = false;
        this.client = new Client(url);
        this.client.on("open", () => {
            this.connected = true;
        });
    }

    async connect() {
        const p = new Promise<void>((resolve, reject) => {
            if (this.connected) {
                resolve();
                return;
            }
            this.client.on("open", () => {
                this.connected = true;
                resolve();
                return;
            });
        });
        return p;
    }
}