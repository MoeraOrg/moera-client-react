import { call, put, select } from 'typed-redux-saga';
import * as URI from 'uri-js';

import { Naming, Node, NodeName } from "api";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";
import {
    NODE_FEATURES_LOAD,
    nodeFeaturesLoaded,
    OWNER_LOAD,
    OWNER_SWITCH,
    OWNER_VERIFY,
    ownerSet,
    OwnerSwitchAction,
    ownerSwitchClose,
    ownerSwitchFailed,
    ownerVerified
} from "state/node/actions";
import { getNodeRootPage, getOwnerName } from "state/node/selectors";
import { initFromLocation } from "state/navigation/actions";
import { isStandaloneMode } from "state/navigation/selectors";
import { introduced, namingInitialized } from "state/init-selectors";
import { getNodeUri } from "state/naming/sagas";
import { normalizeUrl, rootUrl } from "util/url";

export default [
    executor(OWNER_LOAD, "", ownerLoadSaga),
    executor(OWNER_VERIFY, null, ownerVerifySaga, namingInitialized),
    executor(OWNER_SWITCH, payload => payload.name, ownerSwitchSaga),
    executor(NODE_FEATURES_LOAD, "", nodeFeaturesLoadSaga, introduced)
];

function* ownerLoadSaga() {
    try {
        const {
            nodeName = null, nodeNameChanging = false, fullName = null, gender = null, title = null, avatar = null
        } = yield* call(Node.whoAmI, "");
        yield* put(ownerSet(nodeName, nodeNameChanging, fullName, gender, title, avatar));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* ownerVerifySaga() {
    const {rootPage, ownerName} = yield* select(state => ({
        rootPage: getNodeRootPage(state),
        ownerName: getOwnerName(state)
    }));
    if (ownerName == null) {
        return;
    }
    try {
        const nodeUri = normalizeUrl(yield* call(getNodeUri, ownerName));
        const correct = rootPage === nodeUri;
        yield* put(ownerVerified(ownerName, correct));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* ownerSwitchSaga(action: OwnerSwitchAction) {
    const {standalone, ownerName} = yield* select(state => ({
        standalone: isStandaloneMode(state),
        ownerName: getOwnerName(state)
    }));

    if (action.payload.name === ownerName) {
        yield* put(ownerSwitchClose());
        return;
    }

    try {
        const {name, generation} = NodeName.parse(action.payload.name);
        let info = name != null && generation != null ? yield* Naming.getCurrent(name, generation) : null;
        if ((!info || !info.nodeUri) && name != null) {
            info = yield* Naming.getSimilar(name);
        }
        if (info && info.nodeUri) {
            if (!standalone) {
                try {
                    window.location.href = info.nodeUri;
                } catch (e) {
                    throw new Error("Node location is incorrect: " + info.nodeUri);
                }
            } else {
                const {scheme, host, port, path = null} = URI.parse(info.nodeUri);
                if (scheme != null && host != null) {
                    const rootLocation = rootUrl(scheme, host, port);
                    yield* put(initFromLocation(rootLocation, path, null, null));
                }
            }
        } else {
            yield* put(ownerSwitchFailed());
        }
    } catch (e) {
        yield* put(ownerSwitchFailed());
        yield* put(errorThrown(e));
    }
}

function* nodeFeaturesLoadSaga() {
    try {
        const features = yield* call(Node.getFeatures, "");
        yield* put(nodeFeaturesLoaded(features));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
