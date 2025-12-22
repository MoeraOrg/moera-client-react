import i18n from 'i18next';
import * as URI from 'uri-js';

import { Storage } from "storage";
import { locationBuild, LocationInfo, locationTransform } from "location";
import { clearSettingsCache } from "api/setting-types";
import { executor } from "state/executor";
import { ClientAction } from "state/action";
import { dispatch, select } from "state/store-sagas";
import {
    BootAction,
    JumpFarAction,
    jumpNear,
    JumpNearAction,
    locationSet,
    NewLocationAction,
    restoreFar,
    RestoreFarAction,
    RestoreNearAction,
    UpdateLocationAction
} from "state/navigation/actions";
import { homeIntroduced } from "state/init-barriers";
import { nodeReady, ownerSwitch } from "state/node/actions";
import { getNodeRootLocation, getOwnerName, isAtNode } from "state/node/selectors";
import { getHomeOwnerName, getHomeRootPage } from "state/home/selectors";
import { getNodeUri } from "state/naming/sagas";
import { storyReadingUpdate } from "state/stories/actions";
import { messageBox } from "state/messagebox/actions";
import * as Browser from "ui/browser";
import { rootUrl } from "util/url";
import { REL_HOME } from "util/rel-node-name";
import { universalLocation } from "util/universal-url";

export default [
    executor("BOOT", "", bootSaga),
    executor("JUMP_FAR", "", navigateFarSaga),
    executor("JUMP_NEAR", payload => `${payload.path}:${payload.query}:${payload.hash}`, navigateNearSaga),
    executor("RESTORE_FAR", "", navigateFarSaga),
    executor("RESTORE_NEAR", payload => `${payload.path}:${payload.query}:${payload.hash}`, navigateNearSaga),
    executor("NEW_LOCATION", null, newLocationSaga),
    executor("UPDATE_LOCATION", null, updateLocationSaga),
];

function bootSaga(action: BootAction): void {
    clearSettingsCache();
    Storage.loadData();

    const {
        name = null, rootLocation = null, path = null, query = null, hash = null
    } = action.payload.target ?? Browser.parseDocumentLocation();

    dispatch(restoreFar(name, rootLocation, path, query, hash).causedBy(action));

    const readId = Browser.parameters.get("read");
    if (readId) {
        dispatch(storyReadingUpdate(REL_HOME, "instant", readId, true).causedBy(action));
    }
}

async function navigateFarSaga(action: JumpFarAction | RestoreFarAction): Promise<void> {
    const {nodeName, rootLocation, path, query, hash, fallbackUrl} = action.payload;
    return navigateFar(action, nodeName, rootLocation, path, query, hash, fallbackUrl);
}

async function navigateFar(
    caller: ClientAction, nodeName: string | null, rootLocation: string | null, path: string | null,
    query: string | null, hash: string | null, fallbackUrl: string | null
): Promise<void> {
    if (rootLocation != null) {
        dispatch(ownerSwitch(nodeName, rootLocation).causedBy(caller));
        transformation(caller, null, null, null, path, query, hash);
    } else if (nodeName != null) {
        return navigateFarOnlyNodeAndLocation(caller, nodeName, path, query, hash, fallbackUrl);
    } else if (path && path !== "/") {
        return navigateFarOnlyLocation(caller, path, query, hash, fallbackUrl);
    } else {
        return navigateFarOnlyLocation(caller, "/news", null, null, fallbackUrl);
    }
}

async function navigateFarOnlyNodeAndLocation(
    caller: ClientAction, nodeName: string, path: string | null, query: string | null, hash: string | null,
    fallbackUrl: string | null
): Promise<void> {
    const nodeLocation = await getNodeUri(caller, nodeName);
    if (nodeLocation == null) {
        if (fallbackUrl != null) {
            window.location.href = fallbackUrl;
        } else {
            await navigateFarOnlyLocation(caller, "/news", null, null, fallbackUrl);
            dispatch(messageBox(i18n.t("node-name-not-exists")));
        }
        return;
    }
    const {scheme, host, port} = URI.parse(nodeLocation);
    if (scheme == null || host == null) {
        if (fallbackUrl != null) {
            window.location.href = fallbackUrl;
        } else {
            await navigateFarOnlyLocation(caller, "/news", null, null, fallbackUrl);
        }
        return;
    }
    const rootLocation = rootUrl(scheme, host, port);
    return navigateFar(caller, nodeName, rootLocation, path, query, hash, fallbackUrl);
}

async function navigateFarOnlyLocation(
    caller: ClientAction, path: string | null, query: string | null, hash: string | null, fallbackUrl: string | null
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
            return navigateFar(caller, homeOwnerName, rootLocation, path, query, hash, fallbackUrl);
        }
    }

    // Global page, no node
    dispatch(ownerSwitch(null, null).causedBy(caller));
    dispatch(nodeReady().causedBy(caller));
    // TODO If the target page requires a home node, do nothing
    transformation(caller, null, null, null, path, query, hash);
}

function navigateNearSaga(action: JumpNearAction | RestoreNearAction): void {
    const current = URI.parse(select(state => state.navigation.location));
    const {path, query, hash} = action.payload;
    transformation(action, current.path || "", current.query || "", current.fragment || "", path, query, hash);
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
    for (let a of actions) {
        dispatch(a.causedBy(caller));
    }
}

function newLocationSaga(action: NewLocationAction): void {
    changeLocation(true, action);
}

function updateLocationSaga(action: UpdateLocationAction): void {
    changeLocation(false, action);
}

function changeLocation(create: boolean, caller: ClientAction): void {
    const info = locationBuild(select(), new LocationInfo());
    if (info.error) {
        return;
    }
    const location = info.toUrl();
    dispatch(locationSet(location, info.title, info.canonicalUrl, info.noIndexPage).causedBy(caller));

    const nodeName = select(getOwnerName);
    const rootLocation = select(getNodeRootLocation);
    const url = universalLocation(Browser.getRootLocation(), nodeName, rootLocation, location);

    const data = {location: url};
    if (create) {
        window.history.pushState(data, "", url);
    } else {
        window.history.replaceState(data, "", url);
    }
    window.Android?.locationChanged(url, location);
}

// async function goToHomePageSaga(action: GoToHomePageAction<any, any>): Promise<void> {
//     await mutuallyIntroduced();
//
//     const {nodeLocation, homeOwnerName, homeLocation} = select(state => ({
//         nodeLocation: getNodeRootLocation(state),
//         homeOwnerName: getHomeOwnerName(state),
//         homeLocation: getHomeRootLocation(state)
//     }));
//
//     if (homeLocation == null) {
//         dispatch(nodeUnset().causedBy(action));
//         return;
//     }
//
//     if (nodeLocation !== homeLocation) {
//         if (homeOwnerName != null) {
//             dispatch(ownerSwitch(homeOwnerName).causedBy(action));
//             await barrier(["INIT_FROM_LOCATION", "OWNER_SWITCH_FAILED"], true);
//         } else {
//             dispatch(initFromLocation(null, homeLocation, null, null, null).causedBy(action))
//         }
//     }
//
//     dispatch(goToPage(action.payload.page, action.payload.details).causedBy(action));
// }
