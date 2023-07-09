import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import {
    CLOSE_ENTRY_COPY_TEXT_DIALOG,
    closeEntryCopyTextDialog,
    OPEN_ENTRY_COPY_TEXT_DIALOG
} from "state/entrycopytextdialog/actions";

export default [
    trigger(OPEN_ENTRY_COPY_TEXT_DIALOG, true, dialogOpened(closeEntryCopyTextDialog())),
    trigger(CLOSE_ENTRY_COPY_TEXT_DIALOG, true, dialogClosed)
];
