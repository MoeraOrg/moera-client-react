import { conj, inv, trigger } from "state/trigger";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { GO_TO_PAGE } from "state/navigation/actions";
import { isAtProfilePage } from "state/navigation/selectors";
import { isNodeNameToBeLoaded } from "state/nodename/selectors";
import {
    REGISTER_NAME_SUCCEEDED,
    NODE_NAME_UPDATE_SUCCEEDED,
    nodeNameLoad,
    nodeNameUnset
} from "state/nodename/actions";
import { EVENT_NODE_NODE_NAME_CHANGED, EVENT_NODE_REGISTERED_NAME_OPERATION_STATUS } from "api/events/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtProfilePage, isNodeNameToBeLoaded), nodeNameLoad),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], isAtProfilePage, nodeNameLoad),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], inv(isAtProfilePage), nodeNameUnset),
    trigger(REGISTER_NAME_SUCCEEDED, true, nodeNameLoad),
    trigger(NODE_NAME_UPDATE_SUCCEEDED, true, nodeNameLoad),
    trigger(
        [EVENT_NODE_REGISTERED_NAME_OPERATION_STATUS, EVENT_NODE_NODE_NAME_CHANGED],
        isAtProfilePage,
        nodeNameLoad
    ),
    trigger(
        [EVENT_NODE_REGISTERED_NAME_OPERATION_STATUS, EVENT_NODE_NODE_NAME_CHANGED],
        inv(isAtProfilePage),
        nodeNameUnset
    )
];
