import { call, put } from 'redux-saga/effects';

import { Browser, Node, NodeApiError } from "api";
import { signedUp, signUpFailed } from "state/signupdialog/actions";
import { errorThrown } from "state/error/actions";
import { initFromLocation } from "state/navigation/actions";
import { connectedToHome } from "state/home/actions";
import { rootUrl } from "util/misc";

const PROVIDER_SCHEME = "https";
const PROVIDER_DOMAIN = "moera.blog";
const PROVIDER_PORT = 0;
// const PROVIDER_SCHEME = "http";
// const PROVIDER_DOMAIN = "localhost.localdomain";
// const PROVIDER_PORT = 8082;

export function* signUpSaga(action) {
    const {name, domain, password, onError} = action.payload;

    const nodeDomainName = domain + "." + PROVIDER_DOMAIN;
    const rootLocation = rootUrl(PROVIDER_SCHEME, nodeDomainName, PROVIDER_PORT);
    const login = "admin";
    try {
        yield call(Node.createDomain, rootUrl(PROVIDER_SCHEME, PROVIDER_DOMAIN, PROVIDER_PORT), nodeDomainName);
    } catch(e) {
        yield put(signUpFailed());
        if (e instanceof NodeApiError) {
            onError("domain", e.message);
        } else {
            yield put(errorThrown(e));
        }
        return;
    }

    let data;
    try {
        yield call(Node.createCredentials, rootLocation, login, password);
        data = yield call(Node.createToken, rootLocation, login, password);
    } catch (e) {
        console.log(e);
        if (!(e instanceof NodeApiError)) {
            yield put(errorThrown(e));
        }
    }

    if (data) {
        let cartesData = {
            cartes: []
        };
        try {
            cartesData = yield call(Node.getCartes, rootLocation, data.token);
        } catch (e) {
            yield put(errorThrown(e));
        }

        Browser.storeConnectionData(rootLocation, null, login, data.token, data.permissions);
        Browser.storeCartesData(cartesData.cartesIp, cartesData.cartes);
        yield put(connectedToHome(rootLocation, login, data.token, data.permissions, cartesData.cartesIp,
            cartesData.cartes));
    }

    yield put(initFromLocation(rootLocation, "/", null, null));
    yield put(signedUp());
}
