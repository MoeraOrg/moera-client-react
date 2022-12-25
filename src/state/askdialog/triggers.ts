import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import {
    askDialogLoad,
    CLOSE_ASK_DIALOG,
    closeAskDialog,
    OPEN_ASK_DIALOG,
    OpenAskDialogAction
} from "state/askdialog/actions";
import { isAskDialogToBeLoaded } from "state/askdialog/selectors";

export default [
    trigger(OPEN_ASK_DIALOG, true, dialogOpened(closeAskDialog())),
    trigger(
        OPEN_ASK_DIALOG,
        isAskDialogToBeLoaded,
        (signal: OpenAskDialogAction) => askDialogLoad(signal.payload.nodeName!)
    ),
    trigger(CLOSE_ASK_DIALOG, true, dialogClosed)
];
