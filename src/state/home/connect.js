import { call, put, select } from 'redux-saga/effects';

import { messageBox } from "state/messagebox/actions";
import { normalizeUrl } from "util/misc";
import { connectedToHome, connectionToHomeFailed, homeOwnerSet, homeOwnerVerified } from "state/home/actions";
import { openConnectDialog } from "state/connectdialog/actions";
import { Browser, Home, Naming, NodeApiError, NodeName } from "api";
import { errorThrown } from "state/error/actions";

function* connectToHomeFailure(error, onClose = null) {
    yield put(connectionToHomeFailed());
    yield put(messageBox("Connection to home failed: " + error.message, onClose));
}

export function* connectToHomeSaga(action) {
    const {location, assign, login, password} = action.payload;
    Browser.storeHomeData(location, login, null, null, null, null);
    const rootApi = normalizeUrl(location) + "/moera/api";
    let data;
    try {
        if (assign) {
            yield call(Home.createCredentials, rootApi, login, password);
        }
        data = yield call(Home.createToken, rootApi, login, password);
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
        cartesData = yield call(Home.getCartes, rootApi, data.token);
    } catch (e) {
        yield put(errorThrown(e));
    }

    Browser.storeHomeData(normalizeUrl(location), login, data.token, data.permissions, cartesData.cartesIp,
        cartesData.cartes);
    yield put(connectedToHome(normalizeUrl(location), login, data.token, data.permissions, cartesData.cartesIp,
        cartesData.cartes));
}

export function* verifyHomeOwnerSaga() {
    try {
        const data = yield call(Home.getWhoAmI);
        yield put(homeOwnerSet(data.nodeName));
        const {name, generation} = NodeName.parse(data.nodeName);
        if (name == null || generation == null) {
            return;
        }
        const ndata = yield call(Naming.getCurrent, name, generation);
        const rootPage = yield select(state => state.home.root.page);
        const correct = ndata && normalizeUrl(ndata.nodeUri) === rootPage;
        const latest = ndata && ndata.latest;
        yield put(homeOwnerVerified(data.nodeName, latest, correct));
    } catch (e) {
        yield put(errorThrown(e));
    }
}
