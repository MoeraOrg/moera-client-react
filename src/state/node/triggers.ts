import i18n from 'i18next';

import { conj, inv, trigger } from "state/trigger";
import { EventAction, NodeNameChangedEvent } from "api/events";
import { InitFromLocationAction, newLocation, updateLocation } from "state/navigation/actions";
import { nodeFeaturesLoad, nodeReady, ownerLoad, ownerSet, ownerVerify } from "state/node/actions";
import { getOwnerName, isAtHomeNode, isAtNode, isOwnerNameRecentlyChanged, isOwnerNameSet } from "state/node/selectors";
import { NamingNameLoadedAction } from "state/naming/actions";
import { messageBox } from "state/messagebox/actions";
import { ClientState } from "state/state";

export default [
    trigger("INIT_FROM_LOCATION", conj(isAtNode, inv(isOwnerNameSet)), ownerLoad),
    trigger(
        "INIT_FROM_LOCATION",
        (_: ClientState, signal: InitFromLocationAction) =>
            signal.payload.nodeName != null || (signal.payload.nodeName == null && signal.payload.rootLocation == null),
        nodeReady
    ),
    trigger("OWNER_SET", true, nodeReady),
    trigger("NODE_READY", conj(isAtNode, isOwnerNameRecentlyChanged), ownerVerify),
    trigger("NODE_READY", true, newLocation),
    trigger("INIT_FROM_LOCATION", isAtNode, nodeFeaturesLoad),
    trigger(
        "NAMING_NAME_LOADED",
        (state, signal: NamingNameLoadedAction) => signal.payload.name === getOwnerName(state),
        updateLocation
    ),
    trigger("PULSE_6H", isOwnerNameSet, ownerVerify),
    trigger("OWNER_SWITCH_FAILED", true, () => messageBox(i18n.t("node-name-not-exists"))),
    trigger(
        "EVENT_NODE_NODE_NAME_CHANGED",
        true,
        (signal: EventAction<NodeNameChangedEvent>) =>
            ownerSet(signal.payload.name, false, signal.payload.fullName ?? null, signal.payload.gender ?? null,
                signal.payload.title ?? null, signal.payload.avatar ?? null)
    ),
    trigger(
        [
            "EVENT_NODE_FRIEND_GROUP_ADDED",
            "EVENT_NODE_FRIEND_GROUP_UPDATED",
            "EVENT_NODE_FRIEND_GROUP_DELETED",
            "EVENT_NODE_PLUGINS_UPDATED",
            "EVENT_NODE_NODE_SETTINGS_CHANGED"
        ],
        true,
        nodeFeaturesLoad
    ),
    trigger(["EVENT_NODE_FRIENDSHIP_UPDATED", "EVENT_NODE_ASK_SUBJECTS_CHANGED"], inv(isAtHomeNode), nodeFeaturesLoad),
    trigger(["SETTINGS_PLUGINS_DELETED", "SETTINGS_UPDATE_SUCCEEDED"], isAtHomeNode, nodeFeaturesLoad)
]
