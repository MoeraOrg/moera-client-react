import { actionWithoutPayload, ActionWithoutPayload } from "state/action-types";

export type OpenQuickTipsAction = ActionWithoutPayload<"OPEN_QUICK_TIPS">;
export const openQuickTips = (): OpenQuickTipsAction =>
    actionWithoutPayload("OPEN_QUICK_TIPS");

export type CloseQuickTipsAction = ActionWithoutPayload<"CLOSE_QUICK_TIPS">;
export const closeQuickTips = (): CloseQuickTipsAction =>
    actionWithoutPayload("CLOSE_QUICK_TIPS");

export type QuickTipsAnyAction =
    OpenQuickTipsAction
    | CloseQuickTipsAction;
