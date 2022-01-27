import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { isCartesInitialized, isCartesRunOut } from "state/cartes/selectors";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { isSettingsClientValuesLoaded } from "state/settings/selectors";
import { isOwnerNameSet } from "state/owner/selectors";

export function introduced(state: ClientState) {
    return isAtHomeNode(state) || !isCartesRunOut(state)
        || (isCartesInitialized(state) && (!isConnectedToHome(state) || !isHomeOwnerNameSet(state)));
}

export function mutuallyIntroduced(state: ClientState) {
    return isOwnerNameSet(state) && introduced(state);
}

export function namingInitialized(state: ClientState) {
    return isSettingsClientValuesLoaded(state) || (isCartesInitialized(state) && !isConnectedToHome(state));
}