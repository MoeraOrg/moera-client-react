import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import { closeEntryCopyTextDialog } from "state/entrycopytextdialog/actions";

export default [
    trigger("OPEN_ENTRY_COPY_TEXT_DIALOG", true, dialogOpened(closeEntryCopyTextDialog())),
    trigger("CLOSE_ENTRY_COPY_TEXT_DIALOG", true, dialogClosed)
];
