import { Action } from 'redux';

import {
    Page, PAGE_COMPLAINS,
    PAGE_COMPOSE,
    PAGE_DETAILED_POSTING,
    PAGE_NEWS,
    PAGE_PEOPLE,
    PAGE_PROFILE,
    PAGE_SETTINGS,
    PAGE_TIMELINE
} from "state/navigation/pages";
import { ActionWithPayload } from "state/action-types";

export const INIT_STORAGE = "INIT_STORAGE";
export type InitStorageAction = ActionWithPayload<typeof INIT_STORAGE, {
    standalone: boolean;
}>;
export const initStorage = (standalone: boolean): InitStorageAction => ({
    type: INIT_STORAGE,
    payload: {standalone}
});

export const INIT_FROM_NODE_LOCATION = "INIT_FROM_NODE_LOCATION";
export type InitFromNodeLocationAction = ActionWithPayload<typeof INIT_FROM_NODE_LOCATION, {
    nodeName: string;
    location: string;
    fallbackUrl: string;
}>;
export const initFromNodeLocation = (nodeName: string, location: string,
                                     fallbackUrl: string): InitFromNodeLocationAction => ({
    type: INIT_FROM_NODE_LOCATION,
    payload: {nodeName, location, fallbackUrl}
});

export const INIT_FROM_LOCATION = "INIT_FROM_LOCATION";
export type InitFromLocationAction = ActionWithPayload<typeof INIT_FROM_LOCATION, {
    rootLocation: string;
    path: string | null;
    query: string | null;
    hash: string | null;
}>;
export const initFromLocation = (rootLocation: string, path: string | null, query: string | null,
                                 hash: string | null): InitFromLocationAction => ({
    type: INIT_FROM_LOCATION,
    payload: {rootLocation, path, query, hash}
});

export const WAKE_UP = "WAKE_UP";
export type WakeUpAction = Action<typeof WAKE_UP>;
export const wakeUp = (): WakeUpAction => ({
    type: WAKE_UP
});

export const GO_TO_PAGE = "GO_TO_PAGE";
export type GoToPageAction<P extends Page, D> = ActionWithPayload<typeof GO_TO_PAGE, {
    page: P;
    details: D & {at: number | null};
}>;
export const goToPage = <P extends Page, D>(page: P, details: D): GoToPageAction<P, D> => ({
    type: GO_TO_PAGE,
    payload: {page, details: {at: null, ...details}}
});

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
export const goToPosting = (id: string, commentId: string | null = null,
                            galleryExpanded: boolean = false): GoToPostingAction =>
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

export const GO_TO_PAGE_WITH_DEFAULT_SUBPAGE = "GO_TO_PAGE_WITH_DEFAULT_SUBPAGE";
export type GoToPageWithDefaultSubpageAction = ActionWithPayload<typeof GO_TO_PAGE_WITH_DEFAULT_SUBPAGE, {
    page: Page;
    details: object;
}>;
export const goToPageWithDefaultSubpage = (page: Page, details: object = {}): GoToPageWithDefaultSubpageAction => ({
    type: GO_TO_PAGE_WITH_DEFAULT_SUBPAGE,
    payload: {page, details}
});

export const NEW_LOCATION = "NEW_LOCATION";
export type NewLocationAction = Action<typeof NEW_LOCATION>;
export const newLocation = (): NewLocationAction => ({
    type: NEW_LOCATION
});

export const UPDATE_LOCATION = "UPDATE_LOCATION";
export type UpdateLocationAction = Action<typeof UPDATE_LOCATION>;
export const updateLocation = (): UpdateLocationAction => ({
    type: UPDATE_LOCATION
});

export const LOCATION_SET = "LOCATION_SET";
export type LocationSetAction = ActionWithPayload<typeof LOCATION_SET, {
    location: string;
    title: string | null;
    update: boolean;
}>;
export const locationSet = (location: string, title: string | null, update: boolean): LocationSetAction => ({
    type: LOCATION_SET,
    payload: {location, title, update}
});

export const LOCATION_LOCK = "LOCATION_LOCK";
export type LocationLockAction = Action<typeof LOCATION_LOCK>;
export const locationLock = (): LocationLockAction => ({
    type: LOCATION_LOCK
});

export const LOCATION_UNLOCK = "LOCATION_UNLOCK";
export type LocationUnlockAction = Action<typeof LOCATION_UNLOCK>;
export const locationUnlock = (): LocationUnlockAction => ({
    type: LOCATION_UNLOCK
});

export const GO_TO_LOCATION = "GO_TO_LOCATION";
export type GoToLocationAction = ActionWithPayload<typeof GO_TO_LOCATION, {
    path: string | null;
    query: string | null;
    hash: string | null;
}>;
export const goToLocation = (path: string | null, query: string | null, hash: string | null): GoToLocationAction => ({
    type: GO_TO_LOCATION,
    payload: {path, query, hash}
});

export const GO_HOME = "GO_HOME";
export type GoHomeAction = Action<typeof GO_HOME>;
export const goHome = (): GoHomeAction => ({
    type: GO_HOME
});

export const GO_HOME_NEWS = "GO_HOME_NEWS";
export type GoHomeNewsAction = Action<typeof GO_HOME_NEWS>;
export const goHomeNews = (): GoHomeNewsAction => ({
    type: GO_HOME_NEWS
});

export const BOTTOM_MENU_HIDE = "BOTTOM_MENU_HIDE";
export type BottomMenuHideAction = Action<typeof BOTTOM_MENU_HIDE>;
export const bottomMenuHide = (): BottomMenuHideAction => ({
    type: BOTTOM_MENU_HIDE
});

export const BOTTOM_MENU_SHOW = "BOTTOM_MENU_SHOW";
export type BottomMenuShowAction = Action<typeof BOTTOM_MENU_SHOW>;
export const bottomMenuShow = (): BottomMenuShowAction => ({
    type: BOTTOM_MENU_SHOW
});

export const DIALOG_OPENED = "DIALOG_OPENED";
export type DialogOpenedAction = ActionWithPayload<typeof DIALOG_OPENED, {
    closeAction: any;
}>;
export const dialogOpened = (closeAction: any): DialogOpenedAction => ({
    type: DIALOG_OPENED,
    payload: {closeAction}
});

export const DIALOG_CLOSED = "DIALOG_CLOSED";
export type DialogClosedAction = Action<typeof DIALOG_CLOSED>;
export const dialogClosed = (): DialogClosedAction => ({
    type: DIALOG_CLOSED
});

export const SWIPE_REFRESH_UPDATE = "SWIPE_REFRESH_UPDATE";
export type SwipeRefreshUpdateAction = Action<typeof SWIPE_REFRESH_UPDATE>;
export const swipeRefreshUpdate = (): SwipeRefreshUpdateAction => ({
    type: SWIPE_REFRESH_UPDATE
});

export const BODY_SCROLL_UPDATE = "BODY_SCROLL_UPDATE";
export type BodyScrollUpdateAction = Action<typeof BODY_SCROLL_UPDATE>;
export const bodyScrollUpdate = (): BodyScrollUpdateAction => ({
    type: BODY_SCROLL_UPDATE
});

export type NavigationAnyAction =
    InitStorageAction
    | InitFromNodeLocationAction
    | InitFromLocationAction
    | WakeUpAction
    | GoToPageAnyAction
    | GoToPageWithDefaultSubpageAction
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
