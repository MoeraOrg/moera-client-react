import { Action } from 'redux';

import { Features } from "api/node/api-types";
import { ActionWithPayload } from "state/action-types";

export const NODE_FEATURES_LOAD = "NODE_FEATURES_LOAD";
export type NodeFeaturesLoadAction = Action<typeof NODE_FEATURES_LOAD>;
export const nodeFeaturesLoad = (): NodeFeaturesLoadAction => ({
    type: NODE_FEATURES_LOAD
});

export const NODE_FEATURES_LOADED = "NODE_FEATURES_LOADED";
export type NodeFeaturesLoadedAction = ActionWithPayload<typeof NODE_FEATURES_LOADED, {
    features: Features;
}>;
export const nodeFeaturesLoaded = (features: Features): NodeFeaturesLoadedAction => ({
    type: NODE_FEATURES_LOADED,
    payload: {features}
});

export type NodeAnyAction =
    NodeFeaturesLoadAction
    | NodeFeaturesLoadedAction;
