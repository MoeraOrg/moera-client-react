import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import {
    CLOSE_SHERIFF_ORDER_DETAILS_DIALOG,
    closeSheriffOrderDetailsDialog,
    OPEN_SHERIFF_ORDER_DETAILS_DIALOG,
    sheriffOrderDetailsDialogLoad
} from "state/sherifforderdetailsdialog/actions";
import { isSheriffOrderDetailsDialogToBeLoaded } from "state/sherifforderdetailsdialog/selectors";

export default [
    trigger(OPEN_SHERIFF_ORDER_DETAILS_DIALOG, true, dialogOpened(closeSheriffOrderDetailsDialog())),
    trigger(OPEN_SHERIFF_ORDER_DETAILS_DIALOG, isSheriffOrderDetailsDialogToBeLoaded, sheriffOrderDetailsDialogLoad),
    trigger(CLOSE_SHERIFF_ORDER_DETAILS_DIALOG, true, dialogClosed)
];
