import { trigger } from "state/trigger";
import { NODE_CARD_PREPARE, nodeCardLoad, NodeCardPrepareAction, nodeCardsUnset } from "state/nodecards/actions";
import { isNodeCardCached, isNodeCardToBeLoaded } from "state/nodecards/selectors";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { EVENT_HOME_PROFILE_UPDATED, EVENT_NODE_PROFILE_UPDATED, EventAction } from "api/events/actions";
import { ProfileUpdatedEvent } from "api/events/api-types";

export default [
    trigger(
        NODE_CARD_PREPARE,
        (state, signal: NodeCardPrepareAction) => isNodeCardToBeLoaded(state, signal.payload.nodeName),
        signal => nodeCardLoad(signal.payload.nodeName)
    ),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, nodeCardsUnset),
    trigger(
        [EVENT_HOME_PROFILE_UPDATED, EVENT_NODE_PROFILE_UPDATED],
        (state, signal: EventAction<ProfileUpdatedEvent>) =>
            signal.payload.sourceNode != null && isNodeCardCached(state, signal.payload.sourceNode),
        signal => nodeCardLoad(signal.payload.sourceNode!)
    )
];
