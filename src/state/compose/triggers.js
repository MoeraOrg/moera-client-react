import { conj, inv, trigger } from "state/trigger";
import {
    COMPOSE_DRAFT_LIST_ITEM_DELETED,
    COMPOSE_DRAFT_SAVED,
    COMPOSE_DRAFT_SELECT,
    COMPOSE_POST_SUCCEEDED,
    COMPOSE_PREVIEW,
    composeConflict,
    composeDraftListItemDeleted,
    composeDraftListItemReload,
    composeDraftListLoad,
    composeDraftLoad,
    composeFeaturesLoad,
    composeFeaturesUnset,
    composePostingLoad,
    composePreviewClose,
    composeSharedTextLoad
} from "state/compose/actions";
import { dialogOpened, GO_TO_PAGE, goToPosting, updateLocation } from "state/navigation/actions";
import { postingSet } from "state/postings/actions";
import { isAtComposePage } from "state/navigation/selectors";
import {
    getComposePostingId,
    isComposeDraftListLoaded,
    isComposeDraftListToBeLoaded,
    isComposeDraftToBeLoaded,
    isComposeFeaturesToBeLoaded,
    isComposePostingEditing,
    isComposePostingToBeLoaded,
    isComposeSharedTextToBeLoaded
} from "state/compose/selectors";
import { SETTINGS_UPDATE_SUCCEEDED } from "state/settings/actions";
import {
    EVENT_HOME_DRAFT_POSTING_ADDED,
    EVENT_HOME_DRAFT_POSTING_DELETED,
    EVENT_HOME_DRAFT_POSTING_UPDATED,
    EVENT_HOME_NODE_SETTINGS_CHANGED,
    EVENT_NODE_POSTING_UPDATED
} from "api/events/actions";
import { getPostingStory, hasPostingFeedReference } from "state/postings/selectors";
import { storyAdded, storyUpdated } from "state/stories/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposeFeaturesToBeLoaded), composeFeaturesLoad),
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposePostingToBeLoaded), composePostingLoad),
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposeDraftToBeLoaded), composeDraftLoad),
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposeDraftListToBeLoaded), composeDraftListLoad),
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposeSharedTextToBeLoaded), composeSharedTextLoad),
    trigger(COMPOSE_POST_SUCCEEDED, true, signal => goToPosting(signal.payload.posting.id)),
    trigger(COMPOSE_POST_SUCCEEDED, true, signal => postingSet(signal.payload.posting)),
    trigger(
        COMPOSE_POST_SUCCEEDED,
        (state, signal) => !isComposePostingEditing(state)
            && hasPostingFeedReference(signal.payload.posting, "timeline"),
        signal => storyAdded(getPostingStory(signal.payload.posting, "timeline"))
    ),
    trigger(
        COMPOSE_POST_SUCCEEDED,
        (state, signal) => isComposePostingEditing(state)
            && hasPostingFeedReference(signal.payload.posting, "timeline"),
        signal => storyUpdated(getPostingStory(signal.payload.posting, "timeline"))
    ),
    trigger(
        EVENT_NODE_POSTING_UPDATED,
        (state, signal) => isAtComposePage(state) && getComposePostingId(state) === signal.payload.id,
        composeConflict
    ),
    trigger(
        [SETTINGS_UPDATE_SUCCEEDED, EVENT_HOME_NODE_SETTINGS_CHANGED],
        isAtComposePage,
        composeFeaturesLoad
    ),
    trigger(
        [SETTINGS_UPDATE_SUCCEEDED, EVENT_HOME_NODE_SETTINGS_CHANGED],
        inv(isAtComposePage),
        composeFeaturesUnset
    ),
    trigger(COMPOSE_DRAFT_SAVED, true, updateLocation),
    trigger(COMPOSE_DRAFT_SELECT, isComposeDraftToBeLoaded, composeDraftLoad),
    trigger(COMPOSE_DRAFT_SELECT, true, updateLocation),
    trigger(COMPOSE_DRAFT_LIST_ITEM_DELETED, true, updateLocation),
    trigger(COMPOSE_PREVIEW, true, dialogOpened(composePreviewClose())),
    trigger(
        [EVENT_HOME_DRAFT_POSTING_ADDED, EVENT_HOME_DRAFT_POSTING_UPDATED],
        isComposeDraftListLoaded,
        signal => composeDraftListItemReload(signal.payload.id)
    ),
    trigger(
        EVENT_HOME_DRAFT_POSTING_DELETED,
        isComposeDraftListLoaded,
        signal => composeDraftListItemDeleted(signal.payload.id)
    )
];
