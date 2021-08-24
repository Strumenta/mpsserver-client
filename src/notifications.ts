import {IssueDescription, NodeIDInfo, NodeInfoDetailed, NodeReference} from "./messages";

export interface ModelListener {
    onNodeAdded?: OnNodeAdded
    onNodeRemoved?: OnNodeRemoved
    onPropertyChanged?: OnPropertyChanged
    onReferenceChanged?: OnReferenceChanged
    onErrorsForModelReported?: OnErrorsForModelReported
    onErrorsForNodeReported?: OnErrorsForNodeReported
}

type OnNodeAdded = (event: NodeAdded) => void;
type OnNodeRemoved = (event: NodeRemoved) => void;
type OnPropertyChanged = (event: PropertyChanged) => void;
type OnReferenceChanged = (event: ReferenceChanged) => void;
type OnErrorsForModelReported = (event: ErrorsForModelReported) => void;
type OnErrorsForNodeReported = (event: ErrorsForNodeReported) => void;

export interface ModelChangesNotification {
    type: "NodeAdded" | "NodeRemoved" | "ReferenceChanged" | "PropertyChanged"
        | "ErrorsForModelReported" | "ErrorsForNodeReported";
}

export interface NodeAdded extends ModelChangesNotification {
    type: "NodeAdded"
    parentNodeId: NodeIDInfo;
    child: NodeInfoDetailed;
    index: number;
    relationName: string;
}

export interface NodeRemoved extends ModelChangesNotification{
    type: "NodeRemoved"
    parentNodeId: NodeIDInfo
    child: NodeInfoDetailed
    index: number
    relationName: string
}

export interface ReferenceChanged extends ModelChangesNotification {
    type: "ReferenceChanged"
    node: NodeReference
    referenceName: string
    referenceValue: NodeReference
}

export interface PropertyChanged extends ModelChangesNotification {
    type: "PropertyChanged"
    node: NodeReference
    propertyName: string
    propertyValue: any
}

export interface ErrorsForModelReported extends ModelChangesNotification {
    type: "ErrorsForModelReported"
    model: string
    issues: IssueDescription[]
}

export interface ErrorsForNodeReported extends ModelChangesNotification {
    type: "ErrorsForNodeReported"
    rootNode: NodeReference
    issues: IssueDescription[]
}
