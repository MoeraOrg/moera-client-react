import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import { closeSheriffOrderDialog } from "state/sherifforderdialog/actions";

export default [
    trigger("OPEN_SHERIFF_ORDER_DIALOG", true, dialogOpened(closeSheriffOrderDialog())),
    trigger("CLOSE_SHERIFF_ORDER_DIALOG", true, dialogClosed)
];
