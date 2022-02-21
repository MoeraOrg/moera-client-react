import { trigger } from "state/trigger";
import { swipeRefreshUpdate } from "state/navigation/actions";
import { CLOSE_MESSAGE_BOX, MESSAGE_BOX } from "state/messagebox/actions";

export default [
    trigger([MESSAGE_BOX, CLOSE_MESSAGE_BOX], !!window.Android, swipeRefreshUpdate)
];
