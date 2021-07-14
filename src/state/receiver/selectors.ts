import { isAtDetailedPostingPage } from "state/navigation/selectors";
import { getCommentsState } from "state/detailedposting/selectors";
import { getOwnerName } from "state/owner/selectors";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { ClientState } from "state/state";

export function getReceiverNodeName(state: ClientState): string | null {
    if (isAtDetailedPostingPage(state)) {
        const receiverName = getCommentsState(state).receiverName;
        return receiverName != null && receiverName !== getOwnerName(state) ? receiverName : null;
    } else {
        return null;
    }
}

export function getReceiverNodeUri(state: ClientState): string | null {
    const receiverName = getReceiverNodeName(state);
    if (receiverName == null) {
        return null;
    }
    return getNamingNameNodeUri(state, receiverName);
}
