import { IntroduceSelf, IntroduceSelfAnswerWithMetadata } from "./gen/messages";
import { MPSServerClientGenerated } from "./gen/MPSServerClientGenerated";

export class MPSServerClient extends MPSServerClientGenerated {
    private myLeases = new Set<string>();
    private assignedName : string | undefined = undefined;

    constructor(url: string) {
        super(url);
        setInterval(() => {this.renewLeases()}, 10000);
    }

    private renewLeases() {
        let toRemove = new Set<string>();
        this.myLeases.forEach((model)=>{
           this.askLease(model).then((answer)=>{
               if (!answer.leaseAcquired) {
                   // lease considered lost
                   toRemove.add(model)
                   console.log("lease lost", model);
               } else {
                   console.log("lease renewed successfully", model);
               }
           }, (error)=>{
               // perhaps it was a communication failure, let's not give up on the lease
           });
        });
        toRemove.forEach((lease)=>this.myLeases.delete(lease));
    }

    async askAndKeepLease(modelName: string) : Promise<boolean> {
        if (this.myLeases.has(modelName)) {
            return true;
        }
        const result = await this.askLease(modelName);
        if (result.leaseAcquired) {
            this.myLeases.add(modelName);
            console.log("acquiring lease", this.assignedName, modelName, result);
            return true;
        } else {
            console.log("acquiring lease failed!", this.assignedName, modelName, result);
            return false;
        }
    }
    async dropLease(modelName: string) : Promise<boolean> {
        if (this.myLeases.has(modelName)) {
            this.myLeases.delete(modelName);
            const result = await this.releaseLease(modelName);
            console.log("dropping lease", this.assignedName, modelName, result);
            return result.success;
        } else {
            return false;
        }
    }

    public async introduceSelf(name: string): Promise<string> {
        await this.connect();
        const _params : IntroduceSelf = {name};
        const res = await this.client.call('IntroduceSelf', _params) as IntroduceSelfAnswerWithMetadata;
        console.log("setting assigned name", res.givenName);
        this.assignedName = res.givenName;
        return res.givenName;
    }
}
