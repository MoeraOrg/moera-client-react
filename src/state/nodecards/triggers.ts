import { conj, trigger } from "state/trigger";
import { EventAction, ProfileUpdatedEvent } from "api/events";
import { WithContext } from "state/action-types";
import {
    nodeCardDetailsLoad,
    nodeCardDetailsSet,
    nodeCardPrepareOwners,
    nodeCardsRefresh
} from "state/nodecards/actions";
import { isNodeCardDetailsLoaded } from "state/nodecards/selectors";
import { ProfileSetAction } from "state/profile/actions";
import { isHomeIntroduced } from "state/home/selectors";
import { isNodeIntroduced } from "state/node/selectors";

export default [
    trigger("PULSE_6H", true, nodeCardsRefresh),
    trigger(["NODE_READY", "HOME_READY", "WAKE_UP"], conj(isNodeIntroduced, isHomeIntroduced), nodeCardPrepareOwners),
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
