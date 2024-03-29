import { AvatarImage, Features } from "api";
import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type NodeReadyAction = ActionWithoutPayload<"NODE_READY">;
export const nodeReady = (): NodeReadyAction =>
    actionWithoutPayload("NODE_READY");

export type OwnerLoadAction = ActionWithoutPayload<"OWNER_LOAD">;
export const ownerLoad = (): OwnerLoadAction =>
    actionWithoutPayload("OWNER_LOAD");

export type OwnerSetAction = ActionWithPayload<"OWNER_SET", {
    name: string | null;
    changing: boolean | null;
    fullName: string | null | false;
    gender: string | null | false;
    title: string | null | false;
    avatar: AvatarImage | null;
}>;
export const ownerSet = (
    name: string | null, changing: boolean | null, fullName: string | null | false, gender: string | null | false,
    title: string | null | false, avatar: AvatarImage | null
): OwnerSetAction =>
    actionWithPayload("OWNER_SET", {name, changing, fullName, gender, title, avatar});

export type OwnerVerifyAction = ActionWithoutPayload<"OWNER_VERIFY">;
export const ownerVerify = (): OwnerVerifyAction =>
    actionWithoutPayload("OWNER_VERIFY");

export type OwnerVerifiedLoadAction = ActionWithPayload<"OWNER_VERIFIED", {
    name: string;
    correct: boolean;
}>;
export const ownerVerified = (name: string, correct: boolean): OwnerVerifiedLoadAction =>
    actionWithPayload("OWNER_VERIFIED", {name, correct});

export type OwnerSwitchOpenAction = ActionWithoutPayload<"OWNER_SWITCH_OPEN">;
export const ownerSwitchOpen = (): OwnerSwitchOpenAction =>
    actionWithoutPayload("OWNER_SWITCH_OPEN");

export type OwnerSwitchCloseAction = ActionWithoutPayload<"OWNER_SWITCH_CLOSE">;
export const ownerSwitchClose = (): OwnerSwitchCloseAction =>
    actionWithoutPayload("OWNER_SWITCH_CLOSE");

export type OwnerSwitchAction = ActionWithPayload<"OWNER_SWITCH", {
    name: string;
}>;
export const ownerSwitch = (name: string): OwnerSwitchAction =>
    actionWithPayload("OWNER_SWITCH", {name});

export type OwnerSwitchFailedAction = ActionWithoutPayload<"OWNER_SWITCH_FAILED">;
export const ownerSwitchFailed = (): OwnerSwitchFailedAction =>
    actionWithoutPayload("OWNER_SWITCH_FAILED");

export type NodeFeaturesLoadAction = ActionWithoutPayload<"NODE_FEATURES_LOAD">;
export const nodeFeaturesLoad = (): NodeFeaturesLoadAction =>
    actionWithoutPayload("NODE_FEATURES_LOAD");

export type NodeFeaturesLoadedAction = ActionWithPayload<"NODE_FEATURES_LOADED", {
    features: Features;
}>;
export const nodeFeaturesLoaded = (features: Features): NodeFeaturesLoadedAction =>
    actionWithPayload("NODE_FEATURES_LOADED", {features});

export type NodeAnyAction =
    NodeReadyAction
    | OwnerLoadAction
    | OwnerSetAction
    | OwnerVerifyAction
    | OwnerVerifiedLoadAction
    | OwnerSwitchOpenAction
    | OwnerSwitchCloseAction
    | OwnerSwitchAction
    | OwnerSwitchFailedAction
    | NodeFeaturesLoadAction
    | NodeFeaturesLoadedAction;
