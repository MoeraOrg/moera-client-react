import { trigger } from "state/trigger";
import { bodyScrollUpdate, swipeRefreshUpdate } from "state/navigation/actions";
import { CLOSE_MESSAGE_BOX, MESSAGE_BOX } from "state/messagebox/actions";
import { Browser } from "ui/browser";

export default [
    trigger([MESSAGE_BOX, CLOSE_MESSAGE_BOX], Browser.isAndroidApp(), swipeRefreshUpdate),
    trigger([MESSAGE_BOX, CLOSE_MESSAGE_BOX], true, bodyScrollUpdate)
];
