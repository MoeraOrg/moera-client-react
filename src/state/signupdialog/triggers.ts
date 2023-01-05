import { inv, trigger } from "state/trigger";
import { dialogClosed, dialogOpened, goHome } from "state/navigation/actions";
import { MNEMONIC_CLOSE } from "state/nodename/actions";
import { isAtNode } from "state/node/selectors";
import { CANCEL_SIGN_UP_DIALOG, cancelSignUpDialog, OPEN_SIGN_UP_DIALOG, SIGNED_UP } from "state/signupdialog/actions";

export default [
    trigger(MNEMONIC_CLOSE, inv(isAtNode), goHome),
    trigger(OPEN_SIGN_UP_DIALOG, true, dialogOpened(cancelSignUpDialog())),
    trigger(CANCEL_SIGN_UP_DIALOG, true, dialogClosed),
    trigger(SIGNED_UP, true, dialogClosed)
];
