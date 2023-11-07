import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import { closeChangeDateDialog } from "state/changedatedialog/actions";

export default [
    trigger("OPEN_CHANGE_DATE_DIALOG", true, dialogOpened(closeChangeDateDialog())),
    trigger("CLOSE_CHANGE_DATE_DIALOG", true, dialogClosed)
];
