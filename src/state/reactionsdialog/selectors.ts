import { PrincipalValue, ReactionInfo } from "api";
import { ClientState } from "state/state";
import { VerificationStatus } from "state/state-types";
import { isPermitted } from "state/node/selectors";
import { ExtPostingInfo } from "state/postings/state";
import { getPosting } from "state/postings/selectors";
import { getComment, getCommentsReceiverFeatures, getCommentsReceiverName } from "state/detailedposting/selectors";
import { ReactionsDialogTabsState } from "state/reactionsdialog/state";
import { RelNodeName } from "util/rel-node-name";

const EMPTY_ARRAY: any[] = [];

export function getReactionsDialogNodeName(state: ClientState): RelNodeName | string {
    return state.reactionsDialog.nodeName;
}

export function getReactionsDialogPostingId(state: ClientState): string | null {
    return state.reactionsDialog.postingId;
}

export function getReactionsDialogPosting(state: ClientState): ExtPostingInfo | null {
    return getPosting(state, state.reactionsDialog.postingId, state.reactionsDialog.nodeName);
}

export function getReactionsDialogReceiverPostingId(state: ClientState): string | null {
    const posting = getReactionsDialogPosting(state);
    return posting != null ? (posting.receiverPostingId ?? posting.id) : null;
}

export function isReactionsDialogShown(state: ClientState): boolean {
    return state.reactionsDialog.show;
}

function getReactions(state: ClientState): ReactionsDialogTabsState | null {
    return state.reactionsDialog.reactions[state.reactionsDialog.activeTab ?? 0] ?? null;
}

export function isReactionsDialogReactionsToBeLoaded(state: ClientState): boolean {
    return !isReactionsDialogReactionsAllLoaded(state) && getReactionsDialogItems(state).length === 0;
}

export function isReactionsDialogLoading(state: ClientState): boolean {
    const reactions = getReactions(state);
    return (reactions != null && reactions.loading) || state.reactionsDialog.totals.loading;
}

export function getReactionsDialogItems(state: ClientState): ReactionInfo[] {
    const reactions = getReactions(state);
    return reactions != null ? reactions.items : EMPTY_ARRAY;
}

export function getReactionsDialogRemainingCount(state: ClientState): number {
    const reactions = getReactions(state);
    return reactions != null ? reactions.total - reactions.items.length : 0;
}

export function isReactionsDialogReactionsAllLoaded(state: ClientState): boolean {
    const reactions = getReactions(state);
    return reactions != null && reactions.after <= Number.MIN_SAFE_INTEGER;
}

export function isReactionsDialogTotalsToBeLoaded(state: ClientState): boolean {
    return !state.reactionsDialog.totals.loaded && !state.reactionsDialog.totals.loading;
}

export function getReactionVerificationStatus(state: ClientState, ownerName: string): VerificationStatus | null {
    return state.reactionsDialog.verificationStatus[ownerName] ?? "none";
}

export function isReactionsDialogPermitted(operation: string, defaultValue: PrincipalValue,
                                           state: ClientState): boolean {
    if (state.reactionsDialog.commentId != null) {
        const comment = getComment(state, state.reactionsDialog.commentId);
        return isPermitted(operation, comment, defaultValue, state, {
            objectSourceName: getCommentsReceiverName(state),
            objectSourceFeatures: getCommentsReceiverFeatures(state)
        });
    } else {
        const posting = getReactionsDialogPosting(state);
        return isPermitted(operation, posting, defaultValue, state, {
            objectSourceName: posting?.receiverName
        });
    }
}
