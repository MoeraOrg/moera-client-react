import { conj, trigger } from "state/trigger";
import {
    COMPOSE_DRAFT_LIST_ITEM_DELETED,
    COMPOSE_DRAFT_SAVED,
    COMPOSE_DRAFT_SELECT,
    COMPOSE_DRAFT_UNSET,
    COMPOSE_POST_SUCCEEDED,
    COMPOSE_PREVIEW,
    COMPOSE_PREVIEW_CLOSE,
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
    composeSharedTextLoad
} from "state/compose/actions";
import { dialogClosed, dialogOpened, GO_TO_PAGE, goToPosting, updateLocation } from "state/navigation/actions";
import { postingSet } from "state/postings/actions";
import { isAtComposePage } from "state/navigation/selectors";
import {
    getComposeDraftId,
    getComposePostingId,
    isComposeDraftListLoaded,
    isComposeDraftListToBeLoaded,
    isComposeDraftToBeLoaded,
    isComposePosted,
    isComposePostingEditing,
    isComposePostingToBeLoaded,
    isComposeSharedTextToBeLoaded
} from "state/compose/selectors";
import {
    EVENT_HOME_DRAFT_ADDED,
    EVENT_HOME_DRAFT_DELETED,
    EVENT_HOME_DRAFT_UPDATED,
    EVENT_NODE_POSTING_UPDATED,
    EventAction
} from "api/events/actions";
import { getPostingStory, hasPostingFeedReference } from "state/postings/selectors";
import { storyAdded, storyUpdated } from "state/stories/actions";
import { getOwnerName } from "state/node/selectors";
import { DraftAddedEvent, DraftDeletedEvent, DraftUpdatedEvent, PostingUpdatedEvent } from "api/events/api-types";
import { CONNECTED_TO_HOME, ConnectedToHomeAction } from "state/home/actions";
import { ClientState } from "state/state";

const isConnectionSwitch = (state: ClientState, action: ConnectedToHomeAction) => action.payload.connectionSwitch;

export default [
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposePostingToBeLoaded), composePostingLoad),
    trigger([GO_TO_PAGE, CONNECTED_TO_HOME], conj(isAtComposePage, isComposeDraftToBeLoaded), composeDraftLoad),
    trigger([GO_TO_PAGE, CONNECTED_TO_HOME], conj(isAtComposePage, isComposeDraftListToBeLoaded), composeDraftListLoad),
    trigger(CONNECTED_TO_HOME, conj(isAtComposePage, isConnectionSwitch), composeDraftListLoad),
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposeSharedTextToBeLoaded), composeSharedTextLoad),
    trigger(COMPOSE_POST_SUCCEEDED, state => getComposeDraftId(state) != null, composeDraftDelete),
    trigger(COMPOSE_DRAFT_SAVED, isComposePosted, composeDraftDelete),
    trigger(
        COMPOSE_POST_SUCCEEDED,
        true,
        (signal: ComposePostSucceededAction) => goToPosting(signal.payload.posting.id)
    ),
    trigger(COMPOSE_POST_SUCCEEDED, true, (signal: ComposePostSucceededAction) => postingSet(signal.payload.posting)),
    trigger(
        COMPOSE_POST_SUCCEEDED,
        (state, signal: ComposePostSucceededAction) =>
            !isComposePostingEditing(state) && hasPostingFeedReference(signal.payload.posting, "timeline"),
        signal => storyAdded(getPostingStory(signal.payload.posting, "timeline")!)
    ),
    trigger(
        COMPOSE_POST_SUCCEEDED,
        (state, signal: ComposePostSucceededAction) =>
            isComposePostingEditing(state) && hasPostingFeedReference(signal.payload.posting, "timeline"),
        signal => storyUpdated(getPostingStory(signal.payload.posting, "timeline")!)
    ),
    trigger(
        EVENT_NODE_POSTING_UPDATED,
        (state, signal: EventAction<PostingUpdatedEvent>) =>
            isAtComposePage(state) && getComposePostingId(state) === signal.payload.id,
        composeConflict
    ),
    trigger(COMPOSE_DRAFT_SAVED, true, updateLocation),
    trigger(COMPOSE_DRAFT_SELECT, isComposeDraftToBeLoaded, composeDraftLoad),
    trigger(COMPOSE_DRAFT_SELECT, true, updateLocation),
    trigger(COMPOSE_DRAFT_UNSET, true, updateLocation),
    trigger(COMPOSE_DRAFT_LIST_ITEM_DELETED, true, updateLocation),
    trigger(CONNECTED_TO_HOME, conj(isAtComposePage, isConnectionSwitch), () => composeDraftUnset(true)),
    trigger(COMPOSE_PREVIEW, true, dialogOpened(composePreviewClose())),
    trigger(COMPOSE_PREVIEW_CLOSE, true, dialogClosed()),
    trigger(
        [EVENT_HOME_DRAFT_ADDED, EVENT_HOME_DRAFT_UPDATED],
        (state, signal: EventAction<DraftAddedEvent | DraftUpdatedEvent>) =>
            signal.payload.draftType === "new-posting"
            && signal.payload.receiverName === getOwnerName(state)
            && isComposeDraftListLoaded(state),
        signal => composeDraftListItemReload(signal.payload.id)
    ),
    trigger(
        EVENT_HOME_DRAFT_DELETED,
        (state, signal: EventAction<DraftDeletedEvent>) =>
            signal.payload.draftType === "new-posting"
            && signal.payload.receiverName === getOwnerName(state)
            && isComposeDraftListLoaded(state),
        signal => composeDraftListItemDeleted(signal.payload.id, false)
    )
];
