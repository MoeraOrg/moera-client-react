import i18n from 'i18next';

import { conj, disj, inv, trigger } from "state/trigger";
import { isAtProfilePage, isAtSettingsPage } from "state/navigation/selectors";
import { isNodeNameToBeLoaded } from "state/nodename/selectors";
import { nodeNameLoad, nodeNameUnset } from "state/nodename/actions";
import { isSettingsAtSecuritySheet } from "state/settings/selectors";
import { isAtNode } from "state/node/selectors";
import { flashBox } from "state/flashbox/actions";

const isAtNodeNamePage = disj(isAtProfilePage, conj(isAtSettingsPage, isSettingsAtSecuritySheet));

export default [
    trigger("GO_TO_PAGE", conj(isAtNodeNamePage, isNodeNameToBeLoaded), nodeNameLoad),
    trigger("HOME_READY", isAtNodeNamePage, nodeNameLoad),
    trigger("HOME_READY", inv(isAtNodeNamePage), nodeNameUnset),
    trigger("REGISTER_NAME_SUCCEEDED", isAtNode, nodeNameLoad),
    trigger("NODE_NAME_UPDATE_SUCCEEDED", true, nodeNameLoad),
    trigger("NODE_NAME_UPDATE_SUCCEEDED", true, () => flashBox(i18n.t("name-operation-started"))),
    trigger(
        ["EVENT_HOME_REGISTERED_NAME_OPERATION_STATUS", "EVENT_HOME_NODE_NAME_CHANGED"],
        isAtNodeNamePage,
        nodeNameLoad
    ),
    trigger(
        ["EVENT_HOME_REGISTERED_NAME_OPERATION_STATUS", "EVENT_HOME_NODE_NAME_CHANGED"],
        inv(isAtNodeNamePage),
        nodeNameUnset
    )
];
