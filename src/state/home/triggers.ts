import { conj, inv, trigger } from "state/trigger";
import {
    CONNECTED_TO_HOME,
    DISCONNECT_FROM_HOME,
    disconnectedFromHome,
    DisconnectFromHomeAction,
    homeFriendGroupsLoad,
    homeOwnerSet,
    homeOwnerVerify
} from "state/home/actions";
import { EVENT_HOME_NODE_NAME_CHANGED, EventAction } from "api/events/actions";
import { hasInactiveConnections, isConnectedToHome } from "state/home/selectors";
import { NodeNameChangedEvent } from "api/events/api-types";

export default [
    trigger(CONNECTED_TO_HOME, true, homeOwnerVerify),
    trigger(
        DISCONNECT_FROM_HOME,
        conj(isConnectedToHome, inv(hasInactiveConnections)),
        (signal: DisconnectFromHomeAction) => disconnectedFromHome(signal.payload.location, signal.payload.login)
    ),
    trigger(CONNECTED_TO_HOME, true, homeFriendGroupsLoad),
    trigger(
        EVENT_HOME_NODE_NAME_CHANGED,
        true,
        (signal: EventAction<NodeNameChangedEvent>) =>
            homeOwnerSet(
                signal.payload.name || null, // may be ""
                false,
                signal.payload.fullName ?? null,
                signal.payload.avatar ?? null
            )
    ),
    trigger(EVENT_HOME_NODE_NAME_CHANGED, true, homeOwnerVerify)
];
