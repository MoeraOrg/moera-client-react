import { ClientState } from "state/state";
import { ClientActionType } from "state/action";
import { barrier, select } from "state/store-sagas";
import { isNodeIntroduced } from "state/node/selectors";
import { isConnectedToHome, isHomeIntroduced } from "state/home/selectors";
import { isSettingsClientValuesLoaded } from "state/settings/selectors";

const INIT_ACTIONS: ClientActionType[] = ["HOME_READY", "SETTINGS_CLIENT_VALUES_LOADED", "NODE_READY"];

export async function homeIntroduced(): Promise<void> {
    if (!isHomeIntroduced(select())) {
        await barrier(INIT_ACTIONS, isHomeIntroduced);
    }
}

export async function nodeIntroduced(): Promise<void> {
    if (!isNodeIntroduced(select())) {
        await barrier(INIT_ACTIONS, isNodeIntroduced);
    }
}

export async function mutuallyIntroduced(): Promise<void> {
    await nodeIntroduced();
    await homeIntroduced();
}

export async function namingInitialized(): Promise<void> {
    const condition = (state: ClientState) =>
        isSettingsClientValuesLoaded(state) || (isHomeIntroduced(state) && !isConnectedToHome(state));
    if (!condition(select())) {
        await barrier(INIT_ACTIONS, condition);
    }
}
