import { Action } from 'redux';

export const OPEN_QUICK_TIPS = "OPEN_QUICK_TIPS";
export type OpenQuickTipsAction = Action<typeof OPEN_QUICK_TIPS>;
export const openQuickTips = (): OpenQuickTipsAction => ({
    type: OPEN_QUICK_TIPS
});

export const CLOSE_QUICK_TIPS = "CLOSE_QUICK_TIPS";
export type CloseQuickTipsAction = Action<typeof CLOSE_QUICK_TIPS>;
export const closeQuickTips = (): CloseQuickTipsAction => ({
    type: CLOSE_QUICK_TIPS
});

export type QuickTipsAnyAction =
    OpenQuickTipsAction
    | CloseQuickTipsAction;
