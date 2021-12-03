import { MPSServerClientGenerated } from "./gen/MPSServerClientGenerated";

export class MPSServerClient extends MPSServerClientGenerated {
    private myLeases = new Set<string>();

    constructor(url: string) {
        super(url);
        setInterval(() => {this.renewLeases()}, 10000);
    }

    private renewLeases() {
        this.myLeases.forEach((model)=>{
           this.askLease(model);
        });
    }

    async askAndKeepLease(modelName: string) : Promise<boolean> {
        if (this.myLeases.has(modelName)) {
            return true;
        }
        const result = await this.askLease(modelName);
        if (result.leaseAcquired) {
            this.myLeases.add(modelName);
            return true;
        } else {
            return false;
        }
    }
    async dropLease(modelName: string) : Promise<boolean> {
        if (this.myLeases.has(modelName)) {
            this.myLeases.delete(modelName);
            const result = await this.releaseLease(modelName);
            return result.success;
        } else {
            return false;
        }
    }
}
