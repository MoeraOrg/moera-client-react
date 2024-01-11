import { trigger } from "state/trigger";
import { bodyScrollUpdate, newLocation, swipeRefreshUpdate, updateLocation } from "state/navigation/actions";
import * as Browser from "ui/browser";

export default [
    trigger("GO_TO_PAGE", true, newLocation),
    trigger(["DIALOG_OPENED", "DIALOG_CLOSED"], Browser.isAndroidApp(), swipeRefreshUpdate),
    trigger(["DIALOG_OPENED", "DIALOG_CLOSED"], true, bodyScrollUpdate),
    trigger("SETTINGS_LANGUAGE_CHANGED", true, updateLocation)
];
