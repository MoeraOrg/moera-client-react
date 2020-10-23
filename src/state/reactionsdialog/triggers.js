import { trigger } from "state/trigger";
import {
    getReactionsDialogPostingId,
    getReactionsDialogReceiverPostingId,
    isReactionsDialogReactionsToBeLoaded,
    isReactionsDialogShown,
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
import {
    EVENT_NODE_POSTING_REACTIONS_CHANGED,
    EVENT_NODE_POSTING_UPDATED,
    EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED,
    EVENT_RECEIVER_COMMENT_UPDATED
} from "api/events/actions";
import { isCommentMomentInLoadedRange } from "state/detailedposting/selectors";
import { INIT_FROM_LOCATION } from "state/navigation/actions";

export default [
    trigger(
        [OPEN_REACTIONS_DIALOG, REACTIONS_DIALOG_SELECT_TAB],
        isReactionsDialogReactionsToBeLoaded,
        reactionsDialogPastReactionsLoad
    ),
    trigger(OPEN_REACTIONS_DIALOG, isReactionsDialogTotalsToBeLoaded, reactionsDialogTotalsLoad),
    trigger([INIT_FROM_LOCATION, CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, reactionsDialogUnset),
    trigger(
        [EVENT_NODE_POSTING_UPDATED, EVENT_NODE_POSTING_REACTIONS_CHANGED],
        (state, signal) =>
            isReactionsDialogShown(state) && getReactionsDialogPostingId(state) === signal.payload.id,
        reactionsDialogTotalsLoad
    ),
    trigger(
        [EVENT_NODE_POSTING_UPDATED, EVENT_NODE_POSTING_REACTIONS_CHANGED],
        (state, signal) =>
            !isReactionsDialogShown(state) && getReactionsDialogPostingId(state) === signal.payload.id,
        reactionsDialogUnset
    ),
    trigger(
        [EVENT_RECEIVER_COMMENT_UPDATED, EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED],
        (state, signal) =>
            isReactionsDialogShown(state) && getReactionsDialogReceiverPostingId(state) === signal.payload.postingId
            && isCommentMomentInLoadedRange(state, signal.payload.moment),
        reactionsDialogTotalsLoad
    ),
    trigger(
        [EVENT_RECEIVER_COMMENT_UPDATED, EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED],
        (state, signal) =>
            !isReactionsDialogShown(state) && getReactionsDialogReceiverPostingId(state) === signal.payload.postingId
            && isCommentMomentInLoadedRange(state, signal.payload.moment),
        reactionsDialogUnset
    )
];
