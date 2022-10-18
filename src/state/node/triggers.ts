import i18n from 'i18next';

import { trigger } from "state/trigger";
import { FeaturesUpdatedEvent, NodeNameChangedEvent } from "api/events/api-types";
import { EVENT_NODE_FEATURES_UPDATED, EVENT_NODE_NODE_NAME_CHANGED, EventAction } from "api/events/actions";
import { INIT_FROM_LOCATION, newLocation, updateLocation } from "state/navigation/actions";
import {
    nodeFeaturesLoad,
    nodeFeaturesLoaded,
    OWNER_SET,
    OWNER_SWITCH_FAILED,
    ownerLoad,
    ownerSet,
    ownerVerify
} from "state/node/actions";
import { getOwnerName, isAtNode, isOwnerNameRecentlyChanged, isOwnerNameSet } from "state/node/selectors";
import { NAMING_NAME_LOADED, NamingNameLoadedAction } from "state/naming/actions";
import { PULSE_6H } from "state/pulse/actions";
import { messageBox } from "state/messagebox/actions";

export default [
    trigger(INIT_FROM_LOCATION, isAtNode, nodeFeaturesLoad),
    trigger(INIT_FROM_LOCATION, isAtNode, ownerLoad),
    trigger(OWNER_SET, isOwnerNameRecentlyChanged, ownerVerify),
    trigger(OWNER_SET, true, newLocation),
    trigger(
        NAMING_NAME_LOADED,
        (state, signal: NamingNameLoadedAction) => signal.payload.name === getOwnerName(state),
        updateLocation
    ),
    trigger(PULSE_6H, isOwnerNameSet, ownerVerify),
    trigger(OWNER_SWITCH_FAILED, true, messageBox(i18n.t("node-name-not-exists"))),
    trigger(
        EVENT_NODE_NODE_NAME_CHANGED,
        true,
        (signal: EventAction<NodeNameChangedEvent>) =>
            ownerSet(signal.payload.name, false, signal.payload.fullName ?? null, signal.payload.gender ?? null,
                signal.payload.title ?? null, signal.payload.avatar ?? null)
    ),
    trigger(
        EVENT_NODE_FEATURES_UPDATED,
        true,
        (signal: EventAction<FeaturesUpdatedEvent>) => nodeFeaturesLoaded(signal.payload.features)
    )
]
