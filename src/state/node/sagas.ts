import * as URI from 'uri-js';
import i18n from 'i18next';

import { Node, NodeName } from "api";
import { executor } from "state/executor";
import { mutuallyIntroduced, namingInitialized } from "state/init-barriers";
import { dispatch, select } from "state/store-sagas";
import { WithContext } from "state/action-types";
import { errorThrown } from "state/error/actions";
import {
    NodeFeaturesLoadAction,
    nodeFeaturesLoaded,
    OwnerLoadAction,
    ownerSet,
    OwnerSwitchAction,
    ownerSwitchFailed,
    ownerVerified,
    OwnerVerifyAction
} from "state/node/actions";
import { getNodeRootLocation, getNodeRootPage, getOwnerName } from "state/node/selectors";
import { initFromLocation } from "state/navigation/actions";
import { getNameDetails, getNodeUri } from "state/naming/sagas";
import { confirmBox } from "state/confirmbox/actions";
import { normalizeUrl, rootUrl } from "util/url";
import { REL_CURRENT } from "util/rel-node-name";

export default [
    executor("OWNER_LOAD", null, ownerLoadSaga),
    executor("OWNER_VERIFY", null, ownerVerifySaga),
    executor("OWNER_SWITCH", payload => payload.name, ownerSwitchSaga),
    executor("NODE_FEATURES_LOAD", null, nodeFeaturesLoadSaga)
];

async function ownerLoadSaga(action: WithContext<OwnerLoadAction>): Promise<void> {
    const rootLocation = select(getNodeRootLocation);
    try {
        const {
            nodeName = null, nodeNameChanging = false, fullName = null, gender = null, title = null, avatar = null,
            type
        } = await Node.whoAmI(action, REL_CURRENT);
        dispatch(
            ownerSet(rootLocation, nodeName, nodeNameChanging, fullName, gender, title, avatar, type ?? "regular")
                .causedBy(action)
        );
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function ownerVerifySaga(action: OwnerVerifyAction): Promise<void> {
    await namingInitialized();
    const {rootPage, ownerName} = select(state => ({
        rootPage: getNodeRootPage(state),
        ownerName: getOwnerName(state)
    }));
    if (ownerName == null) {
        return;
    }
    try {
        const nodeUri = normalizeUrl(await getNodeUri(action, ownerName));
        const correct = normalizeUrl(nodeUri) === rootPage;
        dispatch(ownerVerified(ownerName, correct).causedBy(action));
        if (nodeUri && !correct) {
            const href = select().navigation.location;
            const {scheme, host, port} = URI.parse(nodeUri);
            if (scheme != null && host != null) {
                const rootLocation = rootUrl(scheme, host, port);
                const {path = null, query = null, fragment = null} = URI.parse(href);
                dispatch(confirmBox({
                    message: i18n.t("blog-moved", {name: NodeName.shorten(ownerName), location: rootLocation}),
                    yes: i18n.t("open"),
                    no: i18n.t("cancel"),
                    onYes: initFromLocation(ownerName, rootLocation, path, query, fragment)
                }).causedBy(action));
            }
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function ownerSwitchSaga(action: WithContext<OwnerSwitchAction>): Promise<void> {
    if (action.payload.name === action.context.ownerName) {
        return;
    }

    try {
        const info = await getNameDetails(action, action.payload.name, true);
        if (info && info.nodeName && info.nodeUri) {
            const {scheme, host, port, path = null} = URI.parse(info.nodeUri);
            if (scheme != null && host != null) {
                const rootLocation = rootUrl(scheme, host, port);
                dispatch(initFromLocation(info.nodeName, rootLocation, path, null, null).causedBy(action));
            }
        } else {
            dispatch(ownerSwitchFailed().causedBy(action));
        }
    } catch (e) {
        dispatch(ownerSwitchFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function nodeFeaturesLoadSaga(action: WithContext<NodeFeaturesLoadAction>): Promise<void> {
    await mutuallyIntroduced();

    const nodeName = action.context.ownerName;
    if (nodeName == null) {
        return;
    }

    try {
        const features = await Node.getFeatures(action, nodeName);
        dispatch(nodeFeaturesLoaded(nodeName, features).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}
