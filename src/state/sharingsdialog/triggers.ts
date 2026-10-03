import { trigger } from "state/trigger";
import { OpenSharingsDialogAction, sharingsDialogPastSharingsLoad, sharingsDialogUnset } from "state/sharingsdialog/actions";
import { isSharingsDialogToBeLoaded } from "state/sharingsdialog/selectors";

export default [
    trigger(
        "OPEN_SHARINGS_DIALOG",
        isSharingsDialogToBeLoaded,
        (signal: OpenSharingsDialogAction) =>
            sharingsDialogPastSharingsLoad(signal.payload.nodeName, signal.payload.postingId, Number.MAX_SAFE_INTEGER)
    ),
    trigger(["NODE_READY", "HOME_READY", "WAKE_UP"], true, sharingsDialogUnset)
];
