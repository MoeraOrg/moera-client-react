import { trigger } from "state/trigger";
import { INIT_FROM_LOCATION, newLocation, updateLocation } from "state/navigation/actions";
import { OWNER_SET, OWNER_SWITCH_FAILED, ownerLoad, ownerSet, ownerVerify } from "state/owner/actions";
import { PULSE_6H } from "state/pulse/actions";
import { getOwnerName, isOwnerNameRecentlyChanged, isOwnerNameSet } from "state/owner/selectors";
import { messageBox } from "state/messagebox/actions";
import { EVENT_NODE_NODE_NAME_CHANGED, EventAction } from "api/events/actions";
import { NAMING_NAME_LOADED, NamingNameLoadedAction } from "state/naming/actions";
import { isAtNode } from "state/node/selectors";
import { NodeNameChangedEvent } from "api/events/api-types";

export default [
    trigger(INIT_FROM_LOCATION, isAtNode, ownerLoad),
    trigger(OWNER_SET, isOwnerNameRecentlyChanged, ownerVerify),
    trigger(OWNER_SET, true, newLocation),
    trigger(
        NAMING_NAME_LOADED,
        (state, signal: NamingNameLoadedAction) => signal.payload.name === getOwnerName(state),
        updateLocation
    ),
    trigger(PULSE_6H, isOwnerNameSet, ownerVerify),
    trigger(OWNER_SWITCH_FAILED, true, messageBox("No node with such name exist.")),
    trigger(
        EVENT_NODE_NODE_NAME_CHANGED,
        true,
        (signal: EventAction<NodeNameChangedEvent>) =>
            ownerSet(signal.payload.name, false, signal.payload.fullName ?? null, signal.payload.gender ?? null,
                signal.payload.title ?? null, signal.payload.avatar ?? null)
    )
]
