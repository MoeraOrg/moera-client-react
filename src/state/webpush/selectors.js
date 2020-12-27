import { isConnectedToHome } from "state/home/selectors";

export function getWebPushSubscriptionId(state) {
    return state.webPush.subscriptionId;
}

export function isWebPushEnabled(state) {
    return isConnectedToHome(state) && getWebPushSubscriptionId(state) != null;
}
