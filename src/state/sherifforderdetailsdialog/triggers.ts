import { trigger } from "state/trigger";
import { sheriffOrderDetailsDialogLoad } from "state/sherifforderdetailsdialog/actions";
import { isSheriffOrderDetailsDialogToBeLoaded } from "state/sherifforderdetailsdialog/selectors";

export default [
    trigger("OPEN_SHERIFF_ORDER_DETAILS_DIALOG", isSheriffOrderDetailsDialogToBeLoaded, sheriffOrderDetailsDialogLoad)
];
