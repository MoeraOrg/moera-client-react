import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { ConnectDialogForm } from "state/connectdialog/state";

export type OpenConnectDialogAction = ActionWithoutPayload<"OPEN_CONNECT_DIALOG">;
export const openConnectDialog = (): OpenConnectDialogAction =>
    actionWithoutPayload("OPEN_CONNECT_DIALOG");

export type CancelConnectDialogAction = ActionWithoutPayload<"CANCEL_CONNECT_DIALOG">;
export const cancelConnectDialog = (): CancelConnectDialogAction =>
    actionWithoutPayload("CANCEL_CONNECT_DIALOG");

export type ConnectDialogSetFormAction = ActionWithPayload<"CONNECT_DIALOG_SET_FORM", {
    location: string;
    login: string;
    form: ConnectDialogForm;
}>;
export const connectDialogSetForm = (
    location: string, login: string, form: ConnectDialogForm
): ConnectDialogSetFormAction =>
    actionWithPayload("CONNECT_DIALOG_SET_FORM", {location, login, form});

export type ConnectDialogResetPasswordAction = ActionWithPayload<"CONNECT_DIALOG_RESET_PASSWORD", {
    location: string;
}>;
export const connectDialogResetPassword = (location: string): ConnectDialogResetPasswordAction =>
    actionWithPayload("CONNECT_DIALOG_RESET_PASSWORD", {location});

export type ConnectDialogResetPasswordFailedAction = ActionWithoutPayload<"CONNECT_DIALOG_RESET_PASSWORD_FAILED">;
export const connectDialogResetPasswordFailed = (): ConnectDialogResetPasswordFailedAction =>
    actionWithoutPayload("CONNECT_DIALOG_RESET_PASSWORD_FAILED");

export type ConnectDialogSetEmailHintAction = ActionWithPayload<"CONNECT_DIALOG_SET_EMAIL_HINT", {
    emailHint: string;
}>;
export const connectDialogSetEmailHint = (emailHint: string): ConnectDialogSetEmailHintAction =>
    actionWithPayload("CONNECT_DIALOG_SET_EMAIL_HINT", {emailHint});

export type ConnectDialogAnyAction =
    OpenConnectDialogAction
    | CancelConnectDialogAction
    | ConnectDialogSetFormAction
    | ConnectDialogResetPasswordAction
    | ConnectDialogResetPasswordFailedAction
    | ConnectDialogSetEmailHintAction;
