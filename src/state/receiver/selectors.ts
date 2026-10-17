import { isAtDetailedPostingPage } from "state/navigation/selectors";
import { getCommentsState } from "state/detailedposting/selectors";
import { getHomeOwnerNameOrUrl, getRelNodeNameContext } from "state/home/selectors";
import { getOwnerName, getOwnerNameOrUrl } from "state/node/selectors";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getReactionsDialogNodeName, getReactionsDialogPosting } from "state/reactionsdialog/selectors";
import { ClientState } from "state/state";
import { absoluteNodeName } from "util/rel-node-name";

export function getReceiverNodeName(state: ClientState): string | null {
    if (isAtDetailedPostingPage(state)) {
        const receiverName = getCommentsState(state).receiverName;
        return receiverName != null && receiverName !== getOwnerName(state) ? receiverName : null;
    } else {
        return null;
    }
}

export function getReceiverNodeUri(state: ClientState): string | null {
    return getNamingNameNodeUri(state, getReceiverNodeName(state));
}

export function getReactionsReceiverNodeName(state: ClientState): string | null {
    const posting = getReactionsDialogPosting(state);
    if (posting == null) {
        return null;
    }
    const nodeName = posting.receiverName
        ?? absoluteNodeName(getReactionsDialogNodeName(state), getRelNodeNameContext(state));
    return nodeName !== getHomeOwnerNameOrUrl(state)
            && nodeName !== getOwnerNameOrUrl(state)
            && nodeName !== getReceiverNodeName(state)
        ? nodeName
        : null;
}

export function getReactionsReceiverNodeUri(state: ClientState): string | null {
    return getNamingNameNodeUri(state, getReactionsReceiverNodeName(state));
}
