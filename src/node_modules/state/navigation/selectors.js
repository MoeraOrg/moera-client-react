import {
    PAGE_COMPOSE,
    PAGE_DETAILED_POSTING,
    PAGE_PROFILE,
    PAGE_SETTINGS,
    PAGE_TIMELINE
} from "state/navigation/pages";

export function isAtTimelinePage(state) {
    return state.navigation.page === PAGE_TIMELINE;
}

export function isAtProfilePage(state) {
    return state.navigation.page === PAGE_PROFILE;
}

export function isAtDetailedPostingPage(state) {
    return state.navigation.page === PAGE_DETAILED_POSTING;
}

export function isAtComposePage(state) {
    return state.navigation.page === PAGE_COMPOSE;
}

export function isAtSettingsPage(state) {
    return state.navigation.page === PAGE_SETTINGS;
}
