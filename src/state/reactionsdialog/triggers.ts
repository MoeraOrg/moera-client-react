import { trigger } from "state/trigger";
import {
    getReactionsDialogPostingId,
    getReactionsDialogReceiverPostingId,
    isReactionsDialogReactionsToBeLoaded,
    isReactionsDialogShown,
    isReactionsDialogTotalsToBeLoaded
} from "state/reactionsdialog/selectors";
import {
    closeReactionsDialog,
    reactionsDialogPastReactionsLoad,
    reactionsDialogTotalsLoad,
    reactionsDialogUnset
} from "state/reactionsdialog/actions";
import {
    CommentReactionsChangedEvent,
    CommentUpdatedEvent,
    EVENT_NODE_POSTING_REACTIONS_CHANGED,
    EVENT_NODE_POSTING_UPDATED,
    EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED,
    EVENT_RECEIVER_COMMENT_UPDATED,
    EventAction,
    PostingReactionsChangedEvent,
    PostingUpdatedEvent
} from "api/events";
import { isCommentMomentInLoadedRange } from "state/detailedposting/selectors";
import { dialogClosed, dialogOpened } from "state/navigation/actions";

export default [
    trigger(
        ["OPEN_REACTIONS_DIALOG", "REACTIONS_DIALOG_SELECT_TAB"],
        isReactionsDialogReactionsToBeLoaded,
        reactionsDialogPastReactionsLoad
    ),
    trigger("OPEN_REACTIONS_DIALOG", isReactionsDialogTotalsToBeLoaded, reactionsDialogTotalsLoad),
    trigger("OPEN_REACTIONS_DIALOG", true, dialogOpened(closeReactionsDialog())),
    trigger("CLOSE_REACTIONS_DIALOG", true, dialogClosed),
    trigger(["INIT_FROM_LOCATION", "HOME_INTRODUCED", "WAKE_UP"], true, reactionsDialogUnset),
    trigger(
        [EVENT_NODE_POSTING_UPDATED, EVENT_NODE_POSTING_REACTIONS_CHANGED],
        (state, signal: EventAction<PostingUpdatedEvent | PostingReactionsChangedEvent>) =>
            isReactionsDialogShown(state) && getReactionsDialogPostingId(state) === signal.payload.id,
        reactionsDialogTotalsLoad
    ),
    trigger(
        [EVENT_NODE_POSTING_UPDATED, EVENT_NODE_POSTING_REACTIONS_CHANGED],
        (state, signal: EventAction<PostingUpdatedEvent | PostingReactionsChangedEvent>) =>
            !isReactionsDialogShown(state) && getReactionsDialogPostingId(state) === signal.payload.id,
        reactionsDialogUnset
    ),
    trigger(
        [EVENT_RECEIVER_COMMENT_UPDATED, EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED],
        (state, signal: EventAction<CommentUpdatedEvent | CommentReactionsChangedEvent>) =>
            isReactionsDialogShown(state) && getReactionsDialogReceiverPostingId(state) === signal.payload.postingId
            && isCommentMomentInLoadedRange(state, signal.payload.moment),
        reactionsDialogTotalsLoad
    ),
    trigger(
        [EVENT_RECEIVER_COMMENT_UPDATED, EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED],
        (state, signal: EventAction<CommentUpdatedEvent | CommentReactionsChangedEvent>) =>
            !isReactionsDialogShown(state) && getReactionsDialogReceiverPostingId(state) === signal.payload.postingId
            && isCommentMomentInLoadedRange(state, signal.payload.moment),
        reactionsDialogUnset
    )
];
