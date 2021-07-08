import { ActionBase } from "state/action-base";

export const FLASH_BOX = "FLASH_BOX";
type FlashBoxAction = ActionBase<typeof FLASH_BOX, {
    message: string;
}>;
export const flashBox = (message: string): FlashBoxAction => ({
    type: FLASH_BOX,
    payload: {message}
});

export const FLASH_BOX_DISMISS = "FLASH_BOX_DISMISS";
type FlashBoxDismissAction = ActionBase<typeof FLASH_BOX_DISMISS, never>;
export const flashBoxDismiss = (): FlashBoxDismissAction => ({
    type: FLASH_BOX_DISMISS
});

export const FLASH_BOX_CLOSE = "FLASH_BOX_CLOSE";
type FlashBoxCloseAction = ActionBase<typeof FLASH_BOX_CLOSE, never>;
export const flashBoxClose = (): FlashBoxCloseAction => ({
    type: FLASH_BOX_CLOSE
});

export type FlashBoxAnyAction =
    FlashBoxAction
    | FlashBoxDismissAction
    | FlashBoxCloseAction;
