import { conj, inv, trigger } from "state/trigger";
import {
    CONNECTED_TO_HOME,
    DISCONNECT_FROM_HOME,
    disconnectedFromHome,
    DisconnectFromHomeAction,
    homeFriendGroupsLoad,
    homeInvisibleUsersLoad,
    homeOwnerSet,
    homeOwnerVerify
} from "state/home/actions";
import { NodeNameChangedEvent } from "api/events/api-types";
import { EVENT_HOME_NODE_NAME_CHANGED, EventAction } from "api/events/actions";
import { hasInactiveConnections, isConnectedToHome } from "state/home/selectors";

export default [
    trigger(CONNECTED_TO_HOME, true, homeOwnerVerify),
    trigger(
        DISCONNECT_FROM_HOME,
        conj(isConnectedToHome, inv(hasInactiveConnections)),
        (signal: DisconnectFromHomeAction) => disconnectedFromHome(signal.payload.location, signal.payload.login)
    ),
    trigger(CONNECTED_TO_HOME, true, homeFriendGroupsLoad),
    trigger(CONNECTED_TO_HOME, true, homeInvisibleUsersLoad),
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
