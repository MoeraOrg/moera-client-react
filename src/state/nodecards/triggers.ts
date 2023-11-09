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
import { EventAction, ProfileUpdatedEvent } from "api/events";
import { ProfileSetAction } from "state/profile/actions";
import { WithContext } from "state/action-types";

export default [
    trigger(["NODE_READY", "HOME_READY"], true, nodeCardsClientSwitch),
    trigger("PULSE_6H", true, nodeCardsRefresh),
    trigger(
        ["NODE_READY", "HOME_READY", "WAKE_UP"],
        true,
        signal => nodeCardPrepare(signal.context.ownerNameOrUrl)
    ),
    trigger("HOME_READY", true, signal => nodeCardPrepare(signal.context.homeOwnerNameOrUrl)),
    trigger(
        "HOME_READY",
        (state, signal: WithContext<Action>) => signal.context.ownerName != null,
        (signal: WithContext<Action>) => nodeCardPrepare(signal.context.ownerName!)
    ),
    trigger(
        "PROFILE_SET",
        true,
        (signal: WithContext<ProfileSetAction>) =>
            nodeCardDetailsSet(signal.context.ownerNameOrUrl, signal.payload.profile)
    ),
    trigger(
        ["EVENT_HOME_PROFILE_UPDATED", "EVENT_NODE_PROFILE_UPDATED"],
        (state, signal: EventAction<ProfileUpdatedEvent>) =>
            signal.payload.sourceNode != null && isNodeCardDetailsLoaded(state, signal.payload.sourceNode),
        signal => nodeCardDetailsLoad(signal.payload.sourceNode!)
    )
];
