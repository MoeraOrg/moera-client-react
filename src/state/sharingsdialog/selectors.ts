import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { getOwnerName, isPermitted } from "state/node/selectors";
import { ExtPostingInfo } from "state/postings/state";
import { getPosting } from "state/postings/selectors";
import { getNodeCard } from "state/nodecards/selectors";
import { RelNodeName } from "util/rel-node-name";

export function getSharingsDialogPosting(state: ClientState): ExtPostingInfo | null {
    return getPosting(state, state.sharingsDialog.postingId, state.sharingsDialog.nodeName);
}

export function getSharingsDialogNodeName(state: ClientState): RelNodeName | string {
    return getSharingsDialogPosting(state)?.receiverName ?? state.sharingsDialog.nodeName;
}

export function isPostingSharingsPermitted(state: ClientState, posting: PostingInfo): boolean {
    const receiverName = posting.receiverName;
    const card = getNodeCard(state, receiverName);
    const features = receiverName != null && receiverName !== getOwnerName(state)
        ? {
            subscribed: card?.subscription.subscriber != null,
            friendGroups: {available: [], memberOf: card?.friendship.remoteGroups ?? []}
        }
        : null;
    return isPermitted("viewSharings", posting, "public", state, {
        objectSourceName: receiverName,
        objectSourceFeatures: features
    });
}

export function getSharingsDialogRemainingCount(state: ClientState): number {
    return Math.max(0, state.sharingsDialog.total - state.sharingsDialog.items.length);
}

export function isSharingsDialogAllLoaded(state: ClientState): boolean {
    return state.sharingsDialog.after <= Number.MIN_SAFE_INTEGER;
}

export function isSharingsDialogToBeLoaded(state: ClientState): boolean {
    return state.sharingsDialog.show && !state.sharingsDialog.loading && !state.sharingsDialog.loaded;
}
