import { Action } from 'redux';

import { trigger } from "state/trigger";
import {
    nodeCardDetailsLoad,
    nodeCardDetailsSet,
    nodeCardPrepare,
    nodeCardsClientSwitch,
    nodeCardsRefresh
} from "state/nodecards/actions";
import { isNodeCardDetailsLoaded } from "state/nodecards/selectors";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, HOME_OWNER_SET, HomeOwnerSetAction } from "state/home/actions";
import { EVENT_HOME_PROFILE_UPDATED, EVENT_NODE_PROFILE_UPDATED, EventAction, ProfileUpdatedEvent } from "api/events";
import { INIT_FROM_LOCATION, WAKE_UP } from "state/navigation/actions";
import { OWNER_SET, OwnerSetAction } from "state/node/actions";
import { PROFILE_SET, ProfileSetAction } from "state/profile/actions";
import { WithContext } from "state/action-types";
import { PULSE_6H } from "state/pulse/actions";

export default [
    trigger(
        [INIT_FROM_LOCATION, CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, HOME_OWNER_SET],
        true,
        nodeCardsClientSwitch
    ),
    trigger(PULSE_6H, true, nodeCardsRefresh),
    trigger(
        [INIT_FROM_LOCATION, CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, WAKE_UP],
        true,
        signal => nodeCardPrepare(signal.context.ownerNameOrUrl)
    ),
    trigger(
        OWNER_SET,
        (state, signal: WithContext<OwnerSetAction>) => signal.payload.name != null,
        signal => nodeCardPrepare(signal.payload.name!)
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME],
        true,
        signal => nodeCardPrepare(signal.context.homeOwnerNameOrUrl)
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, HOME_OWNER_SET],
        (state, signal: WithContext<Action>) => signal.context.ownerName != null,
        (signal: WithContext<Action>) => nodeCardPrepare(signal.context.ownerName!)
    ),
    trigger(
        HOME_OWNER_SET,
        (state, signal: WithContext<HomeOwnerSetAction>) => signal.payload.name != null,
        signal => nodeCardPrepare(signal.payload.name!)
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
