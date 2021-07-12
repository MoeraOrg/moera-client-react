import {
    Page,
    PAGE_COMPOSE,
    PAGE_DETAILED_POSTING,
    PAGE_NEWS,
    PAGE_PEOPLE,
    PAGE_PROFILE,
    PAGE_SETTINGS,
    PAGE_TIMELINE
} from "state/navigation/pages";
import { ActionBase, ActionWithPayload } from "state/action-base";

export const INIT_STORAGE = "INIT_STORAGE";
type InitStorageAction = ActionWithPayload<typeof INIT_STORAGE, {
    standalone: boolean;
}>;
export const initStorage = (standalone: boolean): InitStorageAction => ({
    type: INIT_STORAGE,
    payload: {standalone}
});

export const INIT_FROM_LOCATION = "INIT_FROM_LOCATION";
type InitFromLocationAction = ActionWithPayload<typeof INIT_FROM_LOCATION, {
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
type WakeUpAction = ActionBase<typeof WAKE_UP>;
export const wakeUp = (): WakeUpAction => ({
    type: WAKE_UP
});

export const GO_TO_PAGE = "GO_TO_PAGE";
type GoToPageAction<P extends Page, D> = ActionWithPayload<typeof GO_TO_PAGE, {
    page: P;
    details: D;
}>;
export const goToPage = <P extends Page, D>(page: P, details: D): GoToPageAction<P, D> => ({
    type: GO_TO_PAGE,
    payload: {page, details}
});

type GoToProfileAction = GoToPageAction<typeof PAGE_PROFILE, {}>;
export const goToProfile = (): GoToProfileAction =>
    goToPage(PAGE_PROFILE, {});

type GoToTimelineAction = GoToPageAction<typeof PAGE_TIMELINE, {
    at: number | null;
}>;
export const goToTimeline = (at: number | null = null): GoToTimelineAction =>
    goToPage(PAGE_TIMELINE, {at});

type GoToPostingAction = GoToPageAction<typeof PAGE_DETAILED_POSTING, {
    id: string;
    commentId: string | null;
}>;
export const goToPosting = (id: string, commentId: string | null = null): GoToPostingAction =>
    goToPage(PAGE_DETAILED_POSTING, {id, commentId});

type GoToComposeAction = GoToPageAction<typeof PAGE_COMPOSE, {
    id: string | null;
    draftId: string | null;
}>;
export const goToCompose = (id: string | null = null, draftId: string | null = null): GoToComposeAction =>
    goToPage(PAGE_COMPOSE, {id, draftId});

type GoToSettingsAction = GoToPageAction<typeof PAGE_SETTINGS, {}>;
export const goToSettings = (): GoToSettingsAction =>
    goToPage(PAGE_SETTINGS, {});

type GoToNewsAction = GoToPageAction<typeof PAGE_NEWS, {
    at: number | null;
}>;
export const goToNews = (at: number | null = null): GoToNewsAction =>
    goToPage(PAGE_NEWS, {at});

type GoToPeopleAction = GoToPageAction<typeof PAGE_PEOPLE, {}>;
export const goToPeople = (): GoToPeopleAction =>
    goToPage(PAGE_PEOPLE, {});

type GoToPageAnyAction =
    GoToProfileAction
    | GoToTimelineAction
    | GoToPostingAction
    | GoToComposeAction
    | GoToSettingsAction
    | GoToNewsAction
    | GoToPeopleAction;

export const GO_TO_PAGE_WITH_DEFAULT_SUBPAGE = "GO_TO_PAGE_WITH_DEFAULT_SUBPAGE";
type GoToPageWithDefaultSubpageAction = ActionWithPayload<typeof GO_TO_PAGE_WITH_DEFAULT_SUBPAGE, {
    page: Page;
    details: object;
}>;
export const goToPageWithDefaultSubpage = (page: Page, details: object = {}): GoToPageWithDefaultSubpageAction => ({
    type: GO_TO_PAGE_WITH_DEFAULT_SUBPAGE,
    payload: {page, details}
});

export const NEW_LOCATION = "NEW_LOCATION";
type NewLocationAction = ActionBase<typeof NEW_LOCATION>;
export const newLocation = (): NewLocationAction => ({
    type: NEW_LOCATION
});

export const UPDATE_LOCATION = "UPDATE_LOCATION";
type UpdateLocationAction = ActionBase<typeof UPDATE_LOCATION>;
export const updateLocation = (): UpdateLocationAction => ({
    type: UPDATE_LOCATION
});

export const LOCATION_SET = "LOCATION_SET";
type LocationSetAction = ActionWithPayload<typeof LOCATION_SET, {
    location: string;
    title: string;
    update: boolean;
}>;
export const locationSet = (location: string, title: string, update: boolean): LocationSetAction => ({
    type: LOCATION_SET,
    payload: {location, title, update}
});

export const LOCATION_LOCK = "LOCATION_LOCK";
type LocationLockAction = ActionBase<typeof LOCATION_LOCK>;
export const locationLock = (): LocationLockAction => ({
    type: LOCATION_LOCK
});

export const LOCATION_UNLOCK = "LOCATION_UNLOCK";
type LocationUnlockAction = ActionBase<typeof LOCATION_UNLOCK>;
export const locationUnlock = (): LocationUnlockAction => ({
    type: LOCATION_UNLOCK
});

export const GO_TO_LOCATION = "GO_TO_LOCATION";
type GoToLocationAction = ActionWithPayload<typeof GO_TO_LOCATION, {
    path: string | null;
    query: string | null;
    hash: string | null;
}>;
export const goToLocation = (path: string | null, query: string | null, hash: string | null): GoToLocationAction => ({
    type: GO_TO_LOCATION,
    payload: {path, query, hash}
});

export const GO_HOME = "GO_HOME";
type GoHomeAction = ActionBase<typeof GO_HOME>;
export const goHome = (): GoHomeAction => ({
    type: GO_HOME
});

export const GO_HOME_NEWS = "GO_HOME_NEWS";
type GoHomeNewsAction = ActionBase<typeof GO_HOME_NEWS>;
export const goHomeNews = (): GoHomeNewsAction => ({
    type: GO_HOME_NEWS
});

export const BOTTOM_MENU_HIDE = "BOTTOM_MENU_HIDE";
type BottomMenuHideAction = ActionBase<typeof BOTTOM_MENU_HIDE>;
export const bottomMenuHide = (): BottomMenuHideAction => ({
    type: BOTTOM_MENU_HIDE
});

export const BOTTOM_MENU_SHOW = "BOTTOM_MENU_SHOW";
type BottomMenuShowAction = ActionBase<typeof BOTTOM_MENU_SHOW>;
export const bottomMenuShow = (): BottomMenuShowAction => ({
    type: BOTTOM_MENU_SHOW
});

export const DIALOG_OPENED = "DIALOG_OPENED";
type DialogOpenedAction = ActionWithPayload<typeof DIALOG_OPENED, {
    closeAction: any;
}>;
export const dialogOpened = (closeAction: any): DialogOpenedAction => ({
    type: DIALOG_OPENED,
    payload: {closeAction}
});

export const DIALOG_CLOSED = "DIALOG_CLOSED";
type DialogClosedAction = ActionBase<typeof DIALOG_CLOSED>;
export const dialogClosed = (): DialogClosedAction => ({
    type: DIALOG_CLOSED
});

export type NavigationAnyAction =
    InitStorageAction
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
    | DialogClosedAction;
