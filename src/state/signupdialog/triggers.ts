import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened, goHomeNews } from "state/navigation/actions";
import { cancelSignUpDialog } from "state/signupdialog/actions";

export default [
    trigger("MNEMONIC_CLOSE", true, goHomeNews),
    trigger("OPEN_SIGN_UP_DIALOG", true, dialogOpened(cancelSignUpDialog())),
    trigger("CANCEL_SIGN_UP_DIALOG", true, dialogClosed),
    trigger("SIGNED_UP", true, dialogClosed)
];
