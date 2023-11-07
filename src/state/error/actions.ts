import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type ErrorThrownAction = ActionWithPayload<"ERROR_THROWN", {
    e: any
}>;
export const errorThrown = (e: any): ErrorThrownAction =>
    actionWithPayload("ERROR_THROWN", {e});

export type ErrorShowAction = ActionWithPayload<"ERROR_SHOW", {
    message: string;
    messageVerbose: string | null;
}>;
export const errorShow = (message: string, messageVerbose: string | null = ""): ErrorShowAction =>
    actionWithPayload("ERROR_SHOW", {message, messageVerbose});

export type ErrorDismissAction = ActionWithoutPayload<"ERROR_DISMISS">;
export const errorDismiss = (): ErrorDismissAction =>
    actionWithoutPayload("ERROR_DISMISS");

export type ErrorAuthInvalidAction = ActionWithoutPayload<"ERROR_AUTH_INVALID">;
export const errorAuthInvalid = (): ErrorAuthInvalidAction =>
    actionWithoutPayload("ERROR_AUTH_INVALID");

export type ErrorAnyAction =
    ErrorThrownAction
    | ErrorShowAction
    | ErrorDismissAction
    | ErrorAuthInvalidAction;
