import { inv, trigger } from "state/trigger";
import {
    ConnectedToHomeAction,
    homeFriendGroupsLoad,
    homeInvisibleUsersLoad,
    homeOwnerSet,
    homeOwnerVerify,
    homeReady
} from "state/home/actions";
import { EventAction, NodeNameChangedEvent } from "api/events";
import { ClientState } from "state/state";
import { isConnectedToHome, isHomeIntroduced } from "state/home/selectors";

export default [
    trigger("CONNECTED_TO_HOME", true, homeOwnerVerify),
    trigger(
        "CONNECTED_TO_HOME",
        (_: ClientState, signal: ConnectedToHomeAction) => signal.payload.name != null,
        homeReady
    ),
    trigger("DISCONNECTED_FROM_HOME", true, homeReady),
    trigger("HOME_OWNER_SET", inv(isHomeIntroduced), homeReady),
    trigger("HOME_READY", isConnectedToHome, homeFriendGroupsLoad),
    trigger("HOME_READY", isConnectedToHome, homeInvisibleUsersLoad),
    trigger(
        "EVENT_HOME_NODE_NAME_CHANGED",
        true,
        (signal: EventAction<NodeNameChangedEvent>) =>
            homeOwnerSet(
                signal.payload.name || null, // may be ""
                false,
                signal.payload.fullName ?? null,
                signal.payload.avatar ?? null
            )
    ),
    trigger("EVENT_HOME_NODE_NAME_CHANGED", true, homeOwnerVerify)
];
