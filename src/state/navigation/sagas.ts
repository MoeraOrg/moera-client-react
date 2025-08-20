import * as URI from 'uri-js';

import { locationBuild, LocationInfo, locationTransform } from "location";
import { executor } from "state/executor";
import { ClientAction } from "state/action";
import { dispatch, select } from "state/store-sagas";
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
import { homeIntroduced } from "state/init-barriers";
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
    executor("GO_HOME_LOCATION", "", goHomeLocationSaga)
];

function transformation(
    caller: ClientAction,
    srcPath: string | null, srcQuery: string | null, srcHash: string | null,
    dstPath: string | null, dstQuery: string | null, dstHash: string | null
): void {
    const srcInfo = srcPath != null ? LocationInfo.fromUrl(srcPath, srcQuery, srcHash) : new LocationInfo();
    dstPath = dstPath != null && dstPath.startsWith("/moera") ? dstPath.substring(6) : dstPath;
    const dstInfo = LocationInfo.fromUrl(dstPath, dstQuery, dstHash);
    const actions = locationTransform(srcInfo, dstInfo);
    dispatch(locationLock().causedBy(caller));
    for (let a of actions) {
        dispatch(a.causedBy(caller));
    }
    changeLocation(null, caller);
    dispatch(locationUnlock().causedBy(caller));
}

async function initFromNodeLocationSaga(action: InitFromNodeLocationAction): Promise<void> {
    const {nodeName, path, query, hash, fallbackUrl} = action.payload;

    const nodeLocation = await getNodeUri(action, nodeName);
    if (nodeLocation == null) {
        if (fallbackUrl != null) {
            window.location.href = fallbackUrl;
        } else {
            dispatch(nodeReady());
        }
        return;
    }
    const {scheme, host, port} = URI.parse(nodeLocation);
    if (scheme == null || host == null) {
        if (fallbackUrl != null) {
            window.location.href = fallbackUrl;
        } else {
            dispatch(nodeReady());
        }
        return;
    }
    const rootLocation = rootUrl(scheme, host, port);
    dispatch(initFromLocation(nodeName, rootLocation, path, query, hash).causedBy(action));
}

function initFromLocationSaga(action: InitFromLocationAction): void {
    const {path, query, hash} = action.payload;
    transformation(action, null, null, null, path, query, hash);
}

function goToLocationSaga(action: GoToLocationAction): void {
    const current = URI.parse(select(state => state.navigation.location));
    const {path, query, hash} = action.payload;
    transformation(action, current.path || "", current.query || "", current.fragment || "", path, query, hash);
}

function newLocationSaga(action: NewLocationAction): void {
    changeLocation(action.type, action);
}

function updateLocationSaga(action: UpdateLocationAction): void {
    changeLocation(action.type, action);
}

function changeLocation(actionType: "NEW_LOCATION" | "UPDATE_LOCATION" | null, caller: ClientAction): void {
    const info = locationBuild(select(), new LocationInfo());
    const create = actionType == null || actionType === "NEW_LOCATION";
    dispatch(
        locationSet(info.toUrl(), info.title, info.backTitle, info.canonicalUrl, info.noIndexPage, create)
            .causedBy(caller)
    );
}

async function goHomeLocationSaga(action: GoHomeLocationAction): Promise<void> {
    await homeIntroduced();
    const {path, query, hash} = action.payload;
    const {atNode, homeOwnerName, homeRootPage} = select(state => ({
        atNode: isAtNode(state),
        homeOwnerName: getHomeOwnerName(state),
        homeRootPage: getHomeRootPage(state)
    }));
    if (atNode) {
        return;
    }
    if (homeRootPage == null) {
        dispatch(nodeReady());
        return;
    }
    const {scheme, host, port} = URI.parse(homeRootPage);
    if (scheme != null && host != null) {
        const rootLocation = rootUrl(scheme, host, port);
        dispatch(initFromLocation(homeOwnerName, rootLocation, path, query, hash).causedBy(action));
    } else {
        dispatch(nodeReady());
    }
}
