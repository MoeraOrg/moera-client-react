import { isConnectedToHome } from "state/home/selectors";
import { getSetting, isSettingsClientValuesLoaded } from "state/settings/selectors";
import { ClientState } from "state/state";

export function isQuickTipsToBeShown(state: ClientState): boolean {
    return isConnectedToHome(state) && isSettingsClientValuesLoaded(state)
        && !(getSetting(state, "invitation.quick-tips.shown") as boolean)
        && !state.nodeName.mnemonic;
}
