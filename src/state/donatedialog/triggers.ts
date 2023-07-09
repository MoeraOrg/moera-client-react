import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import { CLOSE_DONATE_DIALOG, closeDonateDialog, OPEN_DONATE_DIALOG } from "state/donatedialog/actions";

export default [
    trigger(OPEN_DONATE_DIALOG, true, dialogOpened(closeDonateDialog())),
    trigger(CLOSE_DONATE_DIALOG, true, dialogClosed)
];
