import { ClientState } from "state/state";
import { isOwnerNameSet } from "state/node/selectors";
import { isConnectedToHome, isHomeIntroduced } from "state/home/selectors";
import { isSettingsClientValuesLoaded } from "state/settings/selectors";

export function introduced(state: ClientState): boolean {
    return isHomeIntroduced(state);
}

export function mutuallyIntroduced(state: ClientState): boolean {
    return isOwnerNameSet(state) && introduced(state);
}

export function namingInitialized(state: ClientState): boolean {
    return isSettingsClientValuesLoaded(state) || (isHomeIntroduced(state) && !isConnectedToHome(state));
}
