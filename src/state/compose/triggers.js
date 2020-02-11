import { conj, inv, trigger } from "state/trigger";
import {
    COMPOSE_DRAFT_SAVED,
    COMPOSE_POST_SUCCEEDED,
    COMPOSE_POSTING_LOADED,
    composeConflict,
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
    isComposeDraftToBeLoaded,
    isComposeFeaturesToBeLoaded,
    isComposePostingToBeLoaded
} from "state/compose/selectors";
import { SETTINGS_UPDATE_SUCCEEDED } from "state/settings/actions";
import { EVENT_HOME_NODE_SETTINGS_CHANGED, EVENT_NODE_POSTING_UPDATED } from "api/events/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposeFeaturesToBeLoaded), composeFeaturesLoad),
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposePostingToBeLoaded), composePostingLoad),
    trigger(GO_TO_PAGE, conj(isAtComposePage, isComposeDraftToBeLoaded), composeDraftLoad),
    trigger(COMPOSE_POSTING_LOADED, true, signal => postingSet(signal.payload.posting)),
    trigger(COMPOSE_POST_SUCCEEDED, true, signal => goToPosting(signal.payload.posting.id)),
    trigger(COMPOSE_POST_SUCCEEDED, true, signal => postingSet(signal.payload.posting)),
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
    trigger(COMPOSE_DRAFT_SAVED, true, updateLocation)
];
