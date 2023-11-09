import { call, put, select } from 'typed-redux-saga';
import * as URI from 'uri-js';

import { locationBuild, LocationInfo, locationTransform } from "location";
import { executor } from "state/executor";
import { getNodeUri } from "state/naming/sagas";
import { ClientAction } from "state/action";
import {
    GoHomeAction,
    GoHomeNewsAction,
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
import { getHomeOwnerName, getHomeRootPage } from "state/home/selectors";
import { Browser } from "ui/browser";
import { rootUrl } from "util/url";
import { ClientState } from "state/state";

export default [
    executor("INIT_FROM_NODE_LOCATION", "", initFromNodeLocationSaga),
    executor("INIT_FROM_LOCATION", "", initFromLocationSaga),
    executor("NEW_LOCATION", null, newLocationSaga),
    executor("UPDATE_LOCATION", null, updateLocationSaga),
    executor("GO_TO_LOCATION", payload => `${payload.path}:${payload.query}:${payload.hash}`, goToLocationSaga),
    executor("GO_HOME", "", goHomeSaga),
    executor("GO_HOME_NEWS", "", goHomeNewsSaga),
    executor("SWIPE_REFRESH_UPDATE", "", swipeRefreshUpdateSaga),
    executor("BODY_SCROLL_UPDATE", "", bodyScrollUpdateSaga)
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
    const {nodeName, location, fallbackUrl} = action.payload;

    const nodeLocation = yield* call(getNodeUri, action, nodeName);
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
    yield* put(initFromLocation(nodeName, rootLocation, path, query, fragment).causedBy(action));
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
    yield* put(locationSet(info.toUrl(), info.title, action == null || action.type === "NEW_LOCATION").causedBy(action));
}

function* goHomeSaga(action: GoHomeAction) {
    const {homeOwnerName, homeRootPage} = yield* select((state: ClientState) => ({
        homeOwnerName: getHomeOwnerName(state),
        homeRootPage: getHomeRootPage(state)
    }));
    if (homeRootPage == null) {
        return;
    }
    const {scheme, host, port, path} = URI.parse(homeRootPage);
    if (scheme != null && host != null) {
        const rootLocation = rootUrl(scheme, host, port);
        yield* put(initFromLocation(homeOwnerName, rootLocation, path ?? null, null, null).causedBy(action));
    }
}

function* goHomeNewsSaga(action: GoHomeNewsAction) {
    const {homeOwnerName, homeRootPage} = yield* select((state: ClientState) => ({
        homeOwnerName: getHomeOwnerName(state),
        homeRootPage: getHomeRootPage(state)
    }));
    if (homeRootPage == null) {
        return;
    }
    const {scheme, host, port, path} = URI.parse(homeRootPage);
    if (scheme != null && host != null) {
        const rootLocation = rootUrl(scheme, host, port);
        yield* put(initFromLocation(homeOwnerName, rootLocation, path + "/news", null, null).causedBy(action));
    }
}

function* swipeRefreshUpdateSaga() {
    if (!window.Android || !window.Android.setSwipeRefreshEnabled) {
        return;
    }

    const {location, messageBoxShow, confirmBoxShow, lightBoxShow, closeDialogAction} = yield* select(state => ({
        location: state.navigation.location,
        messageBoxShow: state.messageBox.show,
        confirmBoxShow: state.confirmBox.show,
        lightBoxShow: state.lightBox.show,
        closeDialogAction: state.navigation.closeDialogAction,
    }));

    const enabled = !location.startsWith("/compose")
        && !location.startsWith("/profile")
        && !location.startsWith("/settings")
        && !messageBoxShow
        && !confirmBoxShow
        && closeDialogAction == null
        && !lightBoxShow
        && !window.closeLightDialog;

    window.Android.setSwipeRefreshEnabled(enabled);
}

function* bodyScrollUpdateSaga() {
    const {messageBoxShow, confirmBoxShow, lightBoxShow, closeDialogAction} = yield* select(state => ({
        messageBoxShow: state.messageBox.show,
        confirmBoxShow: state.confirmBox.show,
        lightBoxShow: state.lightBox.show,
        closeDialogAction: state.navigation.closeDialogAction,
    }));

    const enabled = !messageBoxShow
        && !confirmBoxShow
        && closeDialogAction == null
        && !lightBoxShow
        && !window.closeLightDialog;

    if (enabled) {
        Browser.enableBodyScroll();
    } else {
        Browser.disableBodyScroll();
    }
}
