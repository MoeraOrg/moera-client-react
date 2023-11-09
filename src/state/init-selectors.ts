import { ClientState } from "state/state";
import { isNodeIntroduced } from "state/node/selectors";
import { isConnectedToHome, isHomeIntroduced } from "state/home/selectors";
import { isSettingsClientValuesLoaded } from "state/settings/selectors";

export function homeIntroduced(state: ClientState): boolean {
    return isHomeIntroduced(state);
}

export function nodeIntroduced(state: ClientState): boolean {
    return isNodeIntroduced(state);
}

export function mutuallyIntroduced(state: ClientState): boolean {
    return nodeIntroduced(state) && homeIntroduced(state);
}

export function namingInitialized(state: ClientState): boolean {
    return isSettingsClientValuesLoaded(state) || (isHomeIntroduced(state) && !isConnectedToHome(state));
}
