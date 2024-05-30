import { call, put, select } from 'typed-redux-saga';
import * as URI from 'uri-js';

import { locationBuild, LocationInfo, locationTransform } from "location";
import { executor } from "state/executor";
import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import {
    GoHomeLocationAction,
    GoToLocationAction,
    initFromLocation,
    InitFromLocationAction,
    InitFromNodeLocationAction,
    locationLock,
    locationSet,
    locationUnlock,
    NewLocationAction,
    UpdateLocationAction
} from "state/navigation/actions";
import { homeIntroduced } from "state/init-selectors";
import { nodeReady } from "state/node/actions";
import { isAtNode } from "state/node/selectors";
import { getHomeOwnerName, getHomeRootPage } from "state/home/selectors";
import { getNodeUri } from "state/naming/sagas";
import { rootUrl } from "util/url";

export default [
    executor("INIT_FROM_NODE_LOCATION", "", initFromNodeLocationSaga),
    executor("INIT_FROM_LOCATION", "", initFromLocationSaga),
    executor("NEW_LOCATION", null, newLocationSaga),
    executor("UPDATE_LOCATION", null, updateLocationSaga),
    executor("GO_TO_LOCATION", payload => `${payload.path}:${payload.query}:${payload.hash}`, goToLocationSaga),
    executor("GO_HOME_LOCATION", "", goHomeLocationSaga, homeIntroduced)
];

function* transformation(caller: ClientAction,
                         srcPath: string | null, srcQuery: string | null, srcHash: string | null,
                         dstPath: string | null, dstQuery: string | null, dstHash: string | null) {
    const srcInfo = srcPath != null ? LocationInfo.fromUrl(srcPath, srcQuery, srcHash) : new LocationInfo();
    dstPath = dstPath != null && dstPath.startsWith("/moera") ? dstPath.substring(6) : dstPath;
    const dstInfo = LocationInfo.fromUrl(dstPath, dstQuery, dstHash);
    const actions = locationTransform(srcInfo, dstInfo);
    yield* put(locationLock().causedBy(caller));
    for (let a of actions) {
        yield* put(a.causedBy(caller));
    }
    yield* call(changeLocation, null);
    yield* put(locationUnlock().causedBy(caller));
}

function* initFromNodeLocationSaga(action: InitFromNodeLocationAction) {
    const {nodeName, path, query, hash, fallbackUrl} = action.payload;

    const nodeLocation = yield* call(getNodeUri, action, nodeName);
    if (nodeLocation == null) {
        if (fallbackUrl != null) {
            window.location.href = fallbackUrl;
        } else {
            yield* put(nodeReady());
        }
        return;
    }
    const {scheme, host, port} = URI.parse(nodeLocation);
    if (scheme == null || host == null) {
        if (fallbackUrl != null) {
            window.location.href = fallbackUrl;
        } else {
            yield* put(nodeReady());
        }
        return;
    }
    const rootLocation = rootUrl(scheme, host, port);
    yield* put(initFromLocation(nodeName, rootLocation, path, query, hash).causedBy(action));
}

function* initFromLocationSaga(action: InitFromLocationAction) {
    const {path, query, hash} = action.payload;
    yield* call(transformation, action, null, null, null, path, query, hash);
}

function* goToLocationSaga(action: GoToLocationAction) {
    const current = URI.parse(yield* select(state => state.navigation.location));
    const {path, query, hash} = action.payload;
    yield* call(transformation, action, current.path || "", current.query || "", current.fragment || "", path, query,
        hash);
}

function* newLocationSaga(action: NewLocationAction) {
    yield* call(changeLocation, action);
}

function* updateLocationSaga(action: UpdateLocationAction) {
    yield* call(changeLocation, action);
}

function* changeLocation(action: NewLocationAction | UpdateLocationAction | null) {
    const info = yield* select(locationBuild, new LocationInfo());
    const update = action == null || action.type === "NEW_LOCATION";
    yield* put(locationSet(info.toUrl(), info.title, info.canonicalUrl, info.noIndexPage, update).causedBy(action));
}

function* goHomeLocationSaga(action: GoHomeLocationAction) {
    const {path, query, hash} = action.payload;
    const {atNode, homeOwnerName, homeRootPage} = yield* select((state: ClientState) => ({
        atNode: isAtNode(state),
        homeOwnerName: getHomeOwnerName(state),
        homeRootPage: getHomeRootPage(state)
    }));
    if (atNode) {
        return;
    }
    if (homeRootPage == null) {
        yield* put(nodeReady());
        return;
    }
    const {scheme, host, port} = URI.parse(homeRootPage);
    if (scheme != null && host != null) {
        const rootLocation = rootUrl(scheme, host, port);
        yield* put(initFromLocation(homeOwnerName, rootLocation, path, query, hash).causedBy(action));
    } else {
        yield* put(nodeReady());
    }
}
