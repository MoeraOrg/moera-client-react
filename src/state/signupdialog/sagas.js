import { call, put, select } from 'redux-saga/effects';

import { Browser, Naming, Node, NodeApiError } from "api";
import {
    SIGN_UP_STAGE_CONNECT,
    SIGN_UP_STAGE_DOMAIN,
    SIGN_UP_STAGE_NAME,
    SIGN_UP_STAGE_PASSWORD,
    SIGN_UP_STAGE_PROFILE,
    signedUp,
    signUpFailed
} from "state/signupdialog/actions";
import { errorThrown } from "state/error/actions";
import { connectedToHome, homeOwnerSet } from "state/home/actions";
import { registerNameSucceeded } from "state/nodename/actions";
import { rootUrl } from "util/misc";
import PROVIDERS from "providers";

function getProvider(name) {
    return PROVIDERS.find(p => p.name === name);
}

export function* signUpSaga(action) {
    const {provider: providerName, name, domain, password, email, onError} = action.payload;

    const stage = yield select(state => state.signUpDialog.stage);
    const provider = getProvider(providerName);

    let nodeDomainName;
    if (!domain) {
        try {
            const domain = yield call(Node.getDomainAvailable, provider.controller, name);
            nodeDomainName = domain.name;
        } catch (e) {
            yield put(signUpFailed(SIGN_UP_STAGE_DOMAIN));
            if (e instanceof NodeApiError) {
                onError("domain", e.message);
            } else {
                yield put(errorThrown(e));
            }
            return;
        }
    } else {
        nodeDomainName = domain + "." + provider.domain;
    }

    if (stage <= SIGN_UP_STAGE_DOMAIN) {
        try {
            yield call(Node.createDomain, provider.controller, nodeDomainName);
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

    const rootLocation = rootUrl(provider.scheme, nodeDomainName, provider.port);
    const login = "admin";

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

    if (stage <= SIGN_UP_STAGE_PROFILE && email) {
        try {
            yield call(Node.putProfile, rootLocation, {email});
        } catch (e) {
            if (!(e instanceof NodeApiError)) {
                yield put(errorThrown(e));
            }
            yield put(signUpFailed(SIGN_UP_STAGE_PROFILE));
            return;
        }
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
            yield put(homeOwnerSet(null, true));
            yield put(signedUp());
            yield put(registerNameSucceeded(secret.name, secret.mnemonic));
        } catch (e) {
            yield put(signUpFailed());
            yield put(errorThrown(e));
        }
    }
}

export function* signUpNameVerifySaga(action) {
    const {name, onVerify} = action.payload;

    try {
        const free = yield call(Naming.isFree, name);
        onVerify(name, free);
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* signUpFindDomainSaga(action) {
    const {provider, name, onFound} = action.payload;

    try {
        const domain = yield call(Node.getDomainAvailable, getProvider(provider).controller, name);
        onFound(provider, name, domain.name);
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* signUpDomainVerifySaga(action) {
    const {provider: providerName, name, onVerify} = action.payload;

    const provider = getProvider(providerName);
    const domain = name + "." + provider.domain;

    try {
        yield call(Node.getDomain, provider.controller, domain);
        onVerify(name, false);
    } catch (e) {
        if (!(e instanceof NodeApiError)) {
            yield put(errorThrown(e));
        }
        onVerify(name, true);
    }
}
