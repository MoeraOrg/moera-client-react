import i18n from 'i18next';

import { conj, inv, trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import { isAtProfilePage } from "state/navigation/selectors";
import { isNodeNameToBeLoaded } from "state/nodename/selectors";
import {
    nodeNameLoad,
    nodeNameUnset,
    nodeNameUpdateDialogCancel,
    registerNameDialogCancel
} from "state/nodename/actions";
import { isAtNode } from "state/node/selectors";
import { flashBox } from "state/flashbox/actions";

export default [
    trigger("GO_TO_PAGE", conj(isAtProfilePage, isNodeNameToBeLoaded), nodeNameLoad),
    trigger("HOME_INTRODUCED", isAtProfilePage, nodeNameLoad),
    trigger("HOME_INTRODUCED", inv(isAtProfilePage), nodeNameUnset),
    trigger("REGISTER_NAME_DIALOG", true, dialogOpened(registerNameDialogCancel())),
    trigger("REGISTER_NAME_DIALOG_CANCEL", true, dialogClosed),
    trigger("REGISTER_NAME_SUCCEEDED", isAtNode, nodeNameLoad),
    trigger("NODE_NAME_UPDATE_DIALOG", true, dialogOpened(nodeNameUpdateDialogCancel())),
    trigger("NODE_NAME_UPDATE_DIALOG_CANCEL", true, dialogClosed),
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
