import { inv, trigger } from "state/trigger";
import { dialogOpened, goHome } from "state/navigation/actions";
import { MNEMONIC_CLOSE } from "state/nodename/actions";
import { isAtNode } from "state/node/selectors";
import { cancelSignUpDialog, OPEN_SIGN_UP_DIALOG } from "state/signupdialog/actions";

export default [
    trigger(MNEMONIC_CLOSE, inv(isAtNode), goHome),
    trigger(OPEN_SIGN_UP_DIALOG, true, dialogOpened(cancelSignUpDialog()))
];
