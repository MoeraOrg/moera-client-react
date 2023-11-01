import { call, put, select } from 'typed-redux-saga';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import PROVIDERS, { Provider } from "providers";
import { CarteSet, CLIENT_SETTINGS_PREFIX, Naming, Node, NodeApiError, SettingInfo } from "api";
import { Storage } from "storage";
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
    SignUpAction,
    SignUpDomainVerifyAction,
    signUpFailed,
    SignUpFindDomainAction,
    SignUpNameVerifyAction
} from "state/signupdialog/actions";
import { getHomeRootLocation } from "state/home/selectors";
import { executor } from "state/executor";
import { serializeSheriffs } from "util/sheriff";
import { rootUrl } from "util/url";
import { now } from "util/misc";

export default [
    executor(SIGN_UP, "", signUpSaga),
    executor(SIGN_UP_NAME_VERIFY, "", signUpNameVerifySaga),
    executor(SIGN_UP_FIND_DOMAIN, "", signUpFindDomainSaga),
    executor(SIGN_UP_DOMAIN_VERIFY, "", signUpDomainVerifySaga)
];

function getProvider(name: string): Provider {
    const provider = PROVIDERS.find(p => p.name === name);
    if (provider == null) {
        throw new Error(`Provider ${name} is unknown`);
    }
    return provider;
}

function* signUpSaga(action: SignUpAction) {
    const {
        language, provider: providerName, name, domain, password, email, googlePlayAllowed, onError
    } = action.payload;

    const stage = yield* select(state => state.signUpDialog.stage);
    const provider = getProvider(providerName);

    let nodeDomainName;
    if (!domain) {
        try {
            const domain = yield* call(Node.isDomainAvailable, provider.controller, name);
            nodeDomainName = domain.name;
        } catch (e) {
            yield* put(signUpFailed(SIGN_UP_STAGE_DOMAIN));
            if (e instanceof NodeApiError) {
                onError("domain", e.message);
            } else {
                yield* put(errorThrown(e));
            }
            return;
        }
    } else {
        nodeDomainName = domain + "." + provider.domain;
    }

    if (stage <= SIGN_UP_STAGE_DOMAIN) {
        try {
            yield* call(Node.createDomain, provider.controller, {name: nodeDomainName},
                ["domain.already-exists", "domainInfo.name.blank", "domainInfo.name.wrong-hostname"]);
        } catch (e) {
            yield* put(signUpFailed(SIGN_UP_STAGE_DOMAIN));
            if (e instanceof NodeApiError) {
                onError("domain", e.message);
            } else {
                yield* put(errorThrown(e));
            }
            return;
        }
    }

    const rootLocation = rootUrl(provider.scheme, nodeDomainName, provider.port);
    const login = "admin";

    if (stage <= SIGN_UP_STAGE_PASSWORD) {
        try {
            yield* call(Node.createCredentials, rootLocation, {login, password}, ["credentials.already-created"]);
        } catch (e) {
            if (!(e instanceof NodeApiError)) {
                yield* put(errorThrown(e));
            }
            yield* put(signUpFailed(SIGN_UP_STAGE_PASSWORD));
            return;
        }
    }

    if (stage <= SIGN_UP_STAGE_CONNECT) {
        let info;
        try {
            info = yield* call(Node.createToken, rootLocation, {login, password},
                ["credentials.login-incorrect", "credentials.not-created"]);
        } catch (e) {
            if (!(e instanceof NodeApiError)) {
                yield* put(errorThrown(e));
            }
            yield* put(signUpFailed(SIGN_UP_STAGE_CONNECT));
            return;
        }

        let cartesData: CarteSet = {
            cartesIp: null,
            cartes: [],
            createdAt: 0
        };
        try {
            cartesData = yield* call(Node.getCartes, rootLocation, null, ["node-name-not-set"], info.token);
        } catch (e) {
            yield* put(errorThrown(e));
        }

        Storage.storeConnectionData(rootLocation, null, null, null, login, info.token, info.permissions);
        Storage.storeCartesData(cartesData.cartesIp ?? null, cartesData.cartes);
        const homeLocation = yield* select(getHomeRootLocation);
        yield* put(connectedToHome(rootLocation, login, info.token, info.permissions, cartesData.cartesIp ?? null,
            cartesData.cartes, null, cartesData.createdAt - now(),
            homeLocation != null && homeLocation !== rootLocation));
    }

    if (stage <= SIGN_UP_STAGE_PROFILE) {
        try {
            if (email) {
                yield* call(Node.updateProfile, rootLocation, {email});
            }
            const settings: SettingInfo[] = [{name: CLIENT_SETTINGS_PREFIX + "language", value: language}];
            if (googlePlayAllowed) {
                settings.push({name: "sheriffs.timeline", value: serializeSheriffs([SHERIFF_GOOGLE_PLAY_TIMELINE])});
            }
            yield* call(Node.updateSettings, rootLocation, settings);
        } catch (e) {
            if (!(e instanceof NodeApiError)) {
                yield* put(errorThrown(e));
            }
            yield* put(signUpFailed(SIGN_UP_STAGE_PROFILE));
            return;
        }
    }

    if (stage <= SIGN_UP_STAGE_NAME) {
        try {
            const free = yield* call(Naming.isFree, name);
            if (!free) {
                onError("name", "Name is already taken");
                yield* put(signUpFailed(SIGN_UP_STAGE_NAME));
                return;
            }
            const secret = yield* call(Node.createNodeName, ":", {name});
            yield* put(homeOwnerSet(null, true, null, null));
            yield* put(signedUp());
            yield* put(registerNameSucceeded(secret.name, secret.mnemonic!));
        } catch (e) {
            yield* put(signUpFailed(SIGN_UP_STAGE_NAME));
            yield* put(errorThrown(e));
        }
    }
}

function* signUpNameVerifySaga(action: SignUpNameVerifyAction) {
    const {name, onVerify} = action.payload;

    try {
        const free = yield* call(Naming.isFree, name);
        onVerify(name, free);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* signUpFindDomainSaga(action: SignUpFindDomainAction) {
    const {provider, name, onFound} = action.payload;

    try {
        const domain = yield* call(Node.isDomainAvailable, getProvider(provider).controller, name);
        onFound(provider, name, domain.name);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* signUpDomainVerifySaga(action: SignUpDomainVerifyAction) {
    const {provider: providerName, name, onVerify} = action.payload;

    const provider = getProvider(providerName);
    const domain = name + "." + provider.domain;

    try {
        yield* call(Node.getDomain, provider.controller, domain, ["domain.not-found"]);
        onVerify(name, false);
    } catch (e) {
        if (!(e instanceof NodeApiError)) {
            yield* put(errorThrown(e));
        }
        onVerify(name, true);
    }
}
