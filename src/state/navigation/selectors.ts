import { isAtNode } from "state/node/selectors";
import { ClientState } from "state/state";

export function isAtTimelinePage(state: ClientState): boolean {
    return isAtNode(state) && state.navigation.page === "timeline";
}

export function isAtProfilePage(state: ClientState): boolean {
    return isAtNode(state) && state.navigation.page === "profile";
}

export function isAtDetailedPostingPage(state: ClientState): boolean {
    return isAtNode(state) && state.navigation.page === "detailedposting";
}

export function isAtComposePage(state: ClientState): boolean {
    return isAtNode(state) && state.navigation.page === "compose";
}

export function isAtSettingsPage(state: ClientState): boolean {
    return isAtNode(state) && state.navigation.page === "settings";
}

export function isAtNewsPage(state: ClientState): boolean {
    return isAtNode(state) && state.navigation.page === "news";
}

export function isAtPeoplePage(state: ClientState): boolean {
    return isAtNode(state) && state.navigation.page === "people";
}

export function isAtComplaintsPage(state: ClientState): boolean {
    return isAtNode(state) && state.navigation.page === "complaints";
}

export function isAtRemovalPage(state: ClientState): boolean {
    return state.navigation.page === "removal";
}

export function isAtGrantPage(state: ClientState): boolean {
    return state.navigation.page === "grant";
}

export function isAtSearchPage(state: ClientState): boolean {
    return state.navigation.page === "search";
}

export function isAtExplorePage(state: ClientState): boolean {
    return state.navigation.page === "explore";
}

export function isBottomMenuVisible(state: ClientState): boolean {
    return state.navigation.bottomMenuVisible;
}
