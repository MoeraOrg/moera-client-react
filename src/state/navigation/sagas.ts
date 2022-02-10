import { call, put, select } from 'typed-redux-saga/macro';
import * as URI from 'uri-js';

import { PAGE_SETTINGS } from "state/navigation/pages";
import {
    GO_HOME,
    GO_HOME_NEWS,
    GO_TO_LOCATION,
    GO_TO_PAGE_WITH_DEFAULT_SUBPAGE,
    GoToLocationAction,
    goToPage,
    GoToPageWithDefaultSubpageAction,
    goToSettings,
    INIT_FROM_LOCATION,
    INIT_FROM_NODE_LOCATION,
    INIT_STORAGE,
    initFromLocation,
    InitFromLocationAction,
    InitFromNodeLocationAction,
    locationLock,
    locationSet,
    locationUnlock,
    NEW_LOCATION,
    NewLocationAction,
    UPDATE_LOCATION,
    UpdateLocationAction
} from "state/navigation/actions";
import { settingsGoToTab } from "state/settings/actions";
import { isStandaloneMode } from "state/navigation/selectors";
import { locationBuild, LocationInfo, locationTransform } from "location";
import { rootUrl } from "util/url";
import { getHomeRootPage } from "state/home/selectors";
import { executor } from "state/executor";
import { getNodeUri } from "state/naming/sagas";

export default [
    executor(INIT_STORAGE, "", initStorageSaga),
    executor(INIT_FROM_NODE_LOCATION, "", initFromNodeLocationSaga),
    executor(INIT_FROM_LOCATION, "", initFromLocationSaga),
    executor(NEW_LOCATION, null, newLocationSaga),
    executor(UPDATE_LOCATION, null, updateLocationSaga),
    executor(GO_TO_LOCATION, payload => `${payload.path}:${payload.query}:${payload.hash}`, goToLocationSaga),
    executor(GO_TO_PAGE_WITH_DEFAULT_SUBPAGE, null, goToPageWithDefaultSubpageSaga),
    executor(GO_HOME, "", goHomeSaga),
    executor(GO_HOME_NEWS, "", goHomeNewsSaga)
];

function* goToPageWithDefaultSubpageSaga(action: GoToPageWithDefaultSubpageAction) {
    switch (action.payload.page) {
        case PAGE_SETTINGS:
            yield* put(goToSettings());
            yield* put(settingsGoToTab("node"));
            break;

        default:
            yield* put(goToPage(action.payload.page, action.payload.details));
    }
}

function* transformation(srcPath: string | null, srcQuery: string | null, srcHash: string | null,
                         dstPath: string | null, dstQuery: string | null, dstHash: string | null) {
    const srcInfo = srcPath != null ? LocationInfo.fromUrl(srcPath, srcQuery, srcHash) : new LocationInfo();
    dstPath = dstPath != null && dstPath.startsWith("/moera") ? dstPath.substring(6) : dstPath;
    const dstInfo = LocationInfo.fromUrl(dstPath, dstQuery, dstHash);
    const actions = locationTransform(srcInfo, dstInfo);
    yield* put(locationLock());
    for (let a of actions) {
        yield* put(a);
    }
    yield* call(changeLocation, null);
    yield* put(locationUnlock());
}

function initStorageSaga() {
    try {
        // Call the browser extension to inject communication code
        fetch("https://moera.please.start.communication/");
    } catch (e) {
        // The request must fail
    }
}

function* initFromNodeLocationSaga(action: InitFromNodeLocationAction) {
    const {nodeName, location, fallbackUrl} = action.payload;

    const nodeLocation = yield* call(getNodeUri, nodeName);
    if (nodeLocation == null) {
        window.location.href = fallbackUrl;
        return;
    }
    const {scheme, host, port} = URI.parse(nodeLocation);
    if (scheme == null || host == null) {
        window.location.href = fallbackUrl;
        return;
    }
    const rootLocation = rootUrl(scheme, host, port);
    const {path = null, query = null, fragment = null} = URI.parse(location);
    yield* put(initFromLocation(rootLocation, path, query, fragment));
}

function* initFromLocationSaga(action: InitFromLocationAction) {
    const {path, query, hash} = action.payload;
    yield* call(transformation, null, null, null, path, query, hash);
}

function* goToLocationSaga(action: GoToLocationAction) {
    const current = URI.parse(yield* select(state => state.navigation.location));
    const {path, query, hash} = action.payload;
    yield* call(transformation, current.path || "", current.query || "", current.fragment || "", path, query, hash);
}

function* newLocationSaga(action: NewLocationAction) {
    yield* call(changeLocation, action);
}

function* updateLocationSaga(action: UpdateLocationAction) {
    yield* call(changeLocation, action);
}

function* changeLocation(action: NewLocationAction | UpdateLocationAction | null) {
    const info = yield* select(locationBuild, new LocationInfo());
    yield* put(locationSet(info.toUrl(), info.title, action == null || action.type === NEW_LOCATION));
}

function* goHomeSaga() {
    const {standalone, homeRootPage} = yield* select(state => ({
        standalone: isStandaloneMode(state),
        homeRootPage: getHomeRootPage(state)
    }));
    if (homeRootPage == null) {
        return;
    }
    if (!standalone) {
        window.location.href = homeRootPage;
    } else {
        const {scheme, host, port, path} = URI.parse(homeRootPage);
        if (scheme != null && host != null) {
            const rootLocation = rootUrl(scheme, host, port);
            yield* put(initFromLocation(rootLocation, path ?? null, null, null));
        }
    }
}

function* goHomeNewsSaga() {
    const {standalone, homeRootPage} = yield* select(state => ({
        standalone: isStandaloneMode(state),
        homeRootPage: getHomeRootPage(state)
    }));
    if (homeRootPage == null) {
        return;
    }
    if (!standalone) {
        window.location.href = homeRootPage + "/news";
    } else {
        const {scheme, host, port, path} = URI.parse(homeRootPage);
        if (scheme != null && host != null) {
            const rootLocation = rootUrl(scheme, host, port);
            yield* put(initFromLocation(rootLocation, path + "/news", null, null));
        }
    }
}
