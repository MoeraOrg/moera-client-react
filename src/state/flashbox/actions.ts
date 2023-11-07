import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type FlashBoxAction = ActionWithPayload<"FLASH_BOX", {
    message: string;
    short: boolean;
}>;
export const flashBox = (message: string, short: boolean = false): FlashBoxAction =>
    actionWithPayload("FLASH_BOX", {message, short});

export type FlashBoxDismissAction = ActionWithoutPayload<"FLASH_BOX_DISMISS">;
export const flashBoxDismiss = (): FlashBoxDismissAction =>
    actionWithoutPayload("FLASH_BOX_DISMISS");

export type FlashBoxCloseAction = ActionWithoutPayload<"FLASH_BOX_CLOSE">;
export const flashBoxClose = (): FlashBoxCloseAction =>
    actionWithoutPayload("FLASH_BOX_CLOSE");

export type FlashBoxAnyAction =
    FlashBoxAction
    | FlashBoxDismissAction
    | FlashBoxCloseAction;
