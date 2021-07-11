import { ActionBase, ActionWithPayload } from "state/action-base";

export const ERROR_THROWN = "ERROR_THROWN";
type ErrorThrownAction = ActionWithPayload<typeof ERROR_THROWN, {
    e: Error
}>;
export const errorThrown = (e: Error): ErrorThrownAction => ({
    type: ERROR_THROWN,
    payload: {
        e
    }
});

export const ERROR_SHOW = "ERROR_SHOW";
type ErrorShowAction = ActionWithPayload<typeof ERROR_SHOW, {
    message: string;
    messageVerbose: string;
}>;
export const errorShow = (message: string, messageVerbose: string = ""): ErrorShowAction => ({
    type: ERROR_SHOW,
    payload: {
        message,
        messageVerbose
    }
});

export const ERROR_DISMISS = "ERROR_DISMISS";
type ErrorDismissAction = ActionBase<typeof ERROR_DISMISS>;
export const errorDismiss = (): ErrorDismissAction => ({
    type: ERROR_DISMISS
});

export const ERROR_AUTH_INVALID = "ERROR_AUTH_INVALID";
type ErrorAuthInvalidAction = ActionBase<typeof ERROR_AUTH_INVALID>;
export const errorAuthInvalid = (): ErrorAuthInvalidAction => ({
    type: ERROR_AUTH_INVALID
});

export type ErrorAnyAction =
    ErrorThrownAction
    | ErrorShowAction
    | ErrorDismissAction
    | ErrorAuthInvalidAction;
