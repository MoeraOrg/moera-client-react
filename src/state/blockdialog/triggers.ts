import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import { closeBlockDialog } from "state/blockdialog/actions";

export default [
    trigger("OPEN_BLOCK_DIALOG", true, dialogOpened(closeBlockDialog())),
    trigger("CLOSE_BLOCK_DIALOG", true, dialogClosed)
];
