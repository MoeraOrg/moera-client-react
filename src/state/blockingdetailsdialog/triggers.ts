import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import {
    blockingDetailsDialogLoad,
    CLOSE_BLOCKING_DETAILS_DIALOG,
    closeBlockingDetailsDialog,
    OPEN_BLOCKING_DETAILS_DIALOG
} from "state/blockingdetailsdialog/actions";
import { isBlockingDetailsDialogToBeLoaded } from "state/blockingdetailsdialog/selectors";

export default [
    trigger(OPEN_BLOCKING_DETAILS_DIALOG, true, dialogOpened(closeBlockingDetailsDialog())),
    trigger(OPEN_BLOCKING_DETAILS_DIALOG, isBlockingDetailsDialogToBeLoaded, blockingDetailsDialogLoad),
    trigger(CLOSE_BLOCKING_DETAILS_DIALOG, true, dialogClosed)
];
