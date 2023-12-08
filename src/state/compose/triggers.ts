import { conj, trigger } from "state/trigger";
import { DraftAddedEvent, DraftDeletedEvent, DraftUpdatedEvent, EventAction, PostingUpdatedEvent } from "api/events";
import { ClientState } from "state/state";
import { getOwnerName } from "state/node/selectors";
import { ConnectedToHomeAction } from "state/home/actions";
import {
    composeConflict,
    composeDraftDelete,
    composeDraftListItemDeleted,
    composeDraftListItemReload,
    composeDraftListLoad,
    composeDraftLoad,
    composeDraftUnset,
    composePostingLoad,
    ComposePostSucceededAction,
    composePreviewClose,
    composeReady,
    composeSharedTextLoad
} from "state/compose/actions";
import { dialogClosed, dialogOpened, goToPosting, updateLocation } from "state/navigation/actions";
import { isAtComposePage } from "state/navigation/selectors";
import {
    getComposeDraftId,
    getComposePostingId,
    isComposeBecameReady,
    isComposeDraftListLoaded,
    isComposeDraftListToBeLoaded,
    isComposeDraftToBeLoaded,
    isComposePosted,
    isComposePostingEditing,
    isComposePostingToBeLoaded,
    isComposeSharedTextToBeLoaded
} from "state/compose/selectors";
import { postingSet } from "state/postings/actions";
import { getPostingStory, hasPostingFeedReference } from "state/postings/selectors";
import { storyAdded, storyUpdated } from "state/stories/actions";

const isConnectionSwitch = (_: ClientState, action: ConnectedToHomeAction) => action.payload.connectionSwitch;

export default [
    trigger("GO_TO_PAGE", conj(isAtComposePage, isComposePostingToBeLoaded), composePostingLoad),
    trigger(["GO_TO_PAGE", "CONNECTED_TO_HOME"], conj(isAtComposePage, isComposeDraftToBeLoaded), composeDraftLoad),
    trigger(
        ["GO_TO_PAGE", "CONNECTED_TO_HOME"],
        conj(isAtComposePage, isComposeDraftListToBeLoaded),
        composeDraftListLoad
    ),
    trigger("CONNECTED_TO_HOME", conj(isAtComposePage, isConnectionSwitch), composeDraftListLoad),
    trigger("GO_TO_PAGE", conj(isAtComposePage, isComposeSharedTextToBeLoaded), composeSharedTextLoad),
    trigger("COMPOSE_POST_SUCCEEDED", state => getComposeDraftId(state) != null, composeDraftDelete),
    trigger("COMPOSE_DRAFT_SAVED", isComposePosted, composeDraftDelete),
    trigger(
        "COMPOSE_POST_SUCCEEDED",
        true,
        (signal: ComposePostSucceededAction) => goToPosting(signal.payload.posting.id)
    ),
    trigger(
        "COMPOSE_POST_SUCCEEDED",
        true,
        (signal: ComposePostSucceededAction) => postingSet(signal.payload.posting, "")
    ),
    trigger(
        "COMPOSE_POST_SUCCEEDED",
        (state, signal: ComposePostSucceededAction) =>
            !isComposePostingEditing(state) && hasPostingFeedReference(signal.payload.posting, "timeline"),
        signal => storyAdded(getPostingStory(signal.payload.posting, "timeline")!)
    ),
    trigger(
        "COMPOSE_POST_SUCCEEDED",
        (state, signal: ComposePostSucceededAction) =>
            isComposePostingEditing(state) && hasPostingFeedReference(signal.payload.posting, "timeline"),
        signal => storyUpdated(getPostingStory(signal.payload.posting, "timeline")!)
    ),
    trigger(
        "EVENT_NODE_POSTING_UPDATED",
        (state, signal: EventAction<PostingUpdatedEvent>) =>
            isAtComposePage(state) && getComposePostingId(state) === signal.payload.id,
        composeConflict
    ),
    trigger("COMPOSE_DRAFT_SAVED", true, updateLocation),
    trigger("COMPOSE_DRAFT_SELECT", isComposeDraftToBeLoaded, composeDraftLoad),
    trigger("COMPOSE_DRAFT_SELECT", true, updateLocation),
    trigger("COMPOSE_DRAFT_UNSET", true, updateLocation),
    trigger("COMPOSE_DRAFT_LIST_ITEM_DELETED", true, updateLocation),
    trigger("CONNECTED_TO_HOME", conj(isAtComposePage, isConnectionSwitch), () => composeDraftUnset(true)),
    trigger(
        [
            "CONNECTED_TO_HOME", "GO_TO_PAGE", "COMPOSE_POSTING_LOADED", "COMPOSE_POSTING_LOAD_FAILED",
            "COMPOSE_DRAFT_LOADED", "COMPOSE_DRAFT_LOAD_FAILED", "COMPOSE_DRAFT_SELECT", "COMPOSE_DRAFT_UNSET",
            "COMPOSE_DRAFT_LIST_ITEM_DELETED", "COMPOSE_SHARED_TEXT_SET", "COMPOSE_SHARED_TEXT_ABSENT"
        ],
        conj(isAtComposePage, isComposeBecameReady),
        composeReady
    ),
    trigger("COMPOSE_PREVIEW", true, dialogOpened(composePreviewClose())),
    trigger("COMPOSE_PREVIEW_CLOSE", true, dialogClosed),
    trigger(
        ["EVENT_HOME_DRAFT_ADDED", "EVENT_HOME_DRAFT_UPDATED"],
        (state, signal: EventAction<DraftAddedEvent> | EventAction<DraftUpdatedEvent>) =>
            signal.payload.draftType === "new-posting"
            && signal.payload.receiverName === getOwnerName(state)
            && isComposeDraftListLoaded(state),
        signal => composeDraftListItemReload(signal.payload.id)
    ),
    trigger(
        "EVENT_HOME_DRAFT_DELETED",
        (state, signal: EventAction<DraftDeletedEvent>) =>
            signal.payload.draftType === "new-posting"
            && signal.payload.receiverName === getOwnerName(state)
            && isComposeDraftListLoaded(state),
        signal => composeDraftListItemDeleted(signal.payload.id, false)
    )
];
