import { conj, inv, trigger } from "state/trigger";
import { isAtGrantPage } from "state/navigation/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { isGrantToBeValidated } from "state/grant/selectors";
import { grantValidate } from "state/grant/actions";

export default [
    trigger("GO_TO_PAGE", conj(isAtGrantPage, isGrantToBeValidated), grantValidate),
    trigger("GO_TO_PAGE", conj(isAtGrantPage, inv(isConnectedToHome)), openConnectDialog),
    trigger("CONNECTED_TO_HOME", isAtGrantPage, grantValidate)
];
