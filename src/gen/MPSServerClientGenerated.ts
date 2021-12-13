import { BaseWSClient } from "../BaseWSClient";
import { PropertyValue } from "../base";
import { AddChild, AddChildAnswerWithMetadata, AnswerAlternativesItem, AnswerAlternativesWithMetadata, AnswerDefaultInsertionWithMetadata, AnswerForDirectReferencesWithMetadata, AnswerForWrappingReferencesWithMetadata, AnswerPropertyChange, AnswerPropertyChangeWithMetadata, AskAlternatives, AskErrorsForNode, CreateIntentionsBlock, CreateIntentionsBlockAnswer, CreateIntentionsBlockAnswerWithMetadata, CreateRoot, DefaultInsertion, DeleteIntentionsBlock, DeleteNode, DirAlternative, DoneAnswerMessage, DoneAnswerMessageWithMetadata, ErrorsForModelReport, ErrorsForNodeReport, ExecuteAction, ExecuteActionAnswer, ExecuteActionAnswerWithMetadata, ExecuteIntention, GetInstancesOfConcept, GetInstancesOfConceptAnswer, GetInstancesOfConceptAnswerWithMetadata, GetIntentionsBlock, GetIntentionsBlockAnswer, GetIntentionsBlockAnswerWithMetadata, GetModuleInfo, GetModuleInfoAnswerWithMetadata, GetModulesStatus, GetModulesStatusAnswer, GetModulesStatusAnswerWithMetadata, GetNode, GetNodeAnswerWithMetadata, GetProjectInfo, GetProjectInfoAnswerWithMetadata, GetRoots, GetRootsAnswer, GetRootsAnswerWithMetadata, InsertNextSibling, InstantiateConcept, IntroduceSelf, IntroduceSelfAnswerWithMetadata, MakeProject, MakeProjectAnswer, MakeProjectAnswerWithMetadata, ModelInfo, ModelixCheckoutTransientModule, ModelixCheckoutTransientProject, ModelixCleanTransient, ModelixResetModelServer, MoveChild, NewProject, NodeAdded, NodeIDInfo, NodeInfoDetailed, NodeReference, NodeRemoved, OpenProject, OverrideNode, OverrideNodeInfoDetails, PropertyChange, ReferenceChange, ReferenceChanged, RegisterForChangesListener, RegisterForChangesNotification, RegularNodeIDInfo, RequestForDirectReferences, RequestForPropertyChange, RequestForWrappingReferences, SetChild, Status, StatusAnswerWithMetadata, UUID, WraAlternative } from "./messages";

export class MPSServerClientGenerated extends BaseWSClient {
    constructor(url: string) {
        super(url);
    }

    public async executeAction(node: NodeReference, action: string, params: {[key:string]:string}): Promise<ExecuteActionAnswer> {
        await this.connect();
        const _params : ExecuteAction = {node, action, params};
        const res = await this.client.call('ExecuteAction', _params) as ExecuteActionAnswerWithMetadata;
        return {success: res.success, errorMessage: res.errorMessage, result: res.result} as ExecuteActionAnswer;
    }

    public async createIntentionsBlock(node: NodeReference): Promise<CreateIntentionsBlockAnswer> {
        await this.connect();
        const _params : CreateIntentionsBlock = {node};
        const res = await this.client.call('CreateIntentionsBlock', _params) as CreateIntentionsBlockAnswerWithMetadata;
        return {blockUUID: res.blockUUID, intentions: res.intentions} as CreateIntentionsBlockAnswer;
    }

    public async getIntentionsBlock(blockUUID: UUID): Promise<GetIntentionsBlockAnswer> {
        await this.connect();
        const _params : GetIntentionsBlock = {blockUUID};
        const res = await this.client.call('GetIntentionsBlock', _params) as GetIntentionsBlockAnswerWithMetadata;
        return {blockUUID: res.blockUUID, intentions: res.intentions, result: res.result} as GetIntentionsBlockAnswer;
    }

    public async deleteIntentionsBlock(blockUUID: UUID): Promise<void> {
        await this.connect();
        const _params : DeleteIntentionsBlock = {blockUUID};
        await this.client.notify('DeleteIntentionsBlock', _params);
    }

    public async executeIntention(blockUUID: UUID, index: number): Promise<void> {
        await this.connect();
        const _params : ExecuteIntention = {blockUUID, index};
        await this.client.notify('ExecuteIntention', _params);
    }

    public async makeProject(cleanMake: boolean): Promise<MakeProjectAnswer> {
        await this.connect();
        const _params : MakeProject = {cleanMake};
        const res = await this.client.call('MakeProject', _params) as MakeProjectAnswerWithMetadata;
        return {messages: res.messages, success: res.success, message: res.message} as MakeProjectAnswer;
    }

    public async requestForPropertyChange(node: NodeReference, propertyName: string, propertyValue: PropertyValue): Promise<AnswerPropertyChange> {
        await this.connect();
        const _params : RequestForPropertyChange = {node, propertyName, propertyValue};
        const res = await this.client.call('RequestForPropertyChange', _params) as AnswerPropertyChangeWithMetadata;
        return {} as AnswerPropertyChange;
    }

    public async getInstancesOfConcept(modelName: string, conceptName: string): Promise<GetInstancesOfConceptAnswer> {
        await this.connect();
        const _params : GetInstancesOfConcept = {modelName, conceptName};
        const res = await this.client.call('GetInstancesOfConcept', _params) as GetInstancesOfConceptAnswerWithMetadata;
        return {modelName: res.modelName, conceptName: res.conceptName, nodes: res.nodes} as GetInstancesOfConceptAnswer;
    }

    public async getRoots(modelName: string): Promise<GetRootsAnswer> {
        await this.connect();
        const _params : GetRoots = {modelName};
        const res = await this.client.call('GetRoots', _params) as GetRootsAnswerWithMetadata;
        return {modelName: res.modelName, nodes: res.nodes} as GetRootsAnswer;
    }

    public async addChild(container: NodeReference, containmentName: string, conceptToInstantiate: string, index: number, smartRefNodeId?: RegularNodeIDInfo, idOfNewNode?: RegularNodeIDInfo): Promise<NodeReference> {
        await this.connect();
        const _params : AddChild = {container, containmentName, conceptToInstantiate, index, smartRefNodeId, idOfNewNode};
        const res = await this.client.call('AddChild', _params) as AddChildAnswerWithMetadata;
        return res.nodeCreated;
    }

    public async defaultInsertion(modelName: string, container: number, containmentName: string, conceptName: string): Promise<NodeIDInfo> {
        await this.connect();
        const _params : DefaultInsertion = {modelName, container, containmentName, conceptName};
        const res = await this.client.call('DefaultInsertion', _params) as AnswerDefaultInsertionWithMetadata;
        return res.addedNodeID;
    }

    public async askAlternatives(modelName: string, nodeId: number, containmentName: string): Promise<AnswerAlternativesItem[]> {
        await this.connect();
        const _params : AskAlternatives = {modelName, nodeId, containmentName};
        const res = await this.client.call('AskAlternatives', _params) as AnswerAlternativesWithMetadata;
        return res.items;
    }

    public async requestForWrappingReferences(modelName: string, container: number, containmentName: string): Promise<WraAlternative[]> {
        await this.connect();
        const _params : RequestForWrappingReferences = {modelName, container, containmentName};
        const res = await this.client.call('RequestForWrappingReferences', _params) as AnswerForWrappingReferencesWithMetadata;
        return res.items;
    }

    public async requestForDirectReferences(modelName: string, container: number, referenceName: string): Promise<DirAlternative[]> {
        await this.connect();
        const _params : RequestForDirectReferences = {modelName, container, referenceName};
        const res = await this.client.call('RequestForDirectReferences', _params) as AnswerForDirectReferencesWithMetadata;
        return res.items;
    }

    public async getNode(node: NodeReference): Promise<NodeInfoDetailed> {
        await this.connect();
        const _params : GetNode = {node};
        const res = await this.client.call('GetNode', _params) as GetNodeAnswerWithMetadata;
        return res.nodeData;
    }

    public async moveChild(child: NodeReference, index: number): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : MoveChild = {child, index};
        const res = await this.client.call('MoveChild', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    public async overrideNode(modelName: string, node: OverrideNodeInfoDetails): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : OverrideNode = {modelName, node};
        const res = await this.client.call('OverrideNode', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    public async instantiateConcept(nodeToReplace: NodeReference, conceptToInstantiate: string): Promise<void> {
        await this.connect();
        const _params : InstantiateConcept = {nodeToReplace, conceptToInstantiate};
        await this.client.notify('InstantiateConcept', _params);
    }

    public async setChild(container: NodeReference, containmentName: string, conceptToInstantiate: string, smartRefNodeId: RegularNodeIDInfo): Promise<void> {
        await this.connect();
        const _params : SetChild = {container, containmentName, conceptToInstantiate, smartRefNodeId};
        await this.client.notify('SetChild', _params);
    }

    public async deleteNode(node: NodeReference): Promise<void> {
        await this.connect();
        const _params : DeleteNode = {node};
        await this.client.notify('DeleteNode', _params);
    }

    public async insertNextSibling(modelName: string, sibling: number, conceptName: string): Promise<void> {
        await this.connect();
        const _params : InsertNextSibling = {modelName, sibling, conceptName};
        await this.client.notify('InsertNextSibling', _params);
    }

    public async referenceChange(node: NodeReference, referenceName: string, referenceValue: NodeReference): Promise<void> {
        await this.connect();
        const _params : ReferenceChange = {node, referenceName, referenceValue};
        await this.client.notify('ReferenceChange', _params);
    }

    public async createRoot(modelName: string, conceptName: string, propertiesValues: {[key:string]:PropertyValue}): Promise<void> {
        await this.connect();
        const _params : CreateRoot = {modelName, conceptName, propertiesValues};
        await this.client.notify('CreateRoot', _params);
    }

    public async askErrorsForNode(rootNode: NodeReference): Promise<void> {
        await this.connect();
        const _params : AskErrorsForNode = {rootNode};
        await this.client.notify('AskErrorsForNode', _params);
    }

    async registerForChanges(modelName: string, listener: RegisterForChangesListener = {}): Promise<void> {
    await this.connect();
    await this.client.on("PropertyChange", (eventData: PropertyChange) => {
        if (listener.onPropertyChange != null) {
            listener.onPropertyChange(eventData);
        }
    });
    await this.client.on("ReferenceChanged", (eventData: ReferenceChanged) => {
        if (listener.onReferenceChanged != null) {
            listener.onReferenceChanged(eventData);
        }
    });
    await this.client.on("NodeAdded", (eventData: NodeAdded) => {
        if (listener.onNodeAdded != null) {
            listener.onNodeAdded(eventData);
        }
    });
    await this.client.on("NodeRemoved", (eventData: NodeRemoved) => {
        if (listener.onNodeRemoved != null) {
            listener.onNodeRemoved(eventData);
        }
    });
    await this.client.on("ErrorsForModelReport", (eventData: ErrorsForModelReport) => {
        if (listener.onErrorsForModelReport != null) {
            listener.onErrorsForModelReport(eventData);
        }
    });
    await this.client.on("ErrorsForNodeReport", (eventData: ErrorsForNodeReport) => {
        if (listener.onErrorsForNodeReport != null) {
            listener.onErrorsForNodeReport(eventData);
        }
    });
    await this.client.subscribe(["RegisterForChanges", modelName]);
}

    public async openProject(projectPath: string): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : OpenProject = {projectPath};
        const res = await this.client.call('OpenProject', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    public async newProject(): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : NewProject = {};
        const res = await this.client.call('NewProject', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    public async getProjectInfo(): Promise<string> {
        await this.connect();
        const _params : GetProjectInfo = {};
        const res = await this.client.call('GetProjectInfo', _params) as GetProjectInfoAnswerWithMetadata;
        return res.projectName;
    }

    public async status(): Promise<string> {
        await this.connect();
        const _params : Status = {};
        const res = await this.client.call('Status', _params) as StatusAnswerWithMetadata;
        return res.description;
    }

    public async getModulesStatus(): Promise<GetModulesStatusAnswer> {
        await this.connect();
        const _params : GetModulesStatus = {};
        const res = await this.client.call('GetModulesStatus', _params) as GetModulesStatusAnswerWithMetadata;
        return {repoAvailable: res.repoAvailable, modules: res.modules} as GetModulesStatusAnswer;
    }

    public async getModuleInfo(moduleName: string): Promise<ModelInfo[]> {
        await this.connect();
        const _params : GetModuleInfo = {moduleName};
        const res = await this.client.call('GetModuleInfo', _params) as GetModuleInfoAnswerWithMetadata;
        return res.models;
    }

    public async introduceSelf(name: string): Promise<string> {
        await this.connect();
        const _params : IntroduceSelf = {name};
        const res = await this.client.call('IntroduceSelf', _params) as IntroduceSelfAnswerWithMetadata;
        return res.givenName;
    }

    public async modelixCleanTransient(): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : ModelixCleanTransient = {};
        const res = await this.client.call('ModelixCleanTransient', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    public async modelixCheckoutTransientProject(projectName: string, repositoryId: string, versionId: number, modelServerUrl: string): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : ModelixCheckoutTransientProject = {projectName, repositoryId, versionId, modelServerUrl};
        const res = await this.client.call('ModelixCheckoutTransientProject', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    public async modelixCheckoutTransientModule(moduleName: string, repositoryId: string, versionId: number, modelServerUrl: string): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : ModelixCheckoutTransientModule = {moduleName, repositoryId, versionId, modelServerUrl};
        const res = await this.client.call('ModelixCheckoutTransientModule', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    public async modelixResetModelServer(modelServerUrl: string): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : ModelixResetModelServer = {modelServerUrl};
        const res = await this.client.call('ModelixResetModelServer', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }
}
