import { isConnectedToHome } from "state/home/selectors";
import { getSetting, isSettingsClientValuesLoaded } from "state/settings/selectors";

export function isQuickTipsToBeShown(state) {
    return isConnectedToHome(state) && isSettingsClientValuesLoaded(state)
        && !getSetting(state, "invitation.quick-tips.shown")
        && !state.nodeName.mnemonic;
}
