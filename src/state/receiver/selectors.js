import { isAtDetailedPostingPage } from "state/navigation/selectors";
import { getCommentsState } from "state/detailedposting/selectors";
import { getOwnerName } from "state/owner/selectors";
import { getNamingNameNodeUri } from "state/naming/selectors";

export function getReceiverNodeName(state) {
    if (isAtDetailedPostingPage(state)) {
        const receiverName = getCommentsState(state).receiverName;
        return receiverName != null && receiverName !== getOwnerName(state) ? receiverName : null;
    }
}

export function getReceiverNodeUri(state) {
    const receiverName = getReceiverNodeName(state);
    if (receiverName == null) {
        return null;
    }
    return getNamingNameNodeUri(state, receiverName);
}
