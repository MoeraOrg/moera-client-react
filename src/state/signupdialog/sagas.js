import { call, put, select } from 'redux-saga/effects';

import { Naming, Node, NodeApiError } from "api";
import PROVIDERS from "providers";
import { errorThrown } from "state/error/actions";
import { connectedToHome, homeOwnerSet } from "state/home/actions";
import { registerNameSucceeded } from "state/nodename/actions";
import {
    SIGN_UP,
    SIGN_UP_DOMAIN_VERIFY,
    SIGN_UP_FIND_DOMAIN,
    SIGN_UP_NAME_VERIFY,
    SIGN_UP_STAGE_CONNECT,
    SIGN_UP_STAGE_DOMAIN,
    SIGN_UP_STAGE_NAME,
    SIGN_UP_STAGE_PASSWORD,
    SIGN_UP_STAGE_PROFILE,
    signedUp,
    signUpFailed
} from "state/signupdialog/actions";
import { Browser } from "ui/browser";
import { rootUrl } from "util/url";
import { executor } from "state/executor";
import { now } from "util/misc";

export default [
    executor(SIGN_UP, "", signUpSaga),
    executor(SIGN_UP_NAME_VERIFY, "", signUpNameVerifySaga),
    executor(SIGN_UP_FIND_DOMAIN, "", signUpFindDomainSaga),
    executor(SIGN_UP_DOMAIN_VERIFY, "", signUpDomainVerifySaga)
];

function getProvider(name) {
    return PROVIDERS.find(p => p.name === name);
}

function* signUpSaga(action) {
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
            cartesIp: null,
            cartes: [],
            createdAt: 0
        };
        try {
            cartesData = yield call(Node.getCartes, rootLocation, data.token);
        } catch (e) {
            yield put(errorThrown(e));
        }

        Browser.storeConnectionData(rootLocation, null, null, login, data.token, data.permissions);
        Browser.storeCartesData(cartesData.cartesIp, cartesData.cartes);
        yield put(connectedToHome(rootLocation, login, data.token, data.permissions, cartesData.cartesIp,
            cartesData.cartes, null, cartesData.createdAt - now()));
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
            yield put(homeOwnerSet(null, true, null));
            yield put(signedUp());
            yield put(registerNameSucceeded(secret.name, secret.mnemonic));
        } catch (e) {
            yield put(signUpFailed());
            yield put(errorThrown(e));
        }
    }
}

function* signUpNameVerifySaga(action) {
    const {name, onVerify} = action.payload;

    try {
        const free = yield call(Naming.isFree, name);
        onVerify(name, free);
    } catch (e) {
        yield put(errorThrown(e));
    }
}

function* signUpFindDomainSaga(action) {
    const {provider, name, onFound} = action.payload;

    try {
        const domain = yield call(Node.getDomainAvailable, getProvider(provider).controller, name);
        onFound(provider, name, domain.name);
    } catch (e) {
        yield put(errorThrown(e));
    }
}

function* signUpDomainVerifySaga(action) {
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
