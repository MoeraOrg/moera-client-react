import { call, put, select } from 'typed-redux-saga';
import * as URI from 'uri-js';
import i18n from 'i18next';

import { Node, NodeName } from "api";
import { executor } from "state/executor";
import { ClientState } from "state/state";
import { homeIntroduced, namingInitialized } from "state/init-selectors";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
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
import { getNameDetails, getNodeUri } from "state/naming/sagas";
import { confirmBox } from "state/confirmbox/actions";
import { normalizeUrl, rootUrl } from "util/url";
import { REL_CURRENT } from "util/rel-node-name";

export default [
    executor("OWNER_LOAD", "", ownerLoadSaga),
    executor("OWNER_VERIFY", null, ownerVerifySaga, namingInitialized),
    executor("OWNER_SWITCH", payload => payload.name, ownerSwitchSaga),
    executor("NODE_FEATURES_LOAD", "", nodeFeaturesLoadSaga, homeIntroduced)
];

function* ownerLoadSaga(action: WithContext<OwnerLoadAction>) {
    try {
        const {
            nodeName = null, nodeNameChanging = false, fullName = null, gender = null, title = null, avatar = null
        } = yield* call(Node.whoAmI, action, REL_CURRENT);
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
        if (nodeUri && !correct) {
            const href = yield* select((state: ClientState) => state.navigation.location);
            const {scheme, host, port} = URI.parse(nodeUri);
            if (scheme != null && host != null) {
                const rootLocation = rootUrl(scheme, host, port);
                const {path = null, query = null, fragment = null} = URI.parse(href);
                yield* put(confirmBox(
                    i18n.t("blog-moved", {name: NodeName.shorten(ownerName), location: rootLocation}),
                    i18n.t("open"),
                    i18n.t("cancel"),
                    initFromLocation(ownerName, rootLocation, path, query, fragment)
                ).causedBy(action));
            }
        }
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

function* nodeFeaturesLoadSaga(action: WithContext<NodeFeaturesLoadAction>) {
    try {
        const features = yield* call(Node.getFeatures, action, REL_CURRENT);
        yield* put(nodeFeaturesLoaded(features).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}
