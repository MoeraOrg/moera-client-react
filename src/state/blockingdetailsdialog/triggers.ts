import { trigger } from "state/trigger";
import { blockingDetailsDialogLoad } from "state/blockingdetailsdialog/actions";
import { isBlockingDetailsDialogToBeLoaded } from "state/blockingdetailsdialog/selectors";

export default [
    trigger("OPEN_BLOCKING_DETAILS_DIALOG", isBlockingDetailsDialogToBeLoaded, blockingDetailsDialogLoad)
];
