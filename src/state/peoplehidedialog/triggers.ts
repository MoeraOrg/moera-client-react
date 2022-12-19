import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import {
    CLOSE_PEOPLE_HIDE_DIALOG,
    closePeopleHideDialog,
    OPEN_PEOPLE_HIDE_DIALOG
} from "state/peoplehidedialog/actions";

export default [
    trigger(OPEN_PEOPLE_HIDE_DIALOG, true, dialogOpened(closePeopleHideDialog())),
    trigger(CLOSE_PEOPLE_HIDE_DIALOG, true, dialogClosed)
];
