import { Action } from 'redux';

export const REFRESH_SHOW = "REFRESH_SHOW";
export type RefreshShowAction = Action<typeof REFRESH_SHOW>;
export const refreshShow = (): RefreshShowAction => ({
    type: REFRESH_SHOW
});

export const REFRESH_HIDE = "REFRESH_HIDE";
export type RefreshHideAction = Action<typeof REFRESH_HIDE>;
export const refreshHide = (): RefreshHideAction => ({
    type: REFRESH_HIDE
});

export type RefreshAnyAction =
    RefreshShowAction
    | RefreshHideAction;
