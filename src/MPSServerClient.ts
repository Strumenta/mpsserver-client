import { BaseWSClient } from "./BaseWSClient";
import {
    ExecuteAction,
    ExecuteActionAnswer,
    ExecuteActionAnswerWithMetadata, GetModuleInfo, GetModuleInfoAnswerWithMetadata,
    GetModulesStatusAnswer,
    GetModulesStatusAnswerWithMetadata, ModelInfo,
    ModelixCheckoutTransientModule,
    ModelixCheckoutTransientProject,
    ModelixCleanTransient,
    ModelixResetModelServer
} from "./messages";
import { NodeReference } from "./messages";
import { CreateIntentionsBlock, CreateIntentionsBlockAnswer, CreateIntentionsBlockAnswerWithMetadata } from "./messages";
import { GetIntentionsBlock, GetIntentionsBlockAnswer, GetIntentionsBlockAnswerWithMetadata } from "./messages";
import { DeleteIntentionsBlock } from "./messages";
import { UUID } from "./messages";
import { ExecuteIntention } from "./messages";
import { MakeProject, MakeProjectAnswer, MakeProjectAnswerWithMetadata } from "./messages";
import { OpenProject, DoneAnswerMessage, DoneAnswerMessageWithMetadata } from "./messages";
import { NewProject } from "./messages";
import { GetProjectInfo, GetProjectInfoAnswerWithMetadata } from "./messages";
import { Status, StatusAnswerWithMetadata } from "./messages";
import { GetModulesStatus } from "./messages";
import { RequestForPropertyChange, AnswerPropertyChange, AnswerPropertyChangeWithMetadata } from "./messages";
import { GetInstancesOfConcept, GetInstancesOfConceptAnswer, GetInstancesOfConceptAnswerWithMetadata } from "./messages";
import { GetRoots, GetRootsAnswer, GetRootsAnswerWithMetadata } from "./messages";
import { AddChild, AddChildAnswerWithMetadata } from "./messages";
import { DefaultInsertion, AnswerDefaultInsertionWithMetadata } from "./messages";
import { NodeIDInfo } from "./messages";
import { AskAlternatives, AnswerAlternativesWithMetadata } from "./messages";
import { AnswerAlternativesItem } from "./messages";
import { RequestForWrappingReferences, AnswerForWrappingReferencesWithMetadata } from "./messages";
import { WraAlternative } from "./messages";
import { RequestForDirectReferences, AnswerForDirectReferencesWithMetadata } from "./messages";
import { DirAlternative } from "./messages";
import { GetNode, GetNodeAnswerWithMetadata } from "./messages";
import { NodeInfoDetailed } from "./messages";
import { InstantiateConcept } from "./messages";
import { SetChild } from "./messages";
import { RegularNodeIDInfo } from "./messages";
import { DeleteNode } from "./messages";
import { InsertNextSibling } from "./messages";
import { ReferenceChange } from "./messages";
import { CreateRoot } from "./messages";
import { AskErrorsForNode } from "./messages";
import {
    ErrorsForModelReported, ErrorsForNodeReported,
    ModelChangesNotification,
    ModelListener,
    NodeAdded,
    NodeRemoved,
    PropertyChanged,
    ReferenceChanged
} from "./notifications";
import {PropertyValue} from "./base";

export class MPSServerClient extends BaseWSClient {
    async createIntentionsBlock(node: NodeReference): Promise<CreateIntentionsBlockAnswer> {
        await this.connect();
        const _params : CreateIntentionsBlock = {node};
        const res = await this.client.call('CreateIntentionsBlock', _params) as CreateIntentionsBlockAnswerWithMetadata;
        return {blockUUID: res.blockUUID, intentions: res.intentions} as CreateIntentionsBlockAnswer;
    }

    async getIntentionsBlock(blockUUID: UUID): Promise<GetIntentionsBlockAnswer> {
        await this.connect();
        const _params : GetIntentionsBlock = {blockUUID};
        const res = await this.client.call('GetIntentionsBlock', _params) as GetIntentionsBlockAnswerWithMetadata;
        return {blockUUID: res.blockUUID, intentions: res.intentions, result: res.result} as GetIntentionsBlockAnswer;
    }

    async deleteIntentionsBlock(blockUUID: UUID): Promise<void> {
        await this.connect();
        const _params : DeleteIntentionsBlock = {blockUUID};
        await this.client.notify('DeleteIntentionsBlock', _params);
    }

    async executeIntention(blockUUID: UUID, index: number): Promise<void> {
        await this.connect();
        const _params : ExecuteIntention = {blockUUID, index};
        await this.client.notify('ExecuteIntention', _params);
    }

    async executeAction(node: NodeReference, action: string, params: {[key:string]:string}): Promise<ExecuteActionAnswer> {
        await this.connect();
        const _params : ExecuteAction = {node, action, params};
        const res = await this.client.call('ExecuteAction', _params) as ExecuteActionAnswerWithMetadata;
        return {success: res.success, errorMessage: res.errorMessage, result: res.result} as ExecuteActionAnswer;
    }

    async makeProject(cleanMake: boolean): Promise<MakeProjectAnswer> {
        await this.connect();
        const _params : MakeProject = {cleanMake};
        const res = await this.client.call('MakeProject', _params) as MakeProjectAnswerWithMetadata;
        return {messages: res.messages, success: res.success, message: res.message} as MakeProjectAnswer;
    }

    async openProject(projectPath: string): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : OpenProject = {projectPath};
        const res = await this.client.call('OpenProject', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    async newProject(): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : NewProject = {};
        const res = await this.client.call('NewProject', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    async getProjectInfo(): Promise<string> {
        await this.connect();
        const _params : GetProjectInfo = {};
        const res = await this.client.call('GetProjectInfo', _params) as GetProjectInfoAnswerWithMetadata;
        return res.projectName;
    }

    async modelixCleanTransient(): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : ModelixCleanTransient = {};
        const res = await this.client.call('ModelixCleanTransient', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    async modelixCheckoutTransientProject(projectName: string, repositoryId: string, versionId: number, modelServerUrl: string): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : ModelixCheckoutTransientProject = {projectName, repositoryId, versionId, modelServerUrl};
        const res = await this.client.call('ModelixCheckoutTransientProject', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    async modelixCheckoutTransientModule(moduleName: string, repositoryId: string, versionId: number, modelServerUrl: string): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : ModelixCheckoutTransientModule = {moduleName, repositoryId, versionId, modelServerUrl};
        const res = await this.client.call('ModelixCheckoutTransientModule', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    async modelixResetModelServer(modelServerUrl: string): Promise<DoneAnswerMessage> {
        await this.connect();
        const _params : ModelixResetModelServer = {modelServerUrl};
        const res = await this.client.call('ModelixResetModelServer', _params) as DoneAnswerMessageWithMetadata;
        return {success: res.success, message: res.message} as DoneAnswerMessage;
    }

    async status(): Promise<string> {
        await this.connect();
        const _params : Status = {};
        const res = await this.client.call('Status', _params) as StatusAnswerWithMetadata;
        return res.description;
    }

    async getModulesStatus(): Promise<GetModulesStatusAnswer> {
        await this.connect();
        const _params : GetModulesStatus = {};
        const res = await this.client.call('GetModulesStatus', _params) as GetModulesStatusAnswerWithMetadata;
        return {repoAvailable: res.repoAvailable, modules: res.modules} as GetModulesStatusAnswer;
    }

    async getModuleInfo(moduleName: string): Promise<ModelInfo[]> {
        await this.connect();
        const _params : GetModuleInfo = {moduleName};
        const res = await this.client.call('GetModuleInfo', _params) as GetModuleInfoAnswerWithMetadata;
        return res.models;
    }

    async requestForPropertyChange(node: NodeReference, propertyName: string, propertyValue: PropertyValue): Promise<AnswerPropertyChange> {
        await this.connect();
        const _params : RequestForPropertyChange = {node, propertyName, propertyValue};
        const res = await this.client.call('RequestForPropertyChange', _params) as AnswerPropertyChangeWithMetadata;
        return {} as AnswerPropertyChange;
    }

    async getInstancesOfConcept(modelName: string, conceptName: string): Promise<GetInstancesOfConceptAnswer> {
        await this.connect();
        const _params : GetInstancesOfConcept = {modelName, conceptName};
        const res = await this.client.call('GetInstancesOfConcept', _params) as GetInstancesOfConceptAnswerWithMetadata;
        return {modelName: res.modelName, conceptName: res.conceptName, nodes: res.nodes} as GetInstancesOfConceptAnswer;
    }

    async getRoots(modelName: string): Promise<GetRootsAnswer> {
        await this.connect();
        const _params : GetRoots = {modelName};
        const res = await this.client.call('GetRoots', _params) as GetRootsAnswerWithMetadata;
        return {modelName: res.modelName, nodes: res.nodes} as GetRootsAnswer;
    }

    async addChild(container: NodeReference, containmentName: string, conceptToInstantiate: string, index: number, smartRefNodeId: RegularNodeIDInfo): Promise<NodeReference> {
        await this.connect();
        const _params : AddChild = {container, containmentName, conceptToInstantiate, index, smartRefNodeId};
        const res = await this.client.call('AddChild', _params) as AddChildAnswerWithMetadata;
        return res.nodeCreated;
    }

    async defaultInsertion(modelName: string, container: number, containmentName: string, conceptName: string): Promise<NodeIDInfo> {
        await this.connect();
        const _params : DefaultInsertion = {modelName, container, containmentName, conceptName};
        const res = await this.client.call('DefaultInsertion', _params) as AnswerDefaultInsertionWithMetadata;
        return res.addedNodeID;
    }

    async askAlternatives(modelName: string, nodeId: number, containmentName: string): Promise<AnswerAlternativesItem[]> {
        await this.connect();
        const _params : AskAlternatives = {modelName, nodeId, containmentName};
        const res = await this.client.call('AskAlternatives', _params) as AnswerAlternativesWithMetadata;
        return res.items;
    }

    async requestForWrappingReferences(modelName: string, container: number, containmentName: string): Promise<WraAlternative[]> {
        await this.connect();
        const _params : RequestForWrappingReferences = {modelName, container, containmentName};
        const res = await this.client.call('RequestForWrappingReferences', _params) as AnswerForWrappingReferencesWithMetadata;
        return res.items;
    }

    async requestForDirectReferences(modelName: string, container: number, referenceName: string): Promise<DirAlternative[]> {
        await this.connect();
        const _params : RequestForDirectReferences = {modelName, container, referenceName};
        const res = await this.client.call('RequestForDirectReferences', _params) as AnswerForDirectReferencesWithMetadata;
        return res.items;
    }

    async getNode(node: NodeReference): Promise<NodeInfoDetailed> {
        await this.connect();
        const _params : GetNode = {node};
        const res = await this.client.call('GetNode', _params) as GetNodeAnswerWithMetadata;
        return res.nodeData;
    }

    async instantiateConcept(nodeToReplace: NodeReference, conceptToInstantiate: string): Promise<void> {
        await this.connect();
        const _params : InstantiateConcept = {nodeToReplace, conceptToInstantiate};
        await this.client.notify('InstantiateConcept', _params);
    }

    async setChild(container: NodeReference, containmentName: string, conceptToInstantiate: string, smartRefNodeId: RegularNodeIDInfo): Promise<void> {
        await this.connect();
        const _params : SetChild = {container, containmentName, conceptToInstantiate, smartRefNodeId};
        await this.client.notify('SetChild', _params);
    }

    async deleteNode(node: NodeReference): Promise<void> {
        await this.connect();
        const _params : DeleteNode = {node};
        await this.client.notify('DeleteNode', _params);
    }

    async insertNextSibling(modelName: string, sibling: number, conceptName: string): Promise<void> {
        await this.connect();
        const _params : InsertNextSibling = {modelName, sibling, conceptName};
        await this.client.notify('InsertNextSibling', _params);
    }

    async referenceChange(node: NodeReference, referenceName: string, referenceValue: NodeReference): Promise<void> {
        await this.connect();
        const _params : ReferenceChange = {node, referenceName, referenceValue};
        await this.client.notify('ReferenceChange', _params);
    }

    async createRoot(modelName: string, conceptName: string, propertiesValues: {[key:string]:any}): Promise<void> {
        await this.connect();
        const _params : CreateRoot = {modelName, conceptName, propertiesValues};
        await this.client.notify('CreateRoot', _params);
    }

    async askErrorsForNode(rootNode: NodeReference): Promise<void> {
        await this.connect();
        const _params : AskErrorsForNode = {rootNode};
        await this.client.notify('AskErrorsForNode', _params);
    }

    async registerForModelChanges(modelName: string, modelListener: ModelListener = {}) : Promise<void> {
        await this.connect();
        this.client.addListener("modelChanges", (eventData: ModelChangesNotification)=>{
            if (eventData.type === "NodeAdded") {
                if (modelListener.onNodeAdded != null) {
                    modelListener.onNodeAdded(eventData as NodeAdded);
                }
            } else if (eventData.type === "NodeRemoved") {
                if (modelListener.onNodeRemoved != null) {
                    modelListener.onNodeRemoved(eventData as NodeRemoved);
                }
            } else if (eventData.type === "PropertyChanged") {
                if (modelListener.onPropertyChanged != null) {
                    modelListener.onPropertyChanged(eventData as PropertyChanged);
                }
            } else if (eventData.type === "ReferenceChanged") {
                if (modelListener.onReferenceChanged != null) {
                    modelListener.onReferenceChanged(eventData as ReferenceChanged);
                }
            } else if (eventData.type === "ErrorsForModelReported") {
                if (modelListener.onErrorsForModelReported != null) {
                    modelListener.onErrorsForModelReported(eventData as ErrorsForModelReported);
                }
            } else if (eventData.type === "ErrorsForNodeReported") {
                if (modelListener.onErrorsForNodeReported != null) {
                    modelListener.onErrorsForNodeReported(eventData as ErrorsForNodeReported);
                }
            } else {
                throw new Error(`unknown ModelChanges notification type: ${eventData.type as string}`);
            }
        });
        await this.client.subscribe(["modelChanges", modelName]);
    }
}

