import { call, put, select } from 'redux-saga/effects';
import * as URI from 'uri-js';

import { PAGE_SETTINGS } from "state/navigation/pages";
import {
    goToPage,
    goToSettings,
    locationLock,
    locationSet,
    locationUnlock,
    NEW_LOCATION
} from "state/navigation/actions";
import { settingsGoToTab } from "state/settings/actions";
import { locationBuild, LocationInfo, locationTransform } from "location";

export function* goToPageWithDefaultSubpageSaga(action) {
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

export function initStorageSaga(action) {
    if (!action.payload.standalone) {
        try {
            // Call the browser extension to inject communication code
            fetch("https://moera.please.start.communication/");
        } catch (e) {
            // The request must fail
        }
    } else {
        window.postMessage({
            source: "moera",
            action: "loadedData",
            payload: {}
        }, "*");
    }
}

export function* initFromLocationSaga(action) {
    const {path, query, hash} = action.payload;
    yield call(transformation, null, null, null, path, query, hash);
}

export function* goToLocationSaga(action) {
    const current = URI.parse(yield select(state => state.navigation.location));
    const {path, query, hash} = action.payload;
    yield call(transformation, current.path || "", current.query || "", current.fragment || "", path, query, hash);
}

export function* newLocationSaga(action) {
    const info = yield select(locationBuild, new LocationInfo());
    yield put(locationSet(info.toUrl(), info.title, action == null || action.type === NEW_LOCATION));
}
