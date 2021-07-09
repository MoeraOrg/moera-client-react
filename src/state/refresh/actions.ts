import { ActionBase } from "state/action-base";

export const REFRESH_SHOW = "REFRESH_SHOW";
type RefreshShowAction = ActionBase<typeof REFRESH_SHOW, never>;
export const refreshShow = (): RefreshShowAction => ({
    type: REFRESH_SHOW
});

export const REFRESH_HIDE = "REFRESH_HIDE";
type RefreshHideAction = ActionBase<typeof REFRESH_HIDE, never>;
export const refreshHide = (): RefreshHideAction => ({
    type: REFRESH_HIDE
});

export type RefreshAnyAction =
    RefreshShowAction
    | RefreshHideAction;
