import { call, put, select } from 'redux-saga/effects';

import { Browser, Naming, Node, NodeApiError } from "api";
import {
    SIGN_UP_STAGE_CONNECT,
    SIGN_UP_STAGE_DOMAIN,
    SIGN_UP_STAGE_NAME,
    SIGN_UP_STAGE_PASSWORD,
    signedUp,
    signUpFailed
} from "state/signupdialog/actions";
import { errorThrown } from "state/error/actions";
import { connectedToHome } from "state/home/actions";
import { registerNameSucceeded } from "state/nodename/actions";
import { rootUrl } from "util/misc";

const PROVIDER_SCHEME = "https";
const PROVIDER_DOMAIN = "moera.blog";
const PROVIDER_PORT = 0;
// const PROVIDER_SCHEME = "http";
// const PROVIDER_DOMAIN = "localhost.localdomain";
// const PROVIDER_PORT = 8082;

export function* signUpSaga(action) {
    const {name, domain, password, onError} = action.payload;

    const stage = yield select(state => state.signUpDialog.stage);
    const nodeDomainName = domain + "." + PROVIDER_DOMAIN;
    const rootLocation = rootUrl(PROVIDER_SCHEME, nodeDomainName, PROVIDER_PORT);
    const login = "admin";

    if (stage <= SIGN_UP_STAGE_DOMAIN) {
        try {
            yield call(Node.createDomain, rootUrl(PROVIDER_SCHEME, PROVIDER_DOMAIN, PROVIDER_PORT), nodeDomainName);
        } catch (e) {
            yield put(signUpFailed(SIGN_UP_STAGE_DOMAIN));
            if (e instanceof NodeApiError) {
                onError("domain", e.message);
            } else {
                yield put(errorThrown(e));
            }
            return;
        }
    }

    if (stage <= SIGN_UP_STAGE_PASSWORD) {
        try {
            yield call(Node.createCredentials, rootLocation, login, password);
        } catch (e) {
            if (!(e instanceof NodeApiError)) {
                yield put(errorThrown(e));
            }
            yield put(signUpFailed(SIGN_UP_STAGE_PASSWORD));
            return;
        }
    }

    if (stage <= SIGN_UP_STAGE_CONNECT) {
        let data;
        try {
            data = yield call(Node.createToken, rootLocation, login, password);
        } catch (e) {
            if (!(e instanceof NodeApiError)) {
                yield put(errorThrown(e));
            }
            yield put(signUpFailed(SIGN_UP_STAGE_CONNECT));
            return;
        }

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

    if (stage <= SIGN_UP_STAGE_NAME) {
        try {
            const free = yield call(Naming.isFree, name);
            if (!free) {
                onError("name", "Name is already taken");
                yield put(signUpFailed(SIGN_UP_STAGE_NAME));
                return;
            }
            const secret = yield call(Node.registerName, ":", name);
            yield put(signedUp());
            yield put(registerNameSucceeded(secret.name, secret.mnemonic));
        } catch (e) {
            yield put(signUpFailed());
            yield put(errorThrown(e));
        }
    }
}
