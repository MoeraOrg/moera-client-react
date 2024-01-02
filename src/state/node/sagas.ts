import { call, put, select } from 'typed-redux-saga';
import * as URI from 'uri-js';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";
import {
    NodeFeaturesLoadAction,
    nodeFeaturesLoaded,
    OwnerLoadAction,
    ownerSet,
    OwnerSwitchAction,
    ownerSwitchClose,
    ownerSwitchFailed,
    ownerVerified,
    OwnerVerifyAction
} from "state/node/actions";
import { getNodeRootPage, getOwnerName } from "state/node/selectors";
import { initFromLocation } from "state/navigation/actions";
import { homeIntroduced, namingInitialized } from "state/init-selectors";
import { getNameDetails, getNodeUri } from "state/naming/sagas";
import { normalizeUrl, rootUrl } from "util/url";
import { WithContext } from "state/action-types";

export default [
    executor("OWNER_LOAD", "", ownerLoadSaga),
    executor("OWNER_VERIFY", null, ownerVerifySaga, namingInitialized),
    executor("OWNER_SWITCH", payload => payload.name, ownerSwitchSaga),
    executor("NODE_FEATURES_LOAD", "", nodeFeaturesLoadSaga, homeIntroduced)
];

function* ownerLoadSaga(action: OwnerLoadAction) {
    try {
        const {
            nodeName = null, nodeNameChanging = false, fullName = null, gender = null, title = null, avatar = null
        } = yield* call(Node.whoAmI, action, "");
        yield* put(ownerSet(nodeName, nodeNameChanging, fullName, gender, title, avatar).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* ownerVerifySaga(action: OwnerVerifyAction) {
    const {rootPage, ownerName} = yield* select(state => ({
        rootPage: getNodeRootPage(state),
        ownerName: getOwnerName(state)
    }));
    if (ownerName == null) {
        return;
    }
    try {
        const nodeUri = normalizeUrl(yield* call(getNodeUri, action, ownerName));
        const correct = normalizeUrl(nodeUri) === rootPage;
        yield* put(ownerVerified(ownerName, correct).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* ownerSwitchSaga(action: WithContext<OwnerSwitchAction>) {
    if (action.payload.name === action.context.ownerName) {
        yield* put(ownerSwitchClose().causedBy(action));
        return;
    }

    try {
        const info = yield* call(getNameDetails, action, action.payload.name, true);
        if (info && info.nodeName && info.nodeUri) {
            const {scheme, host, port, path = null} = URI.parse(info.nodeUri);
            if (scheme != null && host != null) {
                const rootLocation = rootUrl(scheme, host, port);
                yield* put(initFromLocation(info.nodeName, rootLocation, path, null, null).causedBy(action));
            }
        } else {
            yield* put(ownerSwitchFailed().causedBy(action));
        }
    } catch (e) {
        yield* put(ownerSwitchFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* nodeFeaturesLoadSaga(action: NodeFeaturesLoadAction) {
    try {
        const features = yield* call(Node.getFeatures, action, "");
        yield* put(nodeFeaturesLoaded(features).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
