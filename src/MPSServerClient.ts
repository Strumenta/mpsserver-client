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

    async getProjetInfo() : Promise<string> {
        const res = await this.client.call('GetProjectInfo', {}) as any;
        return res.projectName;
    }

    async getStatus() : Promise<string> {
        const res = await this.client.call('Status', {}) as any;
        return res.description;
    }

    async getModuleStatus() : Promise<GetModuleStatusAnswer> {
        const res = await this.client.call('GetModulesStatus', {}) as GetModuleStatusAnswer;
        return res;
    }

    async createIntentionsBlock(node: NodeReference) : Promise<CreateIntentionsBlockAnswer> {
        const res = await this.client.call('CreateIntentionsBlock', {node}) as CreateIntentionsBlockAnswer;
        return res;
    }

    // async deleteIntentionsBlock(blockUUID: string) : Promise<void> {
    //     const res = await this.client.call('DeleteIntentionsBlock', {blockUUID}) as CreateIntentionsBlockAnswer;
    //     return res;
    // }
}

interface GetModuleStatusAnswer {
    repoAvailable: boolean;
    modules: ModuleStatus[];
}

interface ModuleStatus {
    name: string;
    deployed: boolean;
    canBeDeployed: boolean;
    reloadable: boolean;
    dependenciesNotFound: string[];
    undeployableDependencies: string[];
}

interface CreateIntentionsBlockAnswer {
    blockUUID: string;
    intentions: Intention[];
}

interface NodeReference {
    model: string;
    id: NodeIDInfo;
}

interface Intention {
    model: string;
    id: NodeIDInfo;
}

type NodeIDInfo = { }

interface RegularNodeIDInfo extends NodeIDInfo {
    regularId: number;
}

interface ForeignNodeIDInfo extends NodeIDInfo {
    foreignId: string;
}