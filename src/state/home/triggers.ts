import { trigger } from "state/trigger";
import {
    CONNECTED_TO_HOME,
    ConnectedToHomeAction,
    DISCONNECTED_FROM_HOME,
    HOME_INTRODUCED,
    HOME_OWNER_SET,
    homeFriendGroupsLoad,
    homeIntroduced,
    homeInvisibleUsersLoad,
    homeOwnerSet,
    homeOwnerVerify
} from "state/home/actions";
import { EVENT_HOME_NODE_NAME_CHANGED, EventAction, NodeNameChangedEvent } from "api/events";
import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";

export default [
    trigger(CONNECTED_TO_HOME, true, homeOwnerVerify),
    trigger(
        CONNECTED_TO_HOME,
        (state: ClientState, signal: ConnectedToHomeAction) => signal.payload.name != null,
        homeIntroduced
    ),
    trigger(DISCONNECTED_FROM_HOME, true, homeIntroduced),
    trigger(HOME_OWNER_SET, true, homeIntroduced),
    trigger(HOME_INTRODUCED, isConnectedToHome, homeFriendGroupsLoad),
    trigger(HOME_INTRODUCED, isConnectedToHome, homeInvisibleUsersLoad),
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
