import { trigger } from "state/trigger";
import { FeaturesUpdatedEvent } from "api/events/api-types";
import { EVENT_NODE_FEATURES_UPDATED, EventAction } from "api/events/actions";
import { INIT_FROM_LOCATION } from "state/navigation/actions";
import { nodeFeaturesLoad, nodeFeaturesLoaded } from "state/node/actions";
import { isAtNode } from "state/node/selectors";

export default [
    trigger(INIT_FROM_LOCATION, isAtNode, nodeFeaturesLoad),
    trigger(
        EVENT_NODE_FEATURES_UPDATED,
        true,
        (signal: EventAction<FeaturesUpdatedEvent>) => nodeFeaturesLoaded(signal.payload.features)
    )
]
