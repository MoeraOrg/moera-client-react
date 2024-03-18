import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { ReactionInfo, ReactionTotalInfo } from "api";
import { RelNodeName } from "util/rel-node-name";

export type OpenReactionsDialogAction = ActionWithPayload<"OPEN_REACTIONS_DIALOG", {
    nodeName: RelNodeName | string;
    postingId: string;
    commentId: string | null;
    negative: boolean;
}>;
export const openReactionsDialog = (
    nodeName: RelNodeName | string, postingId: string, commentId: string | null, negative: boolean
): OpenReactionsDialogAction =>
    actionWithPayload("OPEN_REACTIONS_DIALOG", {nodeName, postingId, commentId, negative});

export type CloseReactionsDialogAction = ActionWithoutPayload<"CLOSE_REACTIONS_DIALOG">;
export const closeReactionsDialog = (): CloseReactionsDialogAction =>
    actionWithoutPayload("CLOSE_REACTIONS_DIALOG");

export type ReactionsDialogUnsetAction = ActionWithoutPayload<"REACTIONS_DIALOG_UNSET">;
export const reactionsDialogUnset = (): ReactionsDialogUnsetAction =>
    actionWithoutPayload("REACTIONS_DIALOG_UNSET");

export type ReactionsDialogPastReactionsLoadAction = ActionWithoutPayload<"REACTIONS_DIALOG_PAST_REACTIONS_LOAD">;
export const reactionsDialogPastReactionsLoad = (): ReactionsDialogPastReactionsLoadAction =>
    actionWithoutPayload("REACTIONS_DIALOG_PAST_REACTIONS_LOAD");

export type ReactionsDialogPastReactionsLoadedAction = ActionWithPayload<"REACTIONS_DIALOG_PAST_REACTIONS_LOADED", {
    reactions: ReactionInfo[];
    postingId: string;
    commentId: string | null;
    negative: boolean;
    emoji: number | null;
    before: number;
    after: number;
    total: number | null;
}>;
export const reactionsDialogPastReactionsLoaded = (
    reactions: ReactionInfo[], postingId: string, commentId: string | null, negative: boolean, emoji: number | null,
    before: number, after: number, total: number | null
): ReactionsDialogPastReactionsLoadedAction =>
    actionWithPayload(
        "REACTIONS_DIALOG_PAST_REACTIONS_LOADED",
        {reactions, postingId, commentId, negative, emoji, before, after, total}
    );

export type ReactionsDialogPastReactionsLoadFailedAction =
    ActionWithPayload<"REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED", {
        postingId: string;
        commentId: string | null;
        negative: boolean;
        emoji: number | null;
    }>;
export const reactionsDialogPastReactionsLoadFailed = (
    postingId: string, commentId: string | null, negative: boolean, emoji: number | null
): ReactionsDialogPastReactionsLoadFailedAction =>
    actionWithPayload("REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED", {postingId, commentId, negative, emoji});

export type ReactionsDialogTotalsLoadAction = ActionWithoutPayload<"REACTIONS_DIALOG_TOTALS_LOAD">;
export const reactionsDialogTotalsLoad = (): ReactionsDialogTotalsLoadAction =>
    actionWithoutPayload("REACTIONS_DIALOG_TOTALS_LOAD");

export type ReactionsDialogTotalsLoaded = ActionWithPayload<"REACTIONS_DIALOG_TOTALS_LOADED", {
    positive: ReactionTotalInfo[];
    negative: ReactionTotalInfo[];
}>;
export const reactionsDialogTotalsLoaded = (
    positive: ReactionTotalInfo[], negative: ReactionTotalInfo[]
): ReactionsDialogTotalsLoaded =>
    actionWithPayload("REACTIONS_DIALOG_TOTALS_LOADED", {positive, negative});

export type ReactionsDialogTotalsLoadFailedAction = ActionWithoutPayload<"REACTIONS_DIALOG_TOTALS_LOAD_FAILED">;
export const reactionsDialogTotalsLoadFailed = (): ReactionsDialogTotalsLoadFailedAction =>
    actionWithoutPayload("REACTIONS_DIALOG_TOTALS_LOAD_FAILED");

export type ReactionsDialogSelectTabAction = ActionWithPayload<"REACTIONS_DIALOG_SELECT_TAB", {
    tab: number | null;
}>;
export const reactionsDialogSelectTab = (tab: number | null): ReactionsDialogSelectTabAction =>
    actionWithPayload("REACTIONS_DIALOG_SELECT_TAB", {tab});

export type ReactionVerifyAction = ActionWithPayload<"REACTION_VERIFY", {
    postingId: string;
    commentId: string | null;
    ownerName: string;
}>;
export const reactionVerify = (
    postingId: string, commentId: string | null, ownerName: string
): ReactionVerifyAction =>
    actionWithPayload("REACTION_VERIFY", {postingId, commentId, ownerName});

export type ReactionVerifyFailedAction = ActionWithPayload<"REACTION_VERIFY_FAILED", {
    postingId: string;
    commentId: string | null;
    ownerName: string;
}>;
export const reactionVerifyFailed = (
    postingId: string, commentId: string | null, ownerName: string
): ReactionVerifyFailedAction =>
    actionWithPayload("REACTION_VERIFY_FAILED", {postingId, commentId, ownerName});

export type ReactionsDialogAnyAction =
    OpenReactionsDialogAction
    | CloseReactionsDialogAction
    | ReactionsDialogUnsetAction
    | ReactionsDialogPastReactionsLoadAction
    | ReactionsDialogPastReactionsLoadedAction
    | ReactionsDialogPastReactionsLoadFailedAction
    | ReactionsDialogTotalsLoadAction
    | ReactionsDialogTotalsLoaded
    | ReactionsDialogTotalsLoadFailedAction
    | ReactionsDialogSelectTabAction
    | ReactionVerifyAction
    | ReactionVerifyFailedAction;
