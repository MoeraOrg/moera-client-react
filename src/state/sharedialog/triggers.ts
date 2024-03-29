import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import { closeShareDialog } from "state/sharedialog/actions";

export default [
    trigger("OPEN_SHARE_DIALOG", true, dialogOpened(closeShareDialog())),
    trigger("CLOSE_SHARE_DIALOG", true, dialogClosed)
];
