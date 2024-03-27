import i18n from 'i18next';

import { conj, inv, trigger } from "state/trigger";
import { isAtProfilePage } from "state/navigation/selectors";
import { isNodeNameToBeLoaded } from "state/nodename/selectors";
import { nodeNameLoad, nodeNameUnset } from "state/nodename/actions";
import { isAtNode } from "state/node/selectors";
import { flashBox } from "state/flashbox/actions";

export default [
    trigger("GO_TO_PAGE", conj(isAtProfilePage, isNodeNameToBeLoaded), nodeNameLoad),
    trigger("HOME_READY", isAtProfilePage, nodeNameLoad),
    trigger("HOME_READY", inv(isAtProfilePage), nodeNameUnset),
    trigger("REGISTER_NAME_SUCCEEDED", isAtNode, nodeNameLoad),
    trigger("NODE_NAME_UPDATE_SUCCEEDED", true, nodeNameLoad),
    trigger("NODE_NAME_UPDATE_SUCCEEDED", true, () => flashBox(i18n.t("name-operation-started"))),
    trigger(
        ["EVENT_NODE_REGISTERED_NAME_OPERATION_STATUS", "EVENT_NODE_NODE_NAME_CHANGED"],
        isAtProfilePage,
        nodeNameLoad
    ),
    trigger(
        ["EVENT_NODE_REGISTERED_NAME_OPERATION_STATUS", "EVENT_NODE_NODE_NAME_CHANGED"],
        inv(isAtProfilePage),
        nodeNameUnset
    )
];
