import {
    CommentReactionAddedEvent,
    CommentReactionDeletedEvent,
    CommentReactionsChangedEvent,
    CommentUpdatedEvent,
    EventAction,
    PostingReactionAddedEvent,
    PostingReactionDeletedEvent,
    PostingReactionsChangedEvent,
    PostingUpdatedEvent
} from "api/events";
import { ClientState } from "state/state";
import { trigger } from "state/trigger";
import { getRelNodeNameContext } from "state/home/selectors";
import {
    getReactionsDialogPosting,
    isReactionsDialogReactionsToBeLoaded,
    isReactionsDialogShown,
    isReactionsDialogTotalsToBeLoaded
} from "state/reactionsdialog/selectors";
import {
    reactionsDialogPastReactionsLoad,
    reactionsDialogReactionAdded,
    reactionsDialogReactionDeleted,
    reactionsDialogTotalsLoad,
    reactionsDialogUnset
} from "state/reactionsdialog/actions";
import { absoluteNodeName, RelNodeName } from "util/rel-node-name";

function isDialogPosting(state: ClientState, nodeName: RelNodeName | string | null, postingId: string): boolean {
    if (nodeName == null || state.reactionsDialog.postingId == null) {
        return false;
    }
    const context = getRelNodeNameContext(state);
    const sourceNode = absoluteNodeName(nodeName, context);
    const dialogNode = absoluteNodeName(state.reactionsDialog.nodeName, context);
    const posting = getReactionsDialogPosting(state);
    return (posting?.receiverName ?? dialogNode) === sourceNode
        && (posting?.receiverPostingId ?? state.reactionsDialog.postingId) === postingId;
}

function isPostingEvent(
    state: ClientState,
    signal: EventAction<
        PostingUpdatedEvent | PostingReactionsChangedEvent | PostingReactionAddedEvent | PostingReactionDeletedEvent
    >
): boolean {
    return state.reactionsDialog.commentId == null
        && isDialogPosting(state, signal.payload.sourceNode, signal.payload.id);
}

function isCommentEvent(
    state: ClientState,
    signal: EventAction<
        CommentUpdatedEvent | CommentReactionsChangedEvent | CommentReactionAddedEvent | CommentReactionDeletedEvent
    >
): boolean {
    return state.reactionsDialog.commentId === signal.payload.id
        && isDialogPosting(state, signal.payload.sourceNode, signal.payload.postingId);
}

export default [
    trigger(
        ["OPEN_REACTIONS_DIALOG", "REACTIONS_DIALOG_SELECT_TAB"],
        state => isReactionsDialogShown(state) && isReactionsDialogReactionsToBeLoaded(state),
        reactionsDialogPastReactionsLoad
    ),
    trigger(
        "OPEN_REACTIONS_DIALOG",
        state => isReactionsDialogShown(state) && isReactionsDialogTotalsToBeLoaded(state),
        reactionsDialogTotalsLoad
    ),
    trigger(["NODE_READY", "HOME_READY", "WAKE_UP"], true, reactionsDialogUnset),
    trigger(
        [
            "EVENT_NODE_POSTING_REACTION_ADDED",
            "EVENT_HOME_POSTING_REACTION_ADDED",
            "EVENT_RECEIVER_POSTING_REACTION_ADDED"
        ],
        isPostingEvent,
        (signal: EventAction<PostingReactionAddedEvent>) => reactionsDialogReactionAdded(signal.payload.reaction)
    ),
    trigger(
        [
            "EVENT_NODE_POSTING_REACTION_DELETED",
            "EVENT_HOME_POSTING_REACTION_DELETED",
            "EVENT_RECEIVER_POSTING_REACTION_DELETED"
        ],
        isPostingEvent,
        (signal: EventAction<PostingReactionDeletedEvent>) => reactionsDialogReactionDeleted(signal.payload.reaction ?? null)
    ),
    trigger(
        [
            "EVENT_NODE_COMMENT_REACTION_ADDED",
            "EVENT_HOME_COMMENT_REACTION_ADDED",
            "EVENT_RECEIVER_COMMENT_REACTION_ADDED"
        ],
        isCommentEvent,
        (signal: EventAction<CommentReactionAddedEvent>) => reactionsDialogReactionAdded(signal.payload.reaction)
    ),
    trigger(
        [
            "EVENT_NODE_COMMENT_REACTION_DELETED",
            "EVENT_HOME_COMMENT_REACTION_DELETED",
            "EVENT_RECEIVER_COMMENT_REACTION_DELETED"
        ],
        isCommentEvent,
        (signal: EventAction<CommentReactionDeletedEvent>) => reactionsDialogReactionDeleted(signal.payload.reaction ?? null)
    ),
    trigger<EventAction<PostingUpdatedEvent> | EventAction<PostingReactionsChangedEvent>>(
        [
            "EVENT_NODE_POSTING_UPDATED",
            "EVENT_HOME_POSTING_UPDATED",
            "EVENT_RECEIVER_POSTING_UPDATED",
            "EVENT_NODE_POSTING_REACTIONS_CHANGED",
            "EVENT_HOME_POSTING_REACTIONS_CHANGED",
            "EVENT_RECEIVER_POSTING_REACTIONS_CHANGED"
        ],
        isPostingEvent,
        reactionsDialogTotalsLoad
    ),
    trigger<EventAction<CommentUpdatedEvent> | EventAction<CommentReactionsChangedEvent>>(
        [
            "EVENT_NODE_COMMENT_UPDATED",
            "EVENT_HOME_COMMENT_UPDATED",
            "EVENT_RECEIVER_COMMENT_UPDATED",
            "EVENT_NODE_COMMENT_REACTIONS_CHANGED",
            "EVENT_HOME_COMMENT_REACTIONS_CHANGED",
            "EVENT_RECEIVER_COMMENT_REACTIONS_CHANGED"
        ],
        isCommentEvent,
        reactionsDialogTotalsLoad
    )
];
