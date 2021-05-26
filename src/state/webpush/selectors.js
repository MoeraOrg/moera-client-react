import { isConnectedToHome } from "state/home/selectors";
import { isStandaloneMode } from "state/navigation/selectors";
import { Browser } from "ui/browser";
import { now } from "util/misc";

export function isWebPushSupported(state) {
    return Browser.isWebPushSupported() && isStandaloneMode(state);
}

export function isWebPushRecommended(state) {
    // return isWebPushSupported(state) && Browser.isMobile();
    return false;
}

export function getWebPushSubscriptionId(state) {
    return state.webPush.subscriptionId;
}

export function isWebPushEnabled(state) {
    return isConnectedToHome(state) && getWebPushSubscriptionId(state) != null;
}

export function isWebPushInvitationToBeShown(state) {
    return !isWebPushEnabled(state) && isWebPushRecommended(state) && state.webPush.invitationStage < 3
        && state.webPush.invitationTimestamp <= now();
}
