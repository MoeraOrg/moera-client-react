import { isConnectedToHome } from "state/home/selectors";

export function isWebPushEnabled(state) {
    return isConnectedToHome(state) && state.webPush.subscriptionId != null;
}
