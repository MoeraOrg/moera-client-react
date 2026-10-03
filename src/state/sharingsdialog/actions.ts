import { SharingsSliceInfo } from "api";
import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { RelNodeName } from "util/rel-node-name";

export type OpenSharingsDialogAction = ActionWithPayload<"OPEN_SHARINGS_DIALOG", {
    nodeName: RelNodeName | string;
    postingId: string;
}>;
export const openSharingsDialog = (nodeName: RelNodeName | string, postingId: string): OpenSharingsDialogAction =>
    actionWithPayload("OPEN_SHARINGS_DIALOG", {nodeName, postingId});

export type CloseSharingsDialogAction = ActionWithoutPayload<"CLOSE_SHARINGS_DIALOG">;
export const closeSharingsDialog = (): CloseSharingsDialogAction => actionWithoutPayload("CLOSE_SHARINGS_DIALOG");

export type SharingsDialogUnsetAction = ActionWithoutPayload<"SHARINGS_DIALOG_UNSET">;
export const sharingsDialogUnset = (): SharingsDialogUnsetAction => actionWithoutPayload("SHARINGS_DIALOG_UNSET");

export type SharingsDialogPastSharingsLoadAction = ActionWithPayload<"SHARINGS_DIALOG_PAST_SHARINGS_LOAD", {
    nodeName: RelNodeName | string;
    postingId: string;
    before: number;
}>;
export const sharingsDialogPastSharingsLoad = (
    nodeName: RelNodeName | string, postingId: string, before: number
): SharingsDialogPastSharingsLoadAction =>
    actionWithPayload("SHARINGS_DIALOG_PAST_SHARINGS_LOAD", {nodeName, postingId, before});

export type SharingsDialogPastSharingsLoadedAction = ActionWithPayload<"SHARINGS_DIALOG_PAST_SHARINGS_LOADED", {
    nodeName: RelNodeName | string;
    postingId: string;
    before: number;
    slice: SharingsSliceInfo;
}>;
export const sharingsDialogPastSharingsLoaded = (
    nodeName: RelNodeName | string, postingId: string, before: number, slice: SharingsSliceInfo
): SharingsDialogPastSharingsLoadedAction =>
    actionWithPayload("SHARINGS_DIALOG_PAST_SHARINGS_LOADED", {nodeName, postingId, before, slice});

export type SharingsDialogPastSharingsLoadFailedAction = ActionWithPayload<"SHARINGS_DIALOG_PAST_SHARINGS_LOAD_FAILED", {
    nodeName: RelNodeName | string;
    postingId: string;
    before: number;
}>;
export const sharingsDialogPastSharingsLoadFailed = (
    nodeName: RelNodeName | string, postingId: string, before: number
): SharingsDialogPastSharingsLoadFailedAction =>
    actionWithPayload("SHARINGS_DIALOG_PAST_SHARINGS_LOAD_FAILED", {nodeName, postingId, before});

export type SharingsDialogAnyAction =
    OpenSharingsDialogAction
    | CloseSharingsDialogAction
    | SharingsDialogUnsetAction
    | SharingsDialogPastSharingsLoadAction
    | SharingsDialogPastSharingsLoadedAction
    | SharingsDialogPastSharingsLoadFailedAction;
