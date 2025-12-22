import { AvatarImage, Features, NodeType } from "api";
import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type NodeReadyAction = ActionWithoutPayload<"NODE_READY">;
export const nodeReady = (): NodeReadyAction =>
    actionWithoutPayload("NODE_READY");

export type OwnerLoadAction = ActionWithoutPayload<"OWNER_LOAD">;
export const ownerLoad = (): OwnerLoadAction =>
    actionWithoutPayload("OWNER_LOAD");

export type OwnerSetAction = ActionWithPayload<"OWNER_SET", {
    rootLocation: string | null;
    name: string | null;
    changing: boolean | null;
    fullName: string | null | false;
    gender: string | null | false;
    title: string | null | false;
    avatar: AvatarImage | null;
    type: NodeType | null;
}>;
export const ownerSet = (
    rootLocation: string | null, name: string | null, changing: boolean | null, fullName: string | null | false,
    gender: string | null | false, title: string | null | false, avatar: AvatarImage | null, type: NodeType | null
): OwnerSetAction =>
    actionWithPayload("OWNER_SET", {rootLocation, name, changing, fullName, gender, title, avatar, type});

export type OwnerVerifyAction = ActionWithoutPayload<"OWNER_VERIFY">;
export const ownerVerify = (): OwnerVerifyAction =>
    actionWithoutPayload("OWNER_VERIFY");

export type OwnerVerifiedLoadAction = ActionWithPayload<"OWNER_VERIFIED", {
    name: string;
    correct: boolean;
}>;
export const ownerVerified = (name: string, correct: boolean): OwnerVerifiedLoadAction =>
    actionWithPayload("OWNER_VERIFIED", {name, correct});

export type OwnerSwitchAction = ActionWithPayload<"OWNER_SWITCH", {
    nodeName: string | null;
    rootLocation: string | null;
}>;
export const ownerSwitch = (nodeName: string | null, rootLocation: string | null): OwnerSwitchAction =>
    actionWithPayload("OWNER_SWITCH", {nodeName, rootLocation});

export type NodeFeaturesLoadAction = ActionWithoutPayload<"NODE_FEATURES_LOAD">;
export const nodeFeaturesLoad = (): NodeFeaturesLoadAction =>
    actionWithoutPayload("NODE_FEATURES_LOAD");

export type NodeFeaturesLoadedAction = ActionWithPayload<"NODE_FEATURES_LOADED", {
    nodeName: string;
    features: Features;
}>;
export const nodeFeaturesLoaded = (nodeName: string, features: Features): NodeFeaturesLoadedAction =>
    actionWithPayload("NODE_FEATURES_LOADED", {nodeName, features});

export type NodeAnyAction =
    NodeReadyAction
    | OwnerLoadAction
    | OwnerSetAction
    | OwnerVerifyAction
    | OwnerVerifiedLoadAction
    | OwnerSwitchAction
    | NodeFeaturesLoadAction
    | NodeFeaturesLoadedAction;
