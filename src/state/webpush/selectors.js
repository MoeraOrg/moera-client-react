import { isConnectedToHome } from "state/home/selectors";
import { isStandaloneMode } from "state/navigation/selectors";
import { Browser } from "ui/browser";

export function isWebPushSupported(state) {
    return Browser.isWebPushSupported() && isStandaloneMode(state);
}

export function getWebPushSubscriptionId(state) {
    return state.webPush.subscriptionId;
}

export function isWebPushEnabled(state) {
    return isConnectedToHome(state) && getWebPushSubscriptionId(state) != null;
}
