import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { Page } from "state/navigation/pages";
import { Scope } from "api";

export type InitFromNodeLocationAction = ActionWithPayload<"INIT_FROM_NODE_LOCATION", {
    nodeName: string;
    path: string | null;
    query: string | null;
    hash: string | null;
    fallbackUrl: string | null;
}>;
export const initFromNodeLocation = (
    nodeName: string, path: string | null, query: string | null, hash: string | null, fallbackUrl: string | null
): InitFromNodeLocationAction =>
    actionWithPayload("INIT_FROM_NODE_LOCATION", {nodeName, path, query, hash, fallbackUrl});

export type InitFromLocationAction = ActionWithPayload<"INIT_FROM_LOCATION", {
    nodeName: string | null;
    rootLocation: string;
    path: string | null;
    query: string | null;
    hash: string | null;
}>;
export const initFromLocation = (
    nodeName: string | null, rootLocation: string, path: string | null, query: string | null, hash: string | null
): InitFromLocationAction =>
    actionWithPayload("INIT_FROM_LOCATION", {nodeName, rootLocation, path, query, hash});

export type WakeUpAction = ActionWithoutPayload<"WAKE_UP">;
export const wakeUp = (): WakeUpAction =>
    actionWithoutPayload("WAKE_UP");

export type GoToPageAction<P extends Page, D> = ActionWithPayload<"GO_TO_PAGE", {
    page: P;
    details: D & {at: number | null};
}>;
export const goToPage = <P extends Page, D>(page: P, details: D): GoToPageAction<P, D> =>
    actionWithPayload("GO_TO_PAGE", {page, details: {at: null, ...details}});

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
    goToPage("compose", {id, draftId});

export type GoToSettingsAction = GoToPageAction<"settings", {}>;
export const goToSettings = (): GoToSettingsAction =>
    goToPage("settings", {});

export type GoToNewsAction = GoToPageAction<"news", {
    at: number | null;
}>;
export const goToNews = (at: number | null = null): GoToNewsAction =>
    goToPage("news", {at});

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
    goToPage("grant", {clientName, carte, scope, redirectUri});

export type GoToSearchAction = GoToPageAction<"search", {
    query: string;
}>;
export const goToSearch = (query: string): GoToSearchAction =>
    goToPage("search", {query});

export type GoToPageAnyAction =
    GoToProfileAction
    | GoToTimelineAction
    | GoToPostingAction
    | GoToComposeAction
    | GoToSettingsAction
    | GoToNewsAction
    | GoToPeopleAction
    | GoToComplaintsAction
    | GoToRemovalAction
    | GoToGrantAction
    | GoToSearchAction;

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
    update: boolean;
}>;
export const locationSet = (
    location: string, title: string | null, canonicalUrl: string | null, noIndex: boolean, update: boolean
): LocationSetAction =>
    actionWithPayload("LOCATION_SET", {location, title, canonicalUrl, noIndex, update});

export type LocationLockAction = ActionWithoutPayload<"LOCATION_LOCK">;
export const locationLock = (): LocationLockAction =>
    actionWithoutPayload("LOCATION_LOCK");

export type LocationUnlockAction = ActionWithoutPayload<"LOCATION_UNLOCK">;
export const locationUnlock = (): LocationUnlockAction =>
    actionWithoutPayload("LOCATION_UNLOCK");

export type GoToLocationAction = ActionWithPayload<"GO_TO_LOCATION", {
    path: string | null;
    query: string | null;
    hash: string | null;
}>;
export const goToLocation = (path: string | null, query: string | null, hash: string | null): GoToLocationAction =>
    actionWithPayload("GO_TO_LOCATION", {path, query, hash});

export type GoHomeLocationAction = ActionWithPayload<"GO_HOME_LOCATION", {
    path: string | null;
    query: string | null;
    hash: string | null;
}>;
export const goHomeLocation = (path: string | null, query: string | null, hash: string | null): GoHomeLocationAction =>
    actionWithPayload("GO_HOME_LOCATION", {path, query, hash});

export type BottomMenuHideAction = ActionWithoutPayload<"BOTTOM_MENU_HIDE">;
export const bottomMenuHide = (): BottomMenuHideAction =>
    actionWithoutPayload("BOTTOM_MENU_HIDE");

export type BottomMenuShowAction = ActionWithoutPayload<"BOTTOM_MENU_SHOW">;
export const bottomMenuShow = (): BottomMenuShowAction =>
    actionWithoutPayload("BOTTOM_MENU_SHOW");

export type NavigationAnyAction =
    InitFromNodeLocationAction
    | InitFromLocationAction
    | WakeUpAction
    | GoToPageAnyAction
    | NewLocationAction
    | UpdateLocationAction
    | LocationSetAction
    | LocationLockAction
    | LocationUnlockAction
    | GoToLocationAction
    | GoHomeLocationAction
    | BottomMenuHideAction
    | BottomMenuShowAction;
