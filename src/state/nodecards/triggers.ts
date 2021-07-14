import { trigger } from "state/trigger";
import {
    NODE_CARD_PREPARE,
    nodeCardDetailsSet,
    nodeCardLoad,
    NodeCardPrepareAction,
    nodeCardsUnset
} from "state/nodecards/actions";
import { isNodeCardToBeLoaded } from "state/nodecards/selectors";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { EVENT_HOME_NODE_NAME_CHANGED, EVENT_NODE_NODE_NAME_CHANGED, EventAction } from "api/events/actions";
import { NodeNameChangedEvent } from "api/events/api-types";

export default [
    trigger(
        NODE_CARD_PREPARE,
        (state, signal: NodeCardPrepareAction) => isNodeCardToBeLoaded(state, signal.payload.nodeName),
        signal => nodeCardLoad(signal.payload.nodeName)
    ),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, nodeCardsUnset),
    trigger(
        [EVENT_HOME_NODE_NAME_CHANGED, EVENT_NODE_NODE_NAME_CHANGED],
        true,
        (signal: EventAction<NodeNameChangedEvent>) =>
            nodeCardDetailsSet(signal.payload.name, signal.payload.fullName ?? null, signal.payload.gender ?? null,
                signal.payload.title ?? null, signal.payload.avatar ?? null)
    )
];
