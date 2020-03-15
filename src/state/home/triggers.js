import { inv, trigger } from "state/trigger";
import {
    CONNECTED_TO_HOME,
    DISCONNECT_FROM_HOME,
    disconnectedFromHome,
    homeOwnerSet,
    homeOwnerVerify
} from "state/home/actions";
import { EVENT_HOME_NODE_NAME_CHANGED } from "api/events/actions";
import { hasInactiveConnections } from "state/home/selectors";

export default [
    trigger(CONNECTED_TO_HOME, true, homeOwnerVerify),
    trigger(
        DISCONNECT_FROM_HOME,
        inv(hasInactiveConnections),
        signal => disconnectedFromHome(signal.payload.location, signal.payload.login)
    ),
    trigger(EVENT_HOME_NODE_NAME_CHANGED, true, signal => homeOwnerSet(signal.payload.name)),
    trigger(EVENT_HOME_NODE_NAME_CHANGED, true, homeOwnerVerify),
];
