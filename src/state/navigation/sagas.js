import { call, put, select } from 'redux-saga/effects';
import * as URI from 'uri-js';

import { PAGE_SETTINGS } from "state/navigation/pages";
import {
    GO_HOME,
    GO_HOME_NEWS,
    GO_TO_LOCATION,
    GO_TO_PAGE_WITH_DEFAULT_SUBPAGE,
    goToPage,
    goToSettings,
    INIT_FROM_LOCATION,
    INIT_STORAGE,
    initFromLocation,
    locationLock,
    locationSet,
    locationUnlock,
    NEW_LOCATION,
    UPDATE_LOCATION
} from "state/navigation/actions";
import { settingsGoToTab } from "state/settings/actions";
import { isStandaloneMode } from "state/navigation/selectors";
import { locationBuild, LocationInfo, locationTransform } from "location";
import { rootUrl } from "util/url";
import { getHomeRootPage } from "state/home/selectors";
import { executor } from "state/executor";

export default [
    executor(INIT_STORAGE, "", initStorageSaga),
    executor(INIT_FROM_LOCATION, "", initFromLocationSaga),
    executor(NEW_LOCATION, null, newLocationSaga),
    executor(UPDATE_LOCATION, null, newLocationSaga),
    executor(GO_TO_LOCATION, payload => `${payload.path}:${payload.query}:${payload.hash}`, goToLocationSaga),
    executor(GO_TO_PAGE_WITH_DEFAULT_SUBPAGE, null, goToPageWithDefaultSubpageSaga),
    executor(GO_HOME, "", goHomeSaga),
    executor(GO_HOME_NEWS, "", goHomeNewsSaga)
];

function* goToPageWithDefaultSubpageSaga(action) {
    switch (action.payload.page) {
        case PAGE_SETTINGS:
            yield put(goToSettings());
            yield put(settingsGoToTab("node"));
            break;

        default:
            yield put(goToPage(action.payload.page, action.payload.details));
    }
}

function* transformation(srcPath, srcQuery, srcHash, dstPath, dstQuery, dstHash) {
    const srcInfo = srcPath != null ? LocationInfo.fromUrl(srcPath, srcQuery, srcHash) : new LocationInfo();
    dstPath = dstPath.startsWith("/moera") ? dstPath.substring(6) : dstPath;
    const dstInfo = LocationInfo.fromUrl(dstPath, dstQuery, dstHash);
    const actions = locationTransform(srcInfo, dstInfo);
    yield put(locationLock());
    for (let a of actions) {
        yield put(a);
    }
    yield call(newLocationSaga);
    yield put(locationUnlock());
}

function initStorageSaga() {
    try {
        // Call the browser extension to inject communication code
        fetch("https://moera.please.start.communication/");
    } catch (e) {
        // The request must fail
    }
}

function* initFromLocationSaga(action) {
    const {path, query, hash} = action.payload;
    yield call(transformation, null, null, null, path, query, hash);
}

function* goToLocationSaga(action) {
    const current = URI.parse(yield select(state => state.navigation.location));
    const {path, query, hash} = action.payload;
    yield call(transformation, current.path || "", current.query || "", current.fragment || "", path, query, hash);
}

function* newLocationSaga(action) {
    const info = yield select(locationBuild, new LocationInfo());
    yield put(locationSet(info.toUrl(), info.title, action == null || action.type === NEW_LOCATION));
}

function* goHomeSaga() {
    const {standalone, homeRootPage} = yield select(state => ({
        standalone: isStandaloneMode(state),
        homeRootPage: getHomeRootPage(state)
    }));
    if (!standalone) {
        window.location = homeRootPage;
    } else {
        const {scheme, host, port, path} = URI.parse(homeRootPage);
        const rootLocation = rootUrl(scheme, host, port);
        yield put(initFromLocation(rootLocation, path, null, null));
    }
}

function* goHomeNewsSaga() {
    const {standalone, homeRootPage} = yield select(state => ({
        standalone: isStandaloneMode(state),
        homeRootPage: getHomeRootPage(state)
    }));
    if (!standalone) {
        window.location = homeRootPage + "/news";
    } else {
        const {scheme, host, port, path} = URI.parse(homeRootPage);
        const rootLocation = rootUrl(scheme, host, port);
        yield put(initFromLocation(rootLocation, path + "/news", null, null));
    }
}
