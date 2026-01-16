import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import PROVIDERS, { Provider } from "providers";
import { CLIENT_SETTINGS_PREFIX, Naming, Node, NodeApiError, SettingInfo } from "api";
import { Storage } from "storage";
import { ClientState } from "state/state";
import { errorThrown } from "state/error/actions";
import { WithContext } from "state/action-types";
import { barrier, dispatch, select } from "state/store-sagas";
import { executor } from "state/executor";
import { homeOwnerSet } from "state/home/actions";
import { boot, jumpNear } from "state/navigation/actions";
import { mnemonicSet, mnemonicStore, registerNameSucceeded } from "state/nodename/actions";
import {
    SIGN_UP_STAGE_CONNECT,
    SIGN_UP_STAGE_DOMAIN,
    SIGN_UP_STAGE_NAME,
    SIGN_UP_STAGE_PASSWORD,
    SIGN_UP_STAGE_PROFILE,
    SignUpAction,
    signUpDomainRegistered,
    SignUpDomainVerifyAction,
    signUpFailed,
    SignUpFindDomainAction,
    SignUpNameVerifyAction
} from "state/signup/actions";
import { getHomeRootLocation } from "state/home/selectors";
import { serializeSheriffs } from "util/sheriff";
import { rootUrl } from "util/url";

export default [
    executor("SIGN_UP", "", signUpSaga),
    executor("SIGN_UP_NAME_VERIFY", "", signUpNameVerifySaga),
    executor("SIGN_UP_FIND_DOMAIN", "", signUpFindDomainSaga),
    executor("SIGN_UP_DOMAIN_VERIFY", "", signUpDomainVerifySaga)
];

function getProvider(name: string): Provider {
    const provider = PROVIDERS.find(p => p.name === name);
    if (provider == null) {
        throw new Error(`Provider ${name} is unknown`);
    }
    return provider;
}

async function signUpSaga(action: WithContext<SignUpAction>): Promise<void> {
    const {
        language, provider: providerName, name, domain, password, email, googlePlayAllowed, onError
    } = action.payload;

    const stage = select().signUp.stage;
    const provider = getProvider(providerName);

    let nodeDomainName = select().signUp.nodeDomainName;
    if (nodeDomainName == null) {
        if (!domain) {
            try {
                const domain = await Node.isDomainAvailable(action, provider.controller, name);
                nodeDomainName = domain.name;
            } catch (e) {
                dispatch(signUpFailed(SIGN_UP_STAGE_DOMAIN).causedBy(action));
                if (e instanceof NodeApiError) {
                    onError("domain", e.message);
                } else {
                    dispatch(errorThrown(e));
                }
                return;
            }
        } else {
            nodeDomainName = domain + "." + provider.domain;
        }
        dispatch(signUpDomainRegistered(nodeDomainName).causedBy(action));
    }

    if (stage <= SIGN_UP_STAGE_DOMAIN) {
        try {
            await Node.createDomain(
                action,
                provider.controller,
                {name: nodeDomainName},
                ["domain.already-exists", "domain.name.blank", "domain.name.invalid-domain"],
                false
            );
        } catch (e) {
            dispatch(signUpFailed(SIGN_UP_STAGE_DOMAIN).causedBy(action));
            if (e instanceof NodeApiError) {
                onError("domain", e.message);
            } else {
                dispatch(errorThrown(e));
            }
            return;
        }
    }

    const rootLocation = rootUrl(provider.scheme, nodeDomainName, provider.port);
    const login = "admin";

    if (stage <= SIGN_UP_STAGE_PASSWORD) {
        try {
            await Node.createCredentials(action, rootLocation, {login, password}, ["credentials.already-created"]);
        } catch (e) {
            if (!(e instanceof NodeApiError)) {
                dispatch(errorThrown(e));
            }
            dispatch(signUpFailed(SIGN_UP_STAGE_PASSWORD).causedBy(action));
            return;
        }
    }

    if (stage <= SIGN_UP_STAGE_CONNECT) {
        let info;
        try {
            info = await Node.createToken(
                action, rootLocation, {login, password}, ["credentials.login-incorrect", "credentials.not-created"]
            );
        } catch (e) {
            if (!(e instanceof NodeApiError)) {
                dispatch(errorThrown(e));
            }
            dispatch(signUpFailed(SIGN_UP_STAGE_CONNECT).causedBy(action));
            return;
        }

        Storage.storeConnectionData(rootLocation, null, null, null, login, info.token, info.permissions);
        const signUp = select().signUp;
        dispatch(boot({rootLocation, path: "/signup"}, {signUp}).causedBy(action));
    }

    if (stage <= SIGN_UP_STAGE_PROFILE) {
        try {
            await connectionEstablished(rootLocation);
            if (email) {
                await Node.updateProfile(action, rootLocation, {email});
            }
            const settings: SettingInfo[] = [{name: CLIENT_SETTINGS_PREFIX + "language", value: language}];
            if (googlePlayAllowed) {
                settings.push({name: "sheriffs.timeline", value: serializeSheriffs([SHERIFF_GOOGLE_PLAY_TIMELINE])});
            }
            await Node.updateSettings(action, rootLocation, settings);
        } catch (e) {
            if (!(e instanceof NodeApiError)) {
                dispatch(errorThrown(e));
            }
            dispatch(signUpFailed(SIGN_UP_STAGE_PROFILE).causedBy(action));
            return;
        }
    }

    if (stage <= SIGN_UP_STAGE_NAME) {
        try {
            await connectionEstablished(rootLocation);
            const free = await Naming.isFree(action, name);
            if (!free) {
                onError("name", "Name is already taken");
                dispatch(signUpFailed(SIGN_UP_STAGE_NAME).causedBy(action));
                return;
            }
            const secret = await Node.createNodeName(action, rootLocation, {name});
            dispatch(homeOwnerSet(null, true, null, null).causedBy(action));
            dispatch(registerNameSucceeded().causedBy(action));
            dispatch(mnemonicSet(secret.name, secret.mnemonic!).causedBy(action));
            const quick = select(state => state.signUp.mode === "quick");
            if (quick) {
                dispatch(mnemonicStore().causedBy(action));
            } else {
                dispatch(jumpNear("/mnemonic", null, null).causedBy(action));
            }
        } catch (e) {
            dispatch(signUpFailed(SIGN_UP_STAGE_NAME).causedBy(action));
            dispatch(errorThrown(e));
        }
    }
}

async function connectionEstablished(rootLocation: string): Promise<void> {
    const condition = (state: ClientState) => getHomeRootLocation(state) === rootLocation;

    if (!condition(select())) {
        await barrier("*", condition);
    }
}

async function signUpNameVerifySaga(action: SignUpNameVerifyAction): Promise<void> {
    const {name, onVerify} = action.payload;

    try {
        const free = await Naming.isFree(action, name);
        onVerify(name, free);
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function signUpFindDomainSaga(action: WithContext<SignUpFindDomainAction>): Promise<void> {
    const {provider, name, onFound} = action.payload;

    try {
        const domain = await Node.isDomainAvailable(action, getProvider(provider).controller, name);
        onFound(provider, name, domain.name);
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function signUpDomainVerifySaga(action: WithContext<SignUpDomainVerifyAction>): Promise<void> {
    const {provider: providerName, name, onVerify} = action.payload;

    const provider = getProvider(providerName);
    const domain = name + "." + provider.domain;

    try {
        await Node.getDomain(action, provider.controller, domain, ["domain.not-found"], false);
        onVerify(name, false);
    } catch (e) {
        if (!(e instanceof NodeApiError)) {
            dispatch(errorThrown(e));
        }
        onVerify(name, true);
    }
}
