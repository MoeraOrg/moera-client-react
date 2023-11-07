import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type MessageBoxAction = ActionWithPayload<"MESSAGE_BOX", {
    message: string;
    onClose: any;
}>;
export const messageBox = (message: string, onClose: any = null): MessageBoxAction =>
    actionWithPayload("MESSAGE_BOX", {message, onClose});

export type CloseMessageBoxAction = ActionWithoutPayload<"CLOSE_MESSAGE_BOX">;
export const closeMessageBox = (): CloseMessageBoxAction =>
    actionWithoutPayload("CLOSE_MESSAGE_BOX");

export type MessageBoxAnyAction =
    MessageBoxAction
    | CloseMessageBoxAction;
