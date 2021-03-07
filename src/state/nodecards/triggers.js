import { trigger } from "state/trigger";
import { NODE_CARD_PREPARE, nodeCardDetailsSet, nodeCardLoad, nodeCardsUnset } from "state/nodecards/actions";
import { isNodeCardToBeLoaded } from "state/nodecards/selectors";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { EVENT_HOME_NODE_NAME_CHANGED, EVENT_NODE_NODE_NAME_CHANGED } from "api/events/actions";

export default [
    trigger(
        NODE_CARD_PREPARE,
        (state, signal) => isNodeCardToBeLoaded(state, signal.payload.nodeName),
        signal => nodeCardLoad(signal.payload.nodeName)
    ),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, nodeCardsUnset),
    trigger(
        [EVENT_HOME_NODE_NAME_CHANGED, EVENT_NODE_NODE_NAME_CHANGED],
        true,
        signal => nodeCardDetailsSet(
            signal.payload.name, signal.payload.fullName, signal.payload.gender, signal.payload.title)
    )
];
