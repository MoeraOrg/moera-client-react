import { trigger } from "state/trigger";
import { nodeCardDetailsLoad, nodeCardsUnset } from "state/nodecards/actions";
import { isNodeCardDetailsLoaded } from "state/nodecards/selectors";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { EVENT_HOME_PROFILE_UPDATED, EVENT_NODE_PROFILE_UPDATED, EventAction } from "api/events/actions";
import { ProfileUpdatedEvent } from "api/events/api-types";

export default [
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, nodeCardsUnset),
    trigger(
        [EVENT_HOME_PROFILE_UPDATED, EVENT_NODE_PROFILE_UPDATED],
        (state, signal: EventAction<ProfileUpdatedEvent>) =>
            signal.payload.sourceNode != null && isNodeCardDetailsLoaded(state, signal.payload.sourceNode),
        signal => nodeCardDetailsLoad(signal.payload.sourceNode!)
    )
];
