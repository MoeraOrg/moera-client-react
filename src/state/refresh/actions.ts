import { actionWithoutPayload, ActionWithoutPayload } from "state/action-types";

export type RefreshShowAction = ActionWithoutPayload<"REFRESH_SHOW">;
export const refreshShow = (): RefreshShowAction =>
    actionWithoutPayload("REFRESH_SHOW");

export type RefreshHideAction = ActionWithoutPayload<"REFRESH_HIDE">;
export const refreshHide = (): RefreshHideAction =>
    actionWithoutPayload("REFRESH_HIDE");

export type RefreshCheckBuildAction = ActionWithoutPayload<"REFRESH_CHECK_BUILD">;
export const refreshCheckBuild = (): RefreshCheckBuildAction =>
    actionWithoutPayload("REFRESH_CHECK_BUILD");

export type RefreshConfirmingReloadAction = ActionWithoutPayload<"REFRESH_CONFIRMING_RELOAD">;
export const refreshConfirmingReload = (): RefreshConfirmingReloadAction =>
    actionWithoutPayload("REFRESH_CONFIRMING_RELOAD");

export type RefreshReloadCancelledAction = ActionWithoutPayload<"REFRESH_RELOAD_CANCELLED">;
export const refreshReloadCancelled = (): RefreshReloadCancelledAction =>
    actionWithoutPayload("REFRESH_RELOAD_CANCELLED");

export type RefreshAnyAction =
    RefreshShowAction
    | RefreshHideAction
    | RefreshCheckBuildAction
    | RefreshConfirmingReloadAction
    | RefreshReloadCancelledAction;
