import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { ConfirmBoxButtonAction } from "state/confirmbox/state";

export type ConfirmBoxAction = ActionWithPayload<"CONFIRM_BOX", {
    message: string;
    yes: string | null;
    no: string | null;
    cancel: string | null;
    onYes: ConfirmBoxButtonAction | null;
    onNo: ConfirmBoxButtonAction | null;
    onCancel: ConfirmBoxButtonAction | null;
    variant: string;
    dontShowAgainBox: boolean;
}>;
export const confirmBox = (
    message: string, yes: string | null = null, no: string | null = null, onYes: ConfirmBoxButtonAction | null = null,
    onNo: ConfirmBoxButtonAction | null = null, variant: string = "primary", cancel: string | null = null,
    onCancel: ConfirmBoxButtonAction | null = null, dontShowAgainBox: boolean = false
): ConfirmBoxAction =>
    actionWithPayload("CONFIRM_BOX", {message, yes, no, cancel, onYes, onNo, onCancel, variant, dontShowAgainBox});

export type CloseConfirmBoxAction = ActionWithoutPayload<"CLOSE_CONFIRM_BOX">;
export const closeConfirmBox = (): CloseConfirmBoxAction =>
    actionWithoutPayload("CLOSE_CONFIRM_BOX");

export type ConfirmBoxAnyAction =
    ConfirmBoxAction
    | CloseConfirmBoxAction;
