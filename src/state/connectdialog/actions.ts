import { ActionWithPayload } from "state/action-base";
import { Action } from "redux";

export type ConnectDialogForm = "connect" | "assign" | "forgot" | "reset";

export const OPEN_CONNECT_DIALOG = "OPEN_CONNECT_DIALOG";
type OpenConnectDialogAction = Action<typeof OPEN_CONNECT_DIALOG>;
export const openConnectDialog = (): OpenConnectDialogAction => ({
    type: OPEN_CONNECT_DIALOG
});

export const CANCEL_CONNECT_DIALOG = "CANCEL_CONNECT_DIALOG";
type CancelConnectDialogAction = Action<typeof CANCEL_CONNECT_DIALOG>;
export const cancelConnectDialog = (): CancelConnectDialogAction => ({
    type: CANCEL_CONNECT_DIALOG
});

export const RESTORE_CONNECT_DIALOG = "RESTORE_CONNECT_DIALOG";
type RestoreConnectDialogAction = ActionWithPayload<typeof RESTORE_CONNECT_DIALOG, {
    location: string;
    login: string;
}>;
export const restoreConnectDialog = (location: string, login: string): RestoreConnectDialogAction => ({
    type: RESTORE_CONNECT_DIALOG,
    payload: {location, login}
});

export const CONNECT_DIALOG_SET_FORM = "CONNECT_DIALOG_SET_FORM";
type ConnectDialogSetFormAction = ActionWithPayload<typeof CONNECT_DIALOG_SET_FORM, {
    location: string;
    login: string;
    form: ConnectDialogForm;
}>;
export const connectDialogSetForm = (location: string, login: string,
                                     form: ConnectDialogForm): ConnectDialogSetFormAction => ({
    type: CONNECT_DIALOG_SET_FORM,
    payload: {location, login, form}
});

export const CONNECT_DIALOG_RESET_PASSWORD = "CONNECT_DIALOG_RESET_PASSWORD";
type ConnectDialogResetPasswordAction = ActionWithPayload<typeof CONNECT_DIALOG_RESET_PASSWORD, {
    location: string;
}>;
export const connectDialogResetPassword = (location: string): ConnectDialogResetPasswordAction => ({
    type: CONNECT_DIALOG_RESET_PASSWORD,
    payload: {location}
});

export const CONNECT_DIALOG_RESET_PASSWORD_FAILED = "CONNECT_DIALOG_RESET_PASSWORD_FAILED";
type ConnectDialogResetPasswordFailedAction = Action<typeof CONNECT_DIALOG_RESET_PASSWORD_FAILED>;
export const connectDialogResetPasswordFailed = (): ConnectDialogResetPasswordFailedAction => ({
    type: CONNECT_DIALOG_RESET_PASSWORD_FAILED
});

export const CONNECT_DIALOG_SET_EMAIL_HINT = "CONNECT_DIALOG_SET_EMAIL_HINT";
type ConnectDialogSetEmailHintAction = ActionWithPayload<typeof CONNECT_DIALOG_SET_EMAIL_HINT, {
    emailHint: string;
}>;
export const connectDialogSetEmailHint = (emailHint: string): ConnectDialogSetEmailHintAction => ({
    type: CONNECT_DIALOG_SET_EMAIL_HINT,
    payload: {emailHint}
});

export type ConnectDialogAnyAction =
    OpenConnectDialogAction
    | CancelConnectDialogAction
    | RestoreConnectDialogAction
    | ConnectDialogSetFormAction
    | ConnectDialogResetPasswordAction
    | ConnectDialogResetPasswordFailedAction
    | ConnectDialogSetEmailHintAction;
