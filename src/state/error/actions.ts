import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";

export const ERROR_THROWN = "ERROR_THROWN";
export type ErrorThrownAction = ActionWithPayload<typeof ERROR_THROWN, {
    e: any
}>;
export const errorThrown = (e: any): ErrorThrownAction => ({
    type: ERROR_THROWN,
    payload: {
        e
    }
});

export const ERROR_SHOW = "ERROR_SHOW";
export type ErrorShowAction = ActionWithPayload<typeof ERROR_SHOW, {
    message: string;
    messageVerbose: string | null;
}>;
export const errorShow = (message: string, messageVerbose: string | null = ""): ErrorShowAction => ({
    type: ERROR_SHOW,
    payload: {
        message,
        messageVerbose
    }
});

export const ERROR_DISMISS = "ERROR_DISMISS";
export type ErrorDismissAction = Action<typeof ERROR_DISMISS>;
export const errorDismiss = (): ErrorDismissAction => ({
    type: ERROR_DISMISS
});

export const ERROR_AUTH_INVALID = "ERROR_AUTH_INVALID";
export type ErrorAuthInvalidAction = Action<typeof ERROR_AUTH_INVALID>;
export const errorAuthInvalid = (): ErrorAuthInvalidAction => ({
    type: ERROR_AUTH_INVALID
});

export type ErrorAnyAction =
    ErrorThrownAction
    | ErrorShowAction
    | ErrorDismissAction
    | ErrorAuthInvalidAction;
