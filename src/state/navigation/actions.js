import {
    PAGE_COMPOSE,
    PAGE_DETAILED_POSTING,
    PAGE_NEWS,
    PAGE_PROFILE,
    PAGE_SETTINGS,
    PAGE_TIMELINE
} from "state/navigation/pages";

export const INIT_FROM_LOCATION = "INIT_FROM_LOCATION";
export const initFromLocation = (rootLocation, path, query, hash) => ({
    type: INIT_FROM_LOCATION,
    payload: {rootLocation, path, query, hash}
});

export const GO_TO_PAGE = "GO_TO_PAGE";
export const goToPage = (page, details = {}) => ({
    type: GO_TO_PAGE,
    payload: {page, details}
});
export const goToProfile = () => goToPage(PAGE_PROFILE);
export const goToTimeline = (at = null) => goToPage(PAGE_TIMELINE, {at});
export const goToPosting = (id) => goToPage(PAGE_DETAILED_POSTING, {id});
export const goToCompose = (id = null, draftId = null) => goToPage(PAGE_COMPOSE, {id, draftId});
export const goToSettings = () => goToPage(PAGE_SETTINGS);
export const goToNews = (at = null) => goToPage(PAGE_NEWS, {at});

export const GO_TO_PAGE_WITH_DEFAULT_SUBPAGE = "GO_TO_PAGE_WITH_DEFAULT_SUBPAGE";
export const goToPageWithDefaultSubpage = (page, details = {}) => ({
    type: GO_TO_PAGE_WITH_DEFAULT_SUBPAGE,
    payload: {page, details}
});
export const goToSettingsWithDefaultSubpage = () => goToPageWithDefaultSubpage(PAGE_SETTINGS);

export const NEW_LOCATION = "NEW_LOCATION";
export const newLocation = () => ({
    type: NEW_LOCATION
});

export const UPDATE_LOCATION = "UPDATE_LOCATION";
export const updateLocation = () => ({
    type: UPDATE_LOCATION
});

export const LOCATION_SET = "LOCATION_SET";
export const locationSet = (location, title, update) => ({
    type: LOCATION_SET,
    payload: {location, title, update}
});

export const LOCATION_LOCK = "LOCATION_LOCK";
export const locationLock = () => ({
    type: LOCATION_LOCK
});

export const LOCATION_UNLOCK = "LOCATION_UNLOCK";
export const locationUnlock = () => ({
    type: LOCATION_UNLOCK
});

export const GO_TO_LOCATION = "GO_TO_LOCATION";
export const goToLocation = (path, query, hash) => ({
    type: GO_TO_LOCATION,
    payload: {path, query, hash}
});
