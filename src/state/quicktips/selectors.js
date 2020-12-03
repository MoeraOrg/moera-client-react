import { isConnectedToHome } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";

export function isQuickTipsToBeShown(state) {
    return isConnectedToHome(state) && !getSetting(state, "invitation.quick-tips.shown");
}
