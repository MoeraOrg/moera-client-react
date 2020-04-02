import { conj, inv, trigger } from "state/trigger";
import {
    COMPOSE_DRAFT_LIST_ITEM_DELETED,
    COMPOSE_DRAFT_SAVED,
    COMPOSE_DRAFT_SELECT,
    COMPOSE_POST_SUCCEEDED,
    COMPOSE_POSTING_LOADED,
    composeConflict,
    composeDraftListItemDeleted,
    composeDraftListItemReload,
    composeDraftListLoad,
    composeDraftLoad,
    composeFeaturesLoad,
    composeFeaturesUnset,
    composePostingLoad
} from "state/compose/actions";
import { GO_TO_PAGE, goToPosting, updateLocation } from "state/navigation/actions";
import { postingSet } from "state/postings/actions";
import { isAtComposePage } from "state/navigation/selectors";
import {
    getComposePostingId,
    isComposeDraftListLoaded,
    isComposeDraftListToBeLoaded,
    isComposeDraftToBeLoaded,
    isComposeFeaturesToBeLoaded,
    isComposePostingToBeLoaded
} from "state/compose/selectors";
import { SETTINGS_UPDATE_SUCCEEDED } from "state/settings/actions";
import {
    EVENT_HOME_DRAFT_POSTING_ADDED,
    EVENT_HOME_DRAFT_POSTING_DELETED,
    EVENT_HOME_DRAFT_POSTING_UPDATED,
    EVENT_HOME_NODE_SETTINGS_CHANGED,
    EVENT_NODE_POSTING_UPDATED
} from "api/events/actions";
import { timelineStoryAdded } from "state/timeline/actions";
import { getPostingMoment } from "state/postings/selectors";

export default [
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposeFeaturesToBeLoaded), composeFeaturesLoad),
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposePostingToBeLoaded), composePostingLoad),
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposeDraftToBeLoaded), composeDraftLoad),
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposeDraftListToBeLoaded), composeDraftListLoad),
    trigger(COMPOSE_POSTING_LOADED, true, signal => postingSet(signal.payload.posting)),
    trigger(COMPOSE_POST_SUCCEEDED, true, signal => goToPosting(signal.payload.posting.id)),
    trigger(COMPOSE_POST_SUCCEEDED, true, signal => postingSet(signal.payload.posting)),
    trigger(
        COMPOSE_POST_SUCCEEDED,
        true,
        signal => timelineStoryAdded(
            signal.payload.posting.id,
            getPostingMoment(signal.payload.posting, "timeline")
        )
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
