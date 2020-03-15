import { trigger } from "state/trigger";
import {
    isReactionsDialogReactionsToBeLoaded,
    isReactionsDialogTotalsToBeLoaded
} from "state/reactionsdialog/selectors";
import {
    OPEN_REACTIONS_DIALOG,
    REACTIONS_DIALOG_SELECT_TAB,
    reactionsDialogPastReactionsLoad,
    reactionsDialogTotalsLoad,
    reactionsDialogUnset
} from "state/reactionsdialog/actions";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";

export default [
    trigger(
        [OPEN_REACTIONS_DIALOG, REACTIONS_DIALOG_SELECT_TAB],
        isReactionsDialogReactionsToBeLoaded,
        reactionsDialogPastReactionsLoad
    ),
    trigger(OPEN_REACTIONS_DIALOG, isReactionsDialogTotalsToBeLoaded, reactionsDialogTotalsLoad),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, reactionsDialogUnset)
];
