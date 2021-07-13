import { Action } from 'redux';

import { ActionWithPayload } from "state/action-base";
import { ReactionInfo, ReactionTotalInfo } from "api/node/api-types";

export const OPEN_REACTIONS_DIALOG = "OPEN_REACTIONS_DIALOG";
type OpenReactionsDialogAction = ActionWithPayload<typeof OPEN_REACTIONS_DIALOG, {
    nodeName: string;
    postingId: string;
    commentId: string | null;
    negative: boolean;
}>;
export const openReactionsDialog = (nodeName: string, postingId: string, commentId: string | null,
                                    negative: boolean): OpenReactionsDialogAction => ({
    type: OPEN_REACTIONS_DIALOG,
    payload: {nodeName, postingId, commentId, negative}
});

export const CLOSE_REACTIONS_DIALOG = "CLOSE_REACTIONS_DIALOG";
type CloseReactionsDialogAction = Action<typeof CLOSE_REACTIONS_DIALOG>;
export const closeReactionsDialog = (): CloseReactionsDialogAction => ({
    type: CLOSE_REACTIONS_DIALOG
});

export const REACTIONS_DIALOG_UNSET = "REACTIONS_DIALOG_UNSET";
type ReactionsDialogUnsetAction = Action<typeof REACTIONS_DIALOG_UNSET>;
export const reactionsDialogUnset = (): ReactionsDialogUnsetAction => ({
    type: REACTIONS_DIALOG_UNSET
});

export const REACTIONS_DIALOG_PAST_REACTIONS_LOAD = "REACTIONS_DIALOG_PAST_REACTIONS_LOAD";
type ReactionsDialogPastReactionsLoadAction = Action<typeof REACTIONS_DIALOG_PAST_REACTIONS_LOAD>;
export const reactionsDialogPastReactionsLoad = (): ReactionsDialogPastReactionsLoadAction => ({
    type: REACTIONS_DIALOG_PAST_REACTIONS_LOAD
});

export const REACTIONS_DIALOG_PAST_REACTIONS_LOADED = "REACTIONS_DIALOG_PAST_REACTIONS_LOADED";
type ReactionsDialogPastReactionsLoadedAction = ActionWithPayload<typeof REACTIONS_DIALOG_PAST_REACTIONS_LOADED, {
    reactions: ReactionInfo[];
    postingId: string;
    commentId: string | null;
    negative: boolean;
    emoji: number;
    before: number;
    after: number;
    total: number | null;
}>;
export const reactionsDialogPastReactionsLoaded = (reactions: ReactionInfo[], postingId: string,
                                                   commentId: string | null, negative: boolean, emoji: number,
                                                   before: number, after: number,
                                                   total: number | null): ReactionsDialogPastReactionsLoadedAction => ({
    type: REACTIONS_DIALOG_PAST_REACTIONS_LOADED,
    payload: {reactions, postingId, commentId, negative, emoji, before, after, total}
});

export const REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED = "REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED";
type ReactionsDialogPastReactionsLoadFailedAction = ActionWithPayload<typeof REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED, {
    postingId: string;
    commentId: string | null;
    negative: boolean;
    emoji: number;
}>;
export const reactionsDialogPastReactionsLoadFailed = (postingId: string, commentId: string | null, negative: boolean,
                                                       emoji: number): ReactionsDialogPastReactionsLoadFailedAction => ({
    type: REACTIONS_DIALOG_PAST_REACTIONS_LOAD_FAILED,
    payload: {postingId, commentId, negative, emoji}
});

export const REACTIONS_DIALOG_TOTALS_LOAD = "REACTIONS_DIALOG_TOTALS_LOAD";
type ReactionsDialogTotalsLoadAction = Action<typeof REACTIONS_DIALOG_TOTALS_LOAD>;
export const reactionsDialogTotalsLoad = (): ReactionsDialogTotalsLoadAction => ({
    type: REACTIONS_DIALOG_TOTALS_LOAD
});

export const REACTIONS_DIALOG_TOTALS_LOADED = "REACTIONS_DIALOG_TOTALS_LOADED";
type ReactionsDialogTotalsLoaded = ActionWithPayload<typeof REACTIONS_DIALOG_TOTALS_LOADED, {
    positive: ReactionTotalInfo[];
    negative: ReactionTotalInfo[];
}>;
export const reactionsDialogTotalsLoaded = (positive: ReactionTotalInfo[],
                                            negative: ReactionTotalInfo[]): ReactionsDialogTotalsLoaded => ({
    type: REACTIONS_DIALOG_TOTALS_LOADED,
    payload: {positive, negative}
});

export const REACTIONS_DIALOG_TOTALS_LOAD_FAILED = "REACTIONS_DIALOG_TOTALS_LOAD_FAILED";
type ReactionsDialogTotalsLoadFailedAction = Action<typeof REACTIONS_DIALOG_TOTALS_LOAD_FAILED>;
export const reactionsDialogTotalsLoadFailed = (): ReactionsDialogTotalsLoadFailedAction => ({
    type: REACTIONS_DIALOG_TOTALS_LOAD_FAILED
});

export const REACTIONS_DIALOG_SELECT_TAB = "REACTIONS_DIALOG_SELECT_TAB";
type ReactionsDialogSelectTabAction = ActionWithPayload<typeof REACTIONS_DIALOG_SELECT_TAB, {
    tab: string;
}>;
export const reactionsDialogSelectTab = (tab: string): ReactionsDialogSelectTabAction => ({
    type: REACTIONS_DIALOG_SELECT_TAB,
    payload: {tab}
});

export const REACTION_VERIFY = "REACTION_VERIFY";
type ReactionVerifyAction = ActionWithPayload<typeof REACTION_VERIFY, {
    postingId: string;
    commentId: string | null;
    ownerName: string;
}>;
export const reactionVerify = (postingId: string, commentId: string | null,
                               ownerName: string): ReactionVerifyAction => ({
    type: REACTION_VERIFY,
    payload: {postingId, commentId, ownerName}
});

export const REACTION_VERIFY_FAILED = "REACTION_VERIFY_FAILED";
type ReactionVerifyFailedAction = ActionWithPayload<typeof REACTION_VERIFY_FAILED, {
    postingId: string;
    commentId: string | null;
    ownerName: string;
}>;
export const reactionVerifyFailed = (postingId: string, commentId: string | null,
                                     ownerName: string): ReactionVerifyFailedAction => ({
    type: REACTION_VERIFY_FAILED,
    payload: {postingId, commentId, ownerName}
});

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
