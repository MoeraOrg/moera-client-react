import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import {
    CLOSE_SHERIFF_ORDER_DIALOG,
    closeSheriffOrderDialog,
    OPEN_SHERIFF_ORDER_DIALOG
} from "state/sherifforderdialog/actions";

export default [
    trigger(OPEN_SHERIFF_ORDER_DIALOG, true, dialogOpened(closeSheriffOrderDialog())),
    trigger(CLOSE_SHERIFF_ORDER_DIALOG, true, dialogClosed)
];
