import { trigger } from "state/trigger";
import { swipeRefreshUpdate } from "state/navigation/actions";
import { CLOSE_CONFIRM_BOX, CONFIRM_BOX } from "state/confirmbox/actions";

export default [
    trigger([CONFIRM_BOX, CLOSE_CONFIRM_BOX], !!window.Android, swipeRefreshUpdate)
];