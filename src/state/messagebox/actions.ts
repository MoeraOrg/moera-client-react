import { ActionBase } from "state/action-base";

export const MESSAGE_BOX = "MESSAGE_BOX";
type MessageBoxAction = ActionBase<typeof MESSAGE_BOX, {
    message: string;
    onClose: any;
}>;
export const messageBox = (message: string, onClose: any = null): MessageBoxAction => ({
    type: MESSAGE_BOX,
    payload: {message, onClose}
});

export const CLOSE_MESSAGE_BOX = "CLOSE_MESSAGE_BOX";
type CloseMessageBoxAction = ActionBase<typeof CLOSE_MESSAGE_BOX, never>;
export const closeMessageBox = (): CloseMessageBoxAction => ({
    type: CLOSE_MESSAGE_BOX
});

export type MessageBoxAnyAction =
    MessageBoxAction
    | CloseMessageBoxAction;
