import { trigger } from "state/trigger";
import { dialogOpened } from "state/navigation/actions";
import { closeChangeDateDialog, OPEN_CHANGE_DATE_DIALOG } from "state/changedatedialog/actions";

export default [
    trigger(OPEN_CHANGE_DATE_DIALOG, true, dialogOpened(closeChangeDateDialog()))
];
