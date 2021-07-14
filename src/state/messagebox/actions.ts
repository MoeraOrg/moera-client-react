import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";

export const MESSAGE_BOX = "MESSAGE_BOX";
export type MessageBoxAction = ActionWithPayload<typeof MESSAGE_BOX, {
    message: string;
    onClose: any;
}>;
export const messageBox = (message: string, onClose: any = null): MessageBoxAction => ({
    type: MESSAGE_BOX,
    payload: {message, onClose}
});

export const CLOSE_MESSAGE_BOX = "CLOSE_MESSAGE_BOX";
export type CloseMessageBoxAction = Action<typeof CLOSE_MESSAGE_BOX>;
export const closeMessageBox = (): CloseMessageBoxAction => ({
    type: CLOSE_MESSAGE_BOX
});

export type MessageBoxAnyAction =
    MessageBoxAction
    | CloseMessageBoxAction;
