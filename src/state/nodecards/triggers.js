import { trigger } from "state/trigger";
import { NODE_CARD_PREPARE, nodeCardLoad, nodeCardsUnset } from "state/nodecards/actions";
import { isNodeCardToBeLoaded } from "state/nodecards/selectors";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";

export default [
    trigger(
        NODE_CARD_PREPARE,
        (state, signal) => isNodeCardToBeLoaded(state, signal.payload.nodeName),
        signal => nodeCardLoad(signal.payload.nodeName)
    ),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, nodeCardsUnset)
];
