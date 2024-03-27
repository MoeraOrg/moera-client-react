import { trigger } from "state/trigger";
import { askDialogLoad, OpenAskDialogAction } from "state/askdialog/actions";
import { isAskDialogToBeLoaded } from "state/askdialog/selectors";

export default [
    trigger(
        "OPEN_ASK_DIALOG",
        isAskDialogToBeLoaded,
        (signal: OpenAskDialogAction) => askDialogLoad(signal.payload.nodeName!)
    )
];
