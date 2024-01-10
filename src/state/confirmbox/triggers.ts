import { trigger } from "state/trigger";
import { bodyScrollUpdate, swipeRefreshUpdate } from "state/navigation/actions";
import * as Browser from "ui/browser";

export default [
    trigger(["CONFIRM_BOX", "CLOSE_CONFIRM_BOX"], Browser.isAndroidApp(), swipeRefreshUpdate),
    trigger(["CONFIRM_BOX", "CLOSE_CONFIRM_BOX"], true, bodyScrollUpdate)
];
