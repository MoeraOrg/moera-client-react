import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { ConfirmBoxButtonAction } from "state/confirmbox/state";

export interface ConfirmBoxAttributes {
    message: string;
    yes?: string;
    no?: string;
    cancel?: string;
    onYes?: ConfirmBoxButtonAction;
    onNo?: ConfirmBoxButtonAction;
    onCancel?: ConfirmBoxButtonAction;
    variant?: string;
    dontShowAgainBox?: boolean;
    parentOverlayId?: string | undefined;
}

export type ConfirmBoxAction = ActionWithPayload<"CONFIRM_BOX", {
    attributes: ConfirmBoxAttributes;
}>;
export const confirmBox = (attributes: ConfirmBoxAttributes): ConfirmBoxAction =>
    actionWithPayload("CONFIRM_BOX", {attributes});

export type CloseConfirmBoxAction = ActionWithoutPayload<"CLOSE_CONFIRM_BOX">;
export const closeConfirmBox = (): CloseConfirmBoxAction =>
    actionWithoutPayload("CLOSE_CONFIRM_BOX");

export type ConfirmBoxAnyAction =
    ConfirmBoxAction
    | CloseConfirmBoxAction;
