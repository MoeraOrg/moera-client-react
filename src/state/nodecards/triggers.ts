import { trigger } from "state/trigger";
import { nodeCardDetailsLoad, nodeCardDetailsSet, nodeCardPrepare, nodeCardsUnset } from "state/nodecards/actions";
import { isNodeCardDetailsLoaded } from "state/nodecards/selectors";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, HOME_OWNER_SET } from "state/home/actions";
import { EVENT_HOME_PROFILE_UPDATED, EVENT_NODE_PROFILE_UPDATED, EventAction } from "api/events/actions";
import { ProfileUpdatedEvent } from "api/events/api-types";
import { INIT_FROM_LOCATION, WAKE_UP } from "state/navigation/actions";
import { OWNER_SET } from "state/node/actions";
import { PROFILE_SET, ProfileSetAction } from "state/profile/actions";
import { WithContext } from "state/action-types";

export default [
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, nodeCardsUnset),
    trigger(
        [INIT_FROM_LOCATION, OWNER_SET, CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, WAKE_UP],
        true,
        signal => nodeCardPrepare(signal.context.ownerNameOrUrl)
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, HOME_OWNER_SET],
        true,
        signal => nodeCardPrepare(signal.context.homeOwnerNameOrUrl)
    ),
    trigger(
        PROFILE_SET,
        true,
        (signal: WithContext<ProfileSetAction>) =>
            nodeCardDetailsSet(signal.context.ownerNameOrUrl, signal.payload.profile)
    ),
    trigger(
        [EVENT_HOME_PROFILE_UPDATED, EVENT_NODE_PROFILE_UPDATED],
        (state, signal: EventAction<ProfileUpdatedEvent>) =>
            signal.payload.sourceNode != null && isNodeCardDetailsLoaded(state, signal.payload.sourceNode),
        signal => nodeCardDetailsLoad(signal.payload.sourceNode!)
    )
];
