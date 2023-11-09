import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import {
    Page,
    PAGE_COMPLAINS,
    PAGE_COMPOSE,
    PAGE_DETAILED_POSTING,
    PAGE_NEWS,
    PAGE_PEOPLE,
    PAGE_PROFILE,
    PAGE_SETTINGS,
    PAGE_TIMELINE
} from "state/navigation/pages";

export type InitFromNodeLocationAction = ActionWithPayload<"INIT_FROM_NODE_LOCATION", {
    nodeName: string;
    location: string;
    fallbackUrl: string;
}>;
export const initFromNodeLocation = (
    nodeName: string, location: string, fallbackUrl: string
): InitFromNodeLocationAction =>
    actionWithPayload("INIT_FROM_NODE_LOCATION", {nodeName, location, fallbackUrl});

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

export type GoToProfileAction = GoToPageAction<typeof PAGE_PROFILE, {}>;
export const goToProfile = (): GoToProfileAction =>
    goToPage(PAGE_PROFILE, {});

export type GoToTimelineAction = GoToPageAction<typeof PAGE_TIMELINE, {
    at: number | null;
}>;
export const goToTimeline = (at: number | null = null): GoToTimelineAction =>
    goToPage(PAGE_TIMELINE, {at});

export type GoToPostingAction = GoToPageAction<typeof PAGE_DETAILED_POSTING, {
    id: string;
    commentId: string | null;
    galleryExpanded: boolean;
}>;
export const goToPosting = (
    id: string, commentId: string | null = null, galleryExpanded: boolean = false
): GoToPostingAction =>
    goToPage(PAGE_DETAILED_POSTING, {id, commentId, galleryExpanded});

export type GoToComposeAction = GoToPageAction<typeof PAGE_COMPOSE, {
    id: string | null;
    draftId: string | null;
}>;
export const goToCompose = (id: string | null = null, draftId: string | null = null): GoToComposeAction =>
    goToPage(PAGE_COMPOSE, {id, draftId});

export type GoToSettingsAction = GoToPageAction<typeof PAGE_SETTINGS, {}>;
export const goToSettings = (): GoToSettingsAction =>
    goToPage(PAGE_SETTINGS, {});

export type GoToNewsAction = GoToPageAction<typeof PAGE_NEWS, {
    at: number | null;
}>;
export const goToNews = (at: number | null = null): GoToNewsAction =>
    goToPage(PAGE_NEWS, {at});

export type GoToPeopleAction = GoToPageAction<typeof PAGE_PEOPLE, {}>;
export const goToPeople = (): GoToPeopleAction =>
    goToPage(PAGE_PEOPLE, {});

export type GoToComplainsAction = GoToPageAction<typeof PAGE_COMPLAINS, {}>;
export const goToComplains = (): GoToComplainsAction =>
    goToPage(PAGE_COMPLAINS, {});

export type GoToPageAnyAction =
    GoToProfileAction
    | GoToTimelineAction
    | GoToPostingAction
    | GoToComposeAction
    | GoToSettingsAction
    | GoToNewsAction
    | GoToPeopleAction
    | GoToComplainsAction;

export type NewLocationAction = ActionWithoutPayload<"NEW_LOCATION">;
export const newLocation = (): NewLocationAction =>
    actionWithoutPayload("NEW_LOCATION");

export type UpdateLocationAction = ActionWithoutPayload<"UPDATE_LOCATION">;
export const updateLocation = (): UpdateLocationAction =>
    actionWithoutPayload("UPDATE_LOCATION");

export type LocationSetAction = ActionWithPayload<"LOCATION_SET", {
    location: string;
    title: string | null;
    update: boolean;
}>;
export const locationSet = (location: string, title: string | null, update: boolean): LocationSetAction =>
    actionWithPayload("LOCATION_SET", {location, title, update});

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

export type GoHomeAction = ActionWithoutPayload<"GO_HOME">;
export const goHome = (): GoHomeAction =>
    actionWithoutPayload("GO_HOME");

export type GoHomeNewsAction = ActionWithoutPayload<"GO_HOME_NEWS">;
export const goHomeNews = (): GoHomeNewsAction =>
    actionWithoutPayload("GO_HOME_NEWS");

export type BottomMenuHideAction = ActionWithoutPayload<"BOTTOM_MENU_HIDE">;
export const bottomMenuHide = (): BottomMenuHideAction =>
    actionWithoutPayload("BOTTOM_MENU_HIDE");

export type BottomMenuShowAction = ActionWithoutPayload<"BOTTOM_MENU_SHOW">;
export const bottomMenuShow = (): BottomMenuShowAction =>
    actionWithoutPayload("BOTTOM_MENU_SHOW");

export type DialogOpenedAction = ActionWithPayload<"DIALOG_OPENED", {
    closeAction: any;
}>;
export const dialogOpened = (closeAction: any): DialogOpenedAction =>
    actionWithPayload("DIALOG_OPENED", {closeAction});

export type DialogClosedAction = ActionWithoutPayload<"DIALOG_CLOSED">;
export const dialogClosed = (): DialogClosedAction =>
    actionWithoutPayload("DIALOG_CLOSED");

export type SwipeRefreshUpdateAction = ActionWithoutPayload<"SWIPE_REFRESH_UPDATE">;
export const swipeRefreshUpdate = (): SwipeRefreshUpdateAction =>
    actionWithoutPayload("SWIPE_REFRESH_UPDATE");

export type BodyScrollUpdateAction = ActionWithoutPayload<"BODY_SCROLL_UPDATE">;
export const bodyScrollUpdate = (): BodyScrollUpdateAction =>
    actionWithoutPayload("BODY_SCROLL_UPDATE");

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
    | GoHomeAction
    | GoHomeNewsAction
    | BottomMenuHideAction
    | BottomMenuShowAction
    | DialogOpenedAction
    | DialogClosedAction
    | SwipeRefreshUpdateAction
    | BodyScrollUpdateAction;
