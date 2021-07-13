import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";

export const FLASH_BOX = "FLASH_BOX";
type FlashBoxAction = ActionWithPayload<typeof FLASH_BOX, {
    message: string;
}>;
export const flashBox = (message: string): FlashBoxAction => ({
    type: FLASH_BOX,
    payload: {message}
});

export const FLASH_BOX_DISMISS = "FLASH_BOX_DISMISS";
type FlashBoxDismissAction = Action<typeof FLASH_BOX_DISMISS>;
export const flashBoxDismiss = (): FlashBoxDismissAction => ({
    type: FLASH_BOX_DISMISS
});

export const FLASH_BOX_CLOSE = "FLASH_BOX_CLOSE";
type FlashBoxCloseAction = Action<typeof FLASH_BOX_CLOSE>;
export const flashBoxClose = (): FlashBoxCloseAction => ({
    type: FLASH_BOX_CLOSE
});

export type FlashBoxAnyAction =
    FlashBoxAction
    | FlashBoxDismissAction
    | FlashBoxCloseAction;
