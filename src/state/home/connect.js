import { call, put, select } from 'redux-saga/effects';

import { messageBox } from "state/messagebox/actions";
import { normalizeUrl } from "util/misc";
import { connectedToHome, connectionToHomeFailed, homeOwnerSet, homeOwnerVerified } from "state/home/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { Browser, Home, Naming, NodeApiError, NodeName } from "api";
import { errorThrown } from "state/error/actions";
import { getAddonApiVersion, getHomeConnectionData } from "state/home/selectors";

function* connectToHomeFailure(error, onClose = null) {
    yield put(connectionToHomeFailed());
    yield put(messageBox("Connection to home failed: " + error.message, onClose));
}

export function* connectToHomeSaga(action) {
    const {location, assign, login, password} = action.payload;
    const addonApiVersion = yield select(getAddonApiVersion);
    if (addonApiVersion < 2) {
        Browser.storeHomeData(location, login, null, null, null, null);
    }
    let data;
    try {
        if (assign) {
            yield call(Home.createCredentials, location, login, password);
        }
        data = yield call(Home.createToken, location, login, password);
    } catch (e) {
        if (e instanceof NodeApiError) {
            yield call(connectToHomeFailure, e, openConnectDialog());
        } else {
            yield call(connectToHomeFailure, e);
        }
        return;
    }

    let cartesData = {
        cartes: []
    };
    try {
        cartesData = yield call(Home.getCartes, location, data.token);
    } catch (e) {
        yield put(errorThrown(e));
    }

    if (addonApiVersion >= 2) {
        Browser.storeConnectionData(normalizeUrl(location), null, login, data.token, data.permissions);
        Browser.storeCartesData(cartesData.cartesIp, cartesData.cartes);
    } else {
        Browser.storeHomeData(normalizeUrl(location), login, data.token, data.permissions, cartesData.cartesIp,
            cartesData.cartes);
    }
    yield put(connectedToHome(normalizeUrl(location), login, data.token, data.permissions, cartesData.cartesIp,
        cartesData.cartes));
}

export function* verifyHomeOwnerSaga() {
    try {
        const {nodeName} = yield call(Home.getWhoAmI);
        yield put(homeOwnerSet(nodeName));

        const addonApiVersion = yield select(getAddonApiVersion);
        if (addonApiVersion >= 2) {
            const {location, login, token, permissions} = yield select(getHomeConnectionData);
            Browser.storeConnectionData(location, nodeName, login, token, permissions);
        }

        const {name, generation} = NodeName.parse(nodeName);
        if (name == null || generation == null) {
            return;
        }
        const ndata = yield call(Naming.getCurrent, name, generation);
        const rootPage = yield select(state => state.home.root.page);
        const correct = ndata && normalizeUrl(ndata.nodeUri) === rootPage;
        const latest = ndata && ndata.latest;
        yield put(homeOwnerVerified(nodeName, latest, correct, ndata.deadline));
    } catch (e) {
        yield put(errorThrown(e));
    }
}
