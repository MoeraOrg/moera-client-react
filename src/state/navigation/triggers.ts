import { inv, trigger } from "state/trigger";
import {
    bodyScrollUpdate,
    goHomeNews,
    newLocation,
    swipeRefreshUpdate,
    updateLocation
} from "state/navigation/actions";
import { isAtNode } from "state/node/selectors";
import * as Browser from "ui/browser";

export default [
    trigger("GO_TO_PAGE", true, newLocation),
    trigger("CONNECTED_TO_HOME", inv(isAtNode), goHomeNews),
    trigger(["DIALOG_OPENED", "DIALOG_CLOSED"], Browser.isAndroidApp(), swipeRefreshUpdate),
    trigger(["DIALOG_OPENED", "DIALOG_CLOSED"], true, bodyScrollUpdate),
    trigger("SETTINGS_LANGUAGE_CHANGED", true, updateLocation)
];
