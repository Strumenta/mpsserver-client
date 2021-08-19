import {Client} from "rpc-websockets"

export class MPSServerClient {
    url: string;
    private client: Client;
    private connected: boolean;

    constructor(url: string) {
        this.url = url;
        this.connected = false;
        this.client = new Client(url);
        this.client.on("open", ()=> {
            this.connected = true;
        });
    }

    async connect() {
        const p = new Promise<void>((resolve, reject) => {
            if (this.connected) {
                resolve();
                return;
            }
            this.client.on("open", ()=> {
                this.connected = true;
                resolve();
                return;
            });
        });
        return p;
    }

    async getProjetInfo() {
        const res = await this.client.call('GetProjectInfo', {});
        // @ts-ignore
        return res['projectName'];
    }
}