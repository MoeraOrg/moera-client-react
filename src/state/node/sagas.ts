import { call, put } from 'typed-redux-saga';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import { NODE_FEATURES_LOAD, nodeFeaturesLoaded } from "state/node/actions";
import { executor } from "state/executor";

export default [
    executor(NODE_FEATURES_LOAD, "", nodeFeaturesLoadSaga),
];

function* nodeFeaturesLoadSaga() {
    try {
        const features = yield* call(Node.getFeatures, "");
        yield* put(nodeFeaturesLoaded(features));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
