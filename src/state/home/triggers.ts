import { conj, inv, trigger } from "state/trigger";
import {
    CONNECTED_TO_HOME,
    ConnectedToHomeAction,
    DISCONNECT_FROM_HOME,
    DISCONNECTED_FROM_HOME,
    disconnectedFromHome,
    DisconnectFromHomeAction,
    HOME_OWNER_SET,
    homeFriendGroupsLoad,
    homeIntroduced,
    homeInvisibleUsersLoad,
    homeOwnerSet,
    homeOwnerVerify
} from "state/home/actions";
import { EVENT_HOME_NODE_NAME_CHANGED, EventAction, NodeNameChangedEvent } from "api/events";
import { hasInactiveConnections, isConnectedToHome } from "state/home/selectors";
import { ClientState } from "state/state";

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
        CONNECTED_TO_HOME,
        (state: ClientState, signal: ConnectedToHomeAction) => signal.payload.name != null,
        homeIntroduced
    ),
    trigger(DISCONNECTED_FROM_HOME, true, homeIntroduced),
    trigger(HOME_OWNER_SET, true, homeIntroduced),
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
