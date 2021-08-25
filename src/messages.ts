import {PropertyValue} from "./base";

//
// messages for group Actions
//

export interface ExecuteActionWithMetadata {
  node: NodeReference
  action: string
  params: {[key:string]:string}
  requestId: string
  type: string
}

export interface ExecuteAction {
  node: NodeReference
  action: string
  params: {[key:string]:string}
}

export interface NodeReference {
  model: string
  id: NodeIDInfo
}

export type NodeIDInfo = Record<string, unknown>

export interface RegularNodeIDInfo {
  regularId: number
}

export interface ForeignNodeIDInfo {
  foreignId: string
}

export interface ExecuteActionAnswerWithMetadata {
  success: boolean
  errorMessage: string
  result: unknown
  requestId: string
  type: string
}

export interface ExecuteActionAnswer {
  success: boolean
  errorMessage: string
  result: unknown
}




export interface CreateIntentionsBlockWithMetadata {
  node: NodeReference
  requestId: string
  type: string
}

export interface CreateIntentionsBlock {
  node: NodeReference
}


export interface CreateIntentionsBlockAnswerWithMetadata {
  blockUUID: UUID
  intentions: Intention[]
  requestId: string
  type: string
}

export interface CreateIntentionsBlockAnswer {
  blockUUID: UUID
  intentions: Intention[]
}

export type UUID = string;

export interface Intention {
  index: number
  description: string
}

export interface DeleteIntentionsBlockWithMetadata {
  blockUUID: UUID
  type: string
}

export type DeleteIntentionsBlock = Record<string, unknown>

export interface GetIntentionsBlockWithMetadata {
  blockUUID: UUID
  requestId: string
  type: string
}

export interface GetIntentionsBlock {
  blockUUID: UUID
}

export interface GetIntentionsBlockAnswerWithMetadata {
  blockUUID: UUID
  intentions: Intention[]
  result: Result
  requestId: string
  type: string
}

export interface GetIntentionsBlockAnswer {
  blockUUID: UUID
  intentions: Intention[]
  result: Result
}

export interface Result {
  success: boolean
  explanation?: string
}

export interface ExecuteIntentionWithMetadata {
  blockUUID: UUID
  index: number
  type: string
}

export interface ExecuteIntention {
  blockUUID: UUID
  index: number
}

export interface MakeProjectWithMetadata {
  cleanMake: boolean
  requestId: string
  type: string
}

export interface MakeProject {
  cleanMake: boolean
}

export interface MakeProjectAnswerWithMetadata {
  messages: LogMessage[]
  success: boolean
  message: string
  requestId: string
  type: string
}

export interface MakeProjectAnswer {
  messages: LogMessage[]
  success: boolean
  message: string
}

export interface LogMessage {
  kind: string
  text: string
}

export interface OpenProjectWithMetadata {
  projectPath: string
  requestId: string
  type: string
}

export interface OpenProject {
  projectPath: string
}

export interface DoneAnswerMessageWithMetadata {
  success: boolean
  message: string
  requestId: string
  type: string
}

export interface DoneAnswerMessage {
  success: boolean
  message: string
}

export interface NewProjectWithMetadata {
  requestId: string
  type: string
}

export type NewProject = Record<string, unknown>

export interface GetProjectInfoWithMetadata {
  requestId: string
  type: string
}

export type GetProjectInfo = Record<string, unknown>

export interface GetProjectInfoAnswerWithMetadata {
  projectName: string
  requestId: string
  type: string
}

export interface GetProjectInfoAnswer {
  projectName: string
}

export interface ModelixCleanTransientWithMetadata {
  requestId: string
  type: string
}

export type ModelixCleanTransient = Record<string, unknown>

export interface ModelixCheckoutTransientProjectWithMetadata {
  projectName: string
  repositoryId: string
  versionId: number
  modelServerUrl: string
  requestId: string
  type: string
}

export interface ModelixCheckoutTransientProject {
  projectName: string
  repositoryId: string
  versionId: number
  modelServerUrl: string
}

export interface ModelixCheckoutTransientModuleWithMetadata {
  moduleName: string
  repositoryId: string
  versionId: number
  modelServerUrl: string
  requestId: string
  type: string
}

export interface ModelixCheckoutTransientModule {
  moduleName: string
  repositoryId: string
  versionId: number
  modelServerUrl: string
}

export interface ModelixResetModelServerWithMetadata {
  modelServerUrl: string
  requestId: string
  type: string
}

export interface ModelixResetModelServer {
  modelServerUrl: string
}

export interface StatusWithMetadata {
  requestId: string
  type: string
}

export type Status = Record<string, unknown>

export interface StatusAnswerWithMetadata {
  description: string
  requestId: string
  type: string
}

export interface StatusAnswer {
  description: string
}

export interface GetModulesStatusWithMetadata {
  requestId: string
  type: string
}

export type GetModulesStatus = Record<string, unknown>

export interface GetModulesStatusAnswerWithMetadata {
  repoAvailable: boolean
  modules: ModuleStatus[]
  requestId: string
  type: string
}

export interface GetModulesStatusAnswer {
  repoAvailable: boolean
  modules: ModuleStatus[]
}

export interface ModuleStatus {
  name: string
  deployed: boolean
  canBeDeployed: boolean
  reloadable: boolean
  dependenciesNotFound: string[]
  undeployableDependencies: string[]
}

export interface GetModuleInfoWithMetadata {
  moduleName: string
  requestId: string
  type: string
}

export interface GetModuleInfo {
  moduleName: string
}

export interface GetModuleInfoAnswerWithMetadata {
  models: ModelInfo[]
  requestId: string
  type: string
}

export interface GetModuleInfoAnswer {
  models: ModelInfo[]
}

export interface ModelInfo {
  qualifiedName: string
  uuid: UUID
  foreignName: string
  intValue: number
  readOnly: boolean
}

export interface RequestForPropertyChangeWithMetadata {
  node: NodeReference
  propertyName: string
  propertyValue: any
  requestId: string
  type: string
}

export interface RequestForPropertyChange {
  node: NodeReference
  propertyName: string
  propertyValue: PropertyValue
}

export interface AnswerPropertyChangeWithMetadata {
  requestId: string
  type: string
}

export type AnswerPropertyChange = Record<string, unknown>

export interface RegisterForChangesWithMetadata {
  modelName: string
  type: string
}

export type RegisterForChanges = Record<string, unknown>

export interface NodeInfoDetailed {
  containingLink: string
  children: NodeInfoDetailed[]
  properties: {[key:string]:any}
  refs: {[key:string]:ReferenceInfo}
  id: NodeIDInfo
  name: string
  concept: string
  abstractConcept: boolean
  interfaceConcept: boolean
  conceptAlias: string
}

export interface ReferenceInfo {
  id: NodeIDInfo
  model: ModelInfo
}


export interface GetInstancesOfConceptWithMetadata {
  modelName: string
  conceptName: string
  requestId: string
  type: string
}

export interface GetInstancesOfConcept {
  modelName: string
  conceptName: string
}

export interface GetInstancesOfConceptAnswerWithMetadata {
  modelName: string
  conceptName: string
  nodes: NodeInfo[]
  requestId: string
  type: string
}

export interface GetInstancesOfConceptAnswer {
  modelName: string
  conceptName: string
  nodes: NodeInfo[]
}

export interface NodeInfo {
  id: NodeIDInfo
  name: string
  concept: string
  abstractConcept: boolean
  interfaceConcept: boolean
  conceptAlias: string
}

export interface GetRootsWithMetadata {
  modelName: string
  requestId: string
  type: string
}

export interface GetRoots {
  modelName: string
}

export interface GetRootsAnswerWithMetadata {
  modelName: string
  nodes: NodeInfo[]
  requestId: string
  type: string
}

export interface GetRootsAnswer {
  modelName: string
  nodes: NodeInfo[]
}

export interface InstantiateConceptWithMetadata {
  nodeToReplace: NodeReference
  conceptToInstantiate: string
  type: string
}

export interface InstantiateConcept {
  nodeToReplace: NodeReference
  conceptToInstantiate: string
}

export interface AddChildWithMetadata {
  container: NodeReference
  containmentName: string
  conceptToInstantiate: string
  index: number
  smartRefNodeId: RegularNodeIDInfo
  requestId: string
  type: string
}

export interface AddChild {
  container: NodeReference
  containmentName: string
  conceptToInstantiate: string
  index: number
  smartRefNodeId: RegularNodeIDInfo
}

export interface AddChildAnswerWithMetadata {
  nodeCreated: NodeReference
  requestId: string
  type: string
}

export interface AddChildAnswer {
  nodeCreated: NodeReference
}

export interface SetChildWithMetadata {
  container: NodeReference
  containmentName: string
  conceptToInstantiate: string
  smartRefNodeId: RegularNodeIDInfo
  type: string
}

export interface SetChild {
  container: NodeReference
  containmentName: string
  conceptToInstantiate: string
  smartRefNodeId: RegularNodeIDInfo
}

export interface DeleteNodeWithMetadata {
  node: NodeReference
  type: string
}

export type DeleteNode = Record<string, unknown>

export interface DefaultInsertionWithMetadata {
  modelName: string
  container: number
  containmentName: string
  conceptName: string
  requestId: string
  type: string
}

export interface DefaultInsertion {
  modelName: string
  container: number
  containmentName: string
  conceptName: string
}

export interface AnswerDefaultInsertionWithMetadata {
  addedNodeID: NodeIDInfo
  requestId: string
  type: string
}

export interface AnswerDefaultInsertion {
  addedNodeID: NodeIDInfo
}

export interface InsertNextSiblingWithMetadata {
  modelName: string
  sibling: number
  conceptName: string
  type: string
}

export interface InsertNextSibling {
  modelName: string
  sibling: number
  conceptName: string
}

export interface AskAlternativesWithMetadata {
  modelName: string
  nodeId: number
  containmentName: string
  requestId: string
  type: string
}

export interface AskAlternatives {
  modelName: string
  nodeId: number
  containmentName: string
}

export interface AnswerAlternativesWithMetadata {
  items: AnswerAlternativesItem[]
  requestId: string
  type: string
}

export interface AnswerAlternatives {
  items: AnswerAlternativesItem[]
}

export interface AnswerAlternativesItem {
  conceptName: string
  alias: string
}

export interface RequestForWrappingReferencesWithMetadata {
  modelName: string
  container: number
  containmentName: string
  requestId: string
  type: string
}

export interface RequestForWrappingReferences {
  modelName: string
  container: number
  containmentName: string
}

export interface AnswerForWrappingReferencesWithMetadata {
  items: WraAlternative[]
  requestId: string
  type: string
}

export interface AnswerForWrappingReferences {
  items: WraAlternative[]
}

export interface WraAlternative {
  label: string
  modelName: string
  nodeId: NodeIDInfo
}

export interface RequestForDirectReferencesWithMetadata {
  modelName: string
  container: number
  referenceName: string
  requestId: string
  type: string
}

export interface RequestForDirectReferences {
  modelName: string
  container: number
  referenceName: string
}

export interface AnswerForDirectReferencesWithMetadata {
  items: DirAlternative[]
  requestId: string
  type: string
}

export interface AnswerForDirectReferences {
  items: DirAlternative[]
}

export interface DirAlternative {
  label: string
  modelName: string
  nodeId: NodeIDInfo
}

export interface ReferenceChangeWithMetadata {
  node: NodeReference
  referenceName: string
  referenceValue: NodeReference
  type: string
}

export interface ReferenceChange {
  node: NodeReference
  referenceName: string
  referenceValue: NodeReference
}

export interface CreateRootWithMetadata {
  modelName: string
  conceptName: string
  propertiesValues: {[key:string]:any}
  type: string
}

export interface CreateRoot {
  modelName: string
  conceptName: string
  propertiesValues: {[key:string]:any}
}

export interface AskErrorsForNodeWithMetadata {
  rootNode: NodeReference
  type: string
}

export type AskErrorsForNode = Record<string, unknown>

export interface GetNodeWithMetadata {
  node: NodeReference
  requestId: string
  type: string
}

export interface GetNode {
  node: NodeReference
}

export interface GetNodeAnswerWithMetadata {
  nodeData: NodeInfoDetailed
  requestId: string
  type: string
}

export interface GetNodeAnswer {
  nodeData: NodeInfoDetailed
}

export interface IssueDescription {
  message: string
  severity: string
  node: NodeIDInfo
}
