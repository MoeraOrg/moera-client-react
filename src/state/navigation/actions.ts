import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { Scope } from "api";
import { ClientState } from "state/state";
import { Page } from "state/navigation/pages";
import { SearchFilter, SearchTab } from "state/search/state";
import { DocumentLocation } from "util/universal-url";

export type BootAction = ActionWithPayload<"BOOT", {
    target?: DocumentLocation;
    initialState?: Partial<ClientState>;
}>;
export const boot = (target?: DocumentLocation, initialState?: Partial<ClientState>): BootAction =>
    actionWithPayload("BOOT", {target, initialState});

export type WakeUpAction = ActionWithoutPayload<"WAKE_UP">;
export const wakeUp = (): WakeUpAction =>
    actionWithoutPayload("WAKE_UP");

export type GoToPageAction<P extends Page, D> = ActionWithPayload<"GO_TO_PAGE", {
    page: P;
    details: D & {at: number | null};
    homeOnly: boolean;
}>;
export const goToPage = <P extends Page, D>(page: P, details: D, homeOnly: boolean = false): GoToPageAction<P, D> =>
    actionWithPayload("GO_TO_PAGE", {page, details: {at: null, ...details}, homeOnly});

export type GoToProfileAction = GoToPageAction<"profile", {}>;
export const goToProfile = (): GoToProfileAction =>
    goToPage("profile", {});

export type GoToTimelineAction = GoToPageAction<"timeline", {
    at: number | null;
}>;
export const goToTimeline = (at: number | null = null): GoToTimelineAction =>
    goToPage("timeline", {at});

export type GoToPostingAction = GoToPageAction<"detailedposting", {
    id: string;
    commentId: string | null;
    galleryExpanded: boolean;
}>;
export const goToPosting = (
    id: string, commentId: string | null = null, galleryExpanded: boolean = false
): GoToPostingAction =>
    goToPage("detailedposting", {id, commentId, galleryExpanded});

export type GoToComposeAction = GoToPageAction<"compose", {
    id: string | null;
    draftId: string | null;
}>;
export const goToCompose = (id: string | null = null, draftId: string | null = null): GoToComposeAction =>
    goToPage("compose", {id, draftId}, true);

export type GoToSettingsAction = GoToPageAction<"settings", {}>;
export const goToSettings = (): GoToSettingsAction =>
    goToPage("settings", {}, true);

export type GoToNewsAction = GoToPageAction<"news", {
    at: number | null;
}>;
export const goToNews = (at: number | null = null): GoToNewsAction =>
    goToPage("news", {at}, true);

export type GoToPeopleAction = GoToPageAction<"people", {}>;
export const goToPeople = (): GoToPeopleAction =>
    goToPage("people", {});

export type GoToComplaintsAction = GoToPageAction<"complaints", {}>;
export const goToComplaints = (): GoToComplaintsAction =>
    goToPage("complaints", {});

export type GoToRemovalAction = GoToPageAction<"removal", {}>;
export const goToRemoval = (): GoToRemovalAction =>
    goToPage("removal", {});

export type GoToGrantAction = GoToPageAction<"grant", {
    clientName: string;
    carte: string;
    scope: Scope[];
    redirectUri: string | null;
}>;
export const goToGrant = (
    clientName: string, carte: string, scope: Scope[], redirectUri: string | null
): GoToGrantAction =>
    goToPage("grant", {clientName, carte, scope, redirectUri}, true);

export type GoToSearchAction = GoToPageAction<"search", {
    query: string;
    tab: SearchTab;
    filter: SearchFilter;
}>;
export const goToSearch = (query: string, tab: SearchTab, filter: SearchFilter): GoToSearchAction =>
    goToPage("search", {query, tab, filter});

export type GoToExploreAction = GoToPageAction<"explore", {
    at: number | null;
}>;
export const goToExplore = (at: number | null = null): GoToExploreAction =>
    goToPage("explore", {at}, true);

export type GoToActivePeopleAction = GoToPageAction<"activepeople", {}>;
export const goToActivePeople = (): GoToActivePeopleAction =>
    goToPage("activepeople", {});

export type GoToInstantsAction = GoToPageAction<"instants", {}>;
export const goToInstants = (): GoToInstantsAction =>
    goToPage("instants", {}, true);

export type GoToConnectAction = GoToPageAction<"connect", {
    backHref: string;
}>;
export const goToConnect = (backHref: string): GoToConnectAction =>
    goToPage("connect", {backHref});

export type GoToSignUpAction = GoToPageAction<"signup", {
    backHref: string;
}>;
export const goToSignUp = (backHref: string): GoToSignUpAction =>
    goToPage("signup", {backHref});

export type GoToMnemonicAction = GoToPageAction<"mnemonic", {}>;
export const goToMnemonic = (): GoToMnemonicAction =>
    goToPage("mnemonic", {});

export type GoToStartReadingAction = GoToPageAction<"start-reading", {}>;
export const goToStartReading = (): GoToStartReadingAction =>
    goToPage("start-reading", {});

export type GoToEmailVerifiedAction = GoToPageAction<"email-verified", {}>;
export const goToEmailVerified = (): GoToEmailVerifiedAction =>
    goToPage("email-verified", {});

export type GoToVerifyEmailAction = GoToPageAction<"verify-email", {}>;
export const goToVerifyEmail = (): GoToVerifyEmailAction =>
    goToPage("verify-email", {});

export type GoToTrendingAction = GoToPageAction<"trending", {}>;
export const goToTrending = (): GoToTrendingAction =>
    goToPage("trending", {});

export type GoToDiscussionsAction = GoToPageAction<"discussions", {}>;
export const goToDiscussions = (): GoToDiscussionsAction =>
    goToPage("discussions", {});

export type GoToPageAnyAction =
    GoToProfileAction
    | GoToTimelineAction
    | GoToPostingAction
    | GoToPageAction<"compose", GoToComposeAction["payload"]["details"]>
    | GoToComposeAction
    | GoToPageAction<"settings", GoToComposeAction["payload"]["details"]>
    | GoToSettingsAction
    | GoToPageAction<"news", GoToComposeAction["payload"]["details"]>
    | GoToNewsAction
    | GoToPeopleAction
    | GoToComplaintsAction
    | GoToRemovalAction
    | GoToPageAction<"grant", GoToGrantAction["payload"]["details"]>
    | GoToGrantAction
    | GoToSearchAction
    | GoToPageAction<"explore", GoToComposeAction["payload"]["details"]>
    | GoToExploreAction
    | GoToActivePeopleAction
    | GoToPageAction<"instants", GoToComposeAction["payload"]["details"]>
    | GoToInstantsAction
    | GoToConnectAction
    | GoToSignUpAction
    | GoToMnemonicAction
    | GoToStartReadingAction
    | GoToEmailVerifiedAction
    | GoToVerifyEmailAction
    | GoToTrendingAction
    | GoToDiscussionsAction;

export type NewLocationAction = ActionWithoutPayload<"NEW_LOCATION">;
export const newLocation = (): NewLocationAction =>
    actionWithoutPayload("NEW_LOCATION");

export type UpdateLocationAction = ActionWithoutPayload<"UPDATE_LOCATION">;
export const updateLocation = (): UpdateLocationAction =>
    actionWithoutPayload("UPDATE_LOCATION");

export type LocationSetAction = ActionWithPayload<"LOCATION_SET", {
    location: string;
    title: string | null;
    canonicalUrl: string | null;
    noIndex: boolean;
}>;
export const locationSet = (
    location: string,
    title: string | null,
    canonicalUrl: string | null,
    noIndex: boolean
): LocationSetAction =>
    actionWithPayload("LOCATION_SET", {location, title, canonicalUrl, noIndex});

export type JumpFarAction = ActionWithPayload<"JUMP_FAR", {
    nodeName: string | null;
    rootLocation: string | null;
    path: string | null;
    query: string | null;
    hash: string | null;
}>;
export const jumpFar = (
    nodeName: string | null, rootLocation: string | null, path: string | null, query: string | null,
    hash: string | null
): JumpFarAction =>
    actionWithPayload("JUMP_FAR", {nodeName, rootLocation, path, query, hash});

export type JumpNearAction = ActionWithPayload<"JUMP_NEAR", {
    path: string | null;
    query: string | null;
    hash: string | null;
}>;
export const jumpNear = (path: string | null, query: string | null, hash: string | null): JumpNearAction =>
    actionWithPayload("JUMP_NEAR", {path, query, hash});

export type RestoreFarAction = ActionWithPayload<"RESTORE_FAR", {
    nodeName: string | null;
    rootLocation: string | null;
    path: string | null;
    query: string | null;
    hash: string | null;
}>;
export const restoreFar = (
    nodeName: string | null, rootLocation: string | null, path: string | null, query: string | null,
    hash: string | null
): RestoreFarAction =>
    actionWithPayload("RESTORE_FAR", {nodeName, rootLocation, path, query, hash});

export type RestoreNearAction = ActionWithPayload<"RESTORE_NEAR", {
    path: string | null;
    query: string | null;
    hash: string | null;
}>;
export const restoreNear = (path: string | null, query: string | null, hash: string | null): RestoreNearAction =>
    actionWithPayload("RESTORE_NEAR", {path, query, hash});

export type BottomMenuHideAction = ActionWithoutPayload<"BOTTOM_MENU_HIDE">;
export const bottomMenuHide = (): BottomMenuHideAction =>
    actionWithoutPayload("BOTTOM_MENU_HIDE");

export type BottomMenuShowAction = ActionWithoutPayload<"BOTTOM_MENU_SHOW">;
export const bottomMenuShow = (): BottomMenuShowAction =>
    actionWithoutPayload("BOTTOM_MENU_SHOW");

export type NavigationAnyAction =
    BootAction
    | WakeUpAction
    | GoToPageAnyAction
    | NewLocationAction
    | UpdateLocationAction
    | LocationSetAction
    | JumpFarAction
    | JumpNearAction
    | RestoreFarAction
    | RestoreNearAction
    | BottomMenuHideAction
    | BottomMenuShowAction;
