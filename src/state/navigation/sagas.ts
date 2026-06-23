import i18n from 'i18next';
import * as URI from 'uri-js';

import { Storage } from "storage";
import { Node, VisitDetails } from "api";
import { locationBuild, LocationInfo, locationTransform } from "location";
import { clearSettingsCache } from "api/setting-types";
import { saga } from "state/saga";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { ClientState } from "state/state";
import { dispatch, select } from "state/store-sagas";
import { homeIntroduced, nodeIntroduced } from "state/init-barriers";
import {
    BootAction,
    JumpFarAction,
    jumpNear,
    JumpNearAction,
    locationSet,
    NewLocationAction,
    recordExternalVisit,
    RecordExternalVisitAction,
    restoreFar,
    RestoreFarAction,
    RestoreNearAction,
    UpdateLocationAction
} from "state/navigation/actions";
import { isAtDetailedPostingPage } from "state/navigation/selectors";
import { nodeReady, ownerSwitch } from "state/node/actions";
import { getNodeRootLocation, getOwnerName, isAtHomeNode, isAtNode } from "state/node/selectors";
import { getHomeOwnerName, getHomeRootLocation } from "state/home/selectors";
import { getNodeUri } from "state/naming/sagas";
import { storyReadingUpdate } from "state/stories/actions";
import { getDetailedPostingId, getFocusedCommentId } from "state/detailedposting/selectors";
import {
    getLightboxCommentId,
    getLightboxMediaId,
    getLightboxPostingId,
    isLightboxShown
} from "state/lightbox/selectors";
import { messageBox } from "state/messagebox/actions";
import * as Browser from "ui/browser";
import { rootUrl } from "util/url";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import { universalLocation } from "util/universal-url";

export default [
    saga("BOOT", "", bootSaga),
    saga("RECORD_EXTERNAL_VISIT", "", recordExternalVisitSaga),
    saga("JUMP_FAR", "", navigateFarSaga),
    saga("JUMP_NEAR", payload => `${payload.path}:${payload.query}:${payload.hash}`, navigateNearSaga),
    saga("RESTORE_FAR", "", navigateFarSaga),
    saga("RESTORE_NEAR", payload => `${payload.path}:${payload.query}:${payload.hash}`, navigateNearSaga),
    saga("NEW_LOCATION", null, newLocationSaga),
    saga("UPDATE_LOCATION", null, updateLocationSaga),
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

    if (document.referrer) {
        dispatch(recordExternalVisit(document.referrer).causedBy(action));
    }
}

async function recordExternalVisitSaga(action: WithContext<RecordExternalVisitAction>): Promise<void> {
    await nodeIntroduced();

    const details = select(state => getExternalVisitDetails(state, action.payload.referrer));
    if (details == null) {
        return;
    }

    try {
        await Node.recordVisit(action, REL_CURRENT, details, undefined, false);
    } catch {
        // Ignore failures; external visit tracking is not critical
    }
}

function getExternalVisitDetails(state: ClientState, referrer: string): VisitDetails | null {
    if (isLightboxShown(state)) {
        const postingId = getLightboxPostingId(state);
        return postingId != null ? {
            postingId,
            commentId: getLightboxCommentId(state),
            mediaId: getLightboxMediaId(state),
            referrer
        } : null;
    }

    if (isAtDetailedPostingPage(state)) {
        const postingId = getDetailedPostingId(state);
        return postingId != null ? {
            postingId,
            commentId: getFocusedCommentId(state),
            referrer
        } : null;
    }

    return null;
}

async function navigateFarSaga(action: JumpFarAction | RestoreFarAction): Promise<void> {
    const {nodeName, rootLocation, path, query, hash} = action.payload;
    return navigateFar(action, nodeName, rootLocation, path, query, hash);
}

async function navigateFar(
    caller: ClientAction, nodeName: string | null, rootLocation: string | null, path: string | null,
    query: string | null, hash: string | null
): Promise<void> {
    if (rootLocation != null) {
        dispatch(ownerSwitch(nodeName, rootLocation).causedBy(caller));
        return transformation(caller, null, null, null, path, query, hash);
    } else if (nodeName != null) {
        return navigateFarOnlyNodeAndLocation(caller, nodeName, path, query, hash);
    } else if (path && path !== "/") {
        return navigateFarOnlyLocation(caller, path, query, hash);
    } else {
        return navigateFarOnlyLocation(caller, "/news", null, null);
    }
}

async function navigateFarOnlyNodeAndLocation(
    caller: ClientAction, nodeName: string, path: string | null, query: string | null, hash: string | null
): Promise<void> {
    const nodeLocation = await getNodeUri(caller, nodeName);
    if (nodeLocation == null) {
        await navigateFarOnlyLocation(caller, "/news", null, null);
        dispatch(messageBox(i18n.t("node-name-not-exists")));
        return;
    }
    const {scheme, host, port} = URI.parse(nodeLocation);
    if (scheme == null || host == null) {
        return navigateFarOnlyLocation(caller, "/news", null, null);
    }
    const rootLocation = rootUrl(scheme, host, port);
    return navigateFar(caller, nodeName, rootLocation, path, query, hash);
}

async function navigateFarOnlyLocation(
    caller: ClientAction, path: string | null, query: string | null, hash: string | null
): Promise<void> {
    const atNode = select(isAtNode);
    if (atNode) {
        dispatch(jumpNear(path, query, hash).causedBy(caller));
        return;
    }

    await homeIntroduced();

    const homeOwnerName = select(getHomeOwnerName);
    const homeLocation = select(getHomeRootLocation);
    if (homeLocation != null) {
        return navigateFar(caller, homeOwnerName, homeLocation, path, query, hash);
    }

    // Global page, no node
    dispatch(ownerSwitch(null, null).causedBy(caller));
    dispatch(nodeReady().causedBy(caller));
    return transformation(caller, null, null, null, path, query, hash);
}

async function navigateNearSaga(action: JumpNearAction | RestoreNearAction): Promise<void> {
    const current = URI.parse(select(state => state.navigation.location));
    const {path, query, hash} = action.payload;
    return transformation(
        action, current.path || null, current.query || null, current.fragment || null, path, query, hash
    );
}

async function transformation(
    caller: ClientAction,
    srcPath: string | null, srcQuery: string | null, srcHash: string | null,
    dstPath: string | null, dstQuery: string | null, dstHash: string | null
): Promise<void> {
    const srcInfo = srcPath != null ? LocationInfo.fromUrl(srcPath, srcQuery, srcHash) : new LocationInfo();
    dstPath = dstPath != null && dstPath.startsWith("/moera") ? dstPath.substring(6) : dstPath;
    const dstInfo = LocationInfo.fromUrl(dstPath, dstQuery, dstHash);
    const actions = locationTransform(srcInfo, dstInfo);
    const atHome = select(isAtHomeNode);
    const homeOnly = actions.some(action => action.type === "GO_TO_PAGE" && action.payload.homeOnly);
    if (homeOnly && !atHome) {
        const homeOwnerName = select(getHomeOwnerName);
        const homeLocation = select(getHomeRootLocation);
        if (homeLocation != null) {
            await navigateFar(caller, homeOwnerName, homeLocation, dstPath, dstQuery, dstHash);
        }
        return;
    }
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
