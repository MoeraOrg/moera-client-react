import * as URI from 'uri-js';

import { Storage } from "storage";
import { locationBuild, LocationInfo, locationTransform } from "location";
import { clearSettingsCache } from "api/setting-types";
import { executor } from "state/executor";
import { ClientAction } from "state/action";
import { barrier, dispatch, select } from "state/store-sagas";
import {
    BootAction,
    goHomeLocation,
    GoHomeLocationAction,
    GoToHomePageAction,
    goToPage,
    initFromLocation,
    InitFromLocationAction,
    initFromNodeLocation,
    InitFromNodeLocationAction,
    JumpFarAction,
    jumpNear,
    JumpNearAction,
    locationLock,
    locationSet,
    locationUnlock,
    NewLocationAction,
    UpdateLocationAction
} from "state/navigation/actions";
import { homeIntroduced, mutuallyIntroduced } from "state/init-barriers";
import { nodeReady, nodeUnset, ownerSwitch } from "state/node/actions";
import { getNodeRootLocation, isAtNode } from "state/node/selectors";
import { getHomeOwnerName, getHomeRootLocation, getHomeRootPage } from "state/home/selectors";
import { getNodeUri } from "state/naming/sagas";
import { storyReadingUpdate } from "state/stories/actions";
import * as Browser from "ui/browser";
import { rootUrl } from "util/url";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("BOOT", "", bootSaga),
    executor("INIT_FROM_NODE_LOCATION", "", initFromNodeLocationSaga),
    executor("INIT_FROM_LOCATION", "", initFromLocationSaga),
    executor("JUMP_FAR", "", jumpFarSaga),
    executor("JUMP_NEAR", payload => `${payload.path}:${payload.query}:${payload.hash}`, jumpNearSaga),
    executor("NEW_LOCATION", null, newLocationSaga),
    executor("UPDATE_LOCATION", null, updateLocationSaga),
    executor("GO_HOME_LOCATION", "", goHomeLocationSaga),
    executor("GO_TO_HOME_PAGE", "", goToHomePageSaga),
];

function bootSaga(action: BootAction): void {
    clearSettingsCache();
    Storage.loadData();

    const {
        name, rootLocation, path = null, query = null, hash = null
    } = action.payload.target ?? Browser.parseDocumentLocation();

    if (rootLocation != null) {
        dispatch(initFromLocation(name ?? null, rootLocation, path, query, hash).causedBy(action));
    } else if (name != null) {
        dispatch(initFromNodeLocation(name, path, query, hash, null).causedBy(action));
    } else if (path && path !== "/") {
        dispatch(goHomeLocation(path, query, hash).causedBy(action));
    } else {
        dispatch(goHomeLocation("/news", null, null).causedBy(action));
    }
    const readId = Browser.parameters.get("read");
    if (readId) {
        dispatch(storyReadingUpdate(REL_HOME, "instant", readId, true).causedBy(action));
    }
}

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

// FIXME deprecated
async function initFromNodeLocationSaga(action: InitFromNodeLocationAction): Promise<void> {
    const {nodeName, path, query, hash, fallbackUrl} = action.payload;

    const nodeLocation = await getNodeUri(action, nodeName);
    if (nodeLocation == null) {
        if (fallbackUrl != null) {
            window.location.href = fallbackUrl;
        } else {
            dispatch(goHomeLocation("/news", null, null).causedBy(action));
        }
        return;
    }
    const {scheme, host, port} = URI.parse(nodeLocation);
    if (scheme == null || host == null) {
        if (fallbackUrl != null) {
            window.location.href = fallbackUrl;
        } else {
            dispatch(goHomeLocation("/news", null, null).causedBy(action));
        }
        return;
    }
    const rootLocation = rootUrl(scheme, host, port);
    dispatch(initFromLocation(nodeName, rootLocation, path, query, hash).causedBy(action));
}

// FIXME deprecated
function initFromLocationSaga(action: InitFromLocationAction): void {
    const {path, query, hash} = action.payload;
    transformation(action, null, null, null, path, query, hash);
}

async function jumpFarOnlyNodeAndLocation(
    caller: JumpFarAction, nodeName: string, path: string | null, query: string | null, hash: string | null,
    fallbackUrl: string | null
): Promise<void> {
    const nodeLocation = await getNodeUri(caller, nodeName);
    if (nodeLocation == null) {
        if (fallbackUrl != null) {
            window.location.href = fallbackUrl;
        } else {
            await jumpFarOnlyLocation(caller, "/news", null, null, fallbackUrl);
        }
        return;
    }
    const {scheme, host, port} = URI.parse(nodeLocation);
    if (scheme == null || host == null) {
        if (fallbackUrl != null) {
            window.location.href = fallbackUrl;
        } else {
            await jumpFarOnlyLocation(caller, "/news", null, null, fallbackUrl);
        }
        return;
    }
    const rootLocation = rootUrl(scheme, host, port);
    return jumpFarAnywhere(caller, nodeName, rootLocation, path, query, hash, fallbackUrl);
}

async function jumpFarOnlyLocation(
    caller: JumpFarAction, path: string | null, query: string | null, hash: string | null, fallbackUrl: string | null
): Promise<void> {
    const atNode = select(isAtNode);
    if (atNode) {
        dispatch(jumpNear(path, query, hash).causedBy(caller));
        return;
    }

    await homeIntroduced();

    const {homeOwnerName, homeRootPage} = select(state => ({
        homeOwnerName: getHomeOwnerName(state),
        homeRootPage: getHomeRootPage(state)
    }));

    if (homeRootPage != null) {
        const {scheme, host, port} = URI.parse(homeRootPage);
        if (scheme != null && host != null) {
            const rootLocation = rootUrl(scheme, host, port);
            return jumpFarAnywhere(caller, homeOwnerName, rootLocation, path, query, hash, fallbackUrl);
        }
    }

    dispatch(nodeReady().causedBy(caller));
    return jumpFarAnywhere(caller, homeOwnerName, null, path, query, hash, fallbackUrl);
}

async function jumpFarAnywhere(
    caller: JumpFarAction, nodeName: string | null, rootLocation: string | null, path: string | null,
    query: string | null, hash: string | null, fallbackUrl: string | null
): Promise<void> {
    if (rootLocation != null) {
        // TODO do something like OWNER_SWITCH to do cleaning and emit OWNER_LOAD
        transformation(caller, null, null, null, path, query, hash);
    } else if (nodeName != null) {
        return jumpFarOnlyNodeAndLocation(caller, nodeName, path, query, hash, fallbackUrl);
    } else if (path && path !== "/") {
        return jumpFarOnlyLocation(caller, path, query, hash, fallbackUrl);
    } else {
        return jumpFarOnlyLocation(caller, "/news", null, null, fallbackUrl);
    }
}

async function jumpFarSaga(action: JumpFarAction): Promise<void> {
    const {nodeName, rootLocation, path, query, hash, fallbackUrl} = action.payload;
    return jumpFarAnywhere(action, nodeName, rootLocation, path, query, hash, fallbackUrl);
}

function jumpNearSaga(action: JumpNearAction): void {
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
    if (!info.error) {
        const create = actionType == null || actionType === "NEW_LOCATION";
        dispatch(locationSet(info.toUrl(), info.title, info.canonicalUrl, info.noIndexPage, create).causedBy(caller));
    }
}

// FIXME deprecated
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

    if (homeRootPage != null) {
        const {scheme, host, port} = URI.parse(homeRootPage);
        if (scheme != null && host != null) {
            const rootLocation = rootUrl(scheme, host, port);
            dispatch(initFromLocation(homeOwnerName, rootLocation, path, query, hash).causedBy(action));
            return;
        }
    }

    dispatch(nodeReady().causedBy(action));
    dispatch(initFromLocation(homeOwnerName, null, path, query, hash).causedBy(action));
}

async function goToHomePageSaga(action: GoToHomePageAction<any, any>): Promise<void> {
    await mutuallyIntroduced();

    const {nodeLocation, homeOwnerName, homeLocation} = select(state => ({
        nodeLocation: getNodeRootLocation(state),
        homeOwnerName: getHomeOwnerName(state),
        homeLocation: getHomeRootLocation(state)
    }));

    if (homeLocation == null) {
        dispatch(nodeUnset().causedBy(action));
        return;
    }

    if (nodeLocation !== homeLocation) {
        if (homeOwnerName != null) {
            dispatch(ownerSwitch(homeOwnerName).causedBy(action));
            await barrier(["INIT_FROM_LOCATION", "OWNER_SWITCH_FAILED"], true);
        } else {
            dispatch(initFromLocation(null, homeLocation, null, null, null).causedBy(action))
        }
    }

    dispatch(goToPage(action.payload.page, action.payload.details).causedBy(action));
}
