import { actionWithPayload, ActionWithPayload } from "state/action-types";
import { ConnectDialogForm } from "state/connectdialog/state";

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

export type ConnectDialogResetPasswordFailedAction = ActionWithPayload<"CONNECT_DIALOG_RESET_PASSWORD_FAILED", {
    error: string;
}>;
export const connectDialogResetPasswordFailed = (error: string): ConnectDialogResetPasswordFailedAction =>
    actionWithPayload("CONNECT_DIALOG_RESET_PASSWORD_FAILED", {error});

export type ConnectDialogSetEmailHintAction = ActionWithPayload<"CONNECT_DIALOG_SET_EMAIL_HINT", {
    emailHint: string;
}>;
export const connectDialogSetEmailHint = (emailHint: string): ConnectDialogSetEmailHintAction =>
    actionWithPayload("CONNECT_DIALOG_SET_EMAIL_HINT", {emailHint});

export type ConnectDialogVerifyCodeAction = ActionWithPayload<"CONNECT_DIALOG_VERIFY_CODE", {
    location: string;
    resetToken: string;
}>;
export const connectDialogVerifyCode = (location: string, resetToken: string): ConnectDialogVerifyCodeAction =>
    actionWithPayload("CONNECT_DIALOG_VERIFY_CODE", {location, resetToken});

export type ConnectDialogVerifyCodeFailedAction = ActionWithPayload<"CONNECT_DIALOG_VERIFY_CODE_FAILED", {
    error: string;
}>;
export const connectDialogVerifyCodeFailed = (error: string): ConnectDialogVerifyCodeFailedAction =>
    actionWithPayload("CONNECT_DIALOG_VERIFY_CODE_FAILED", {error});

export type ConnectDialogConnectAfterAction = ActionWithPayload<"CONNECT_DIALOG_CONNECT_AFTER", {
    after: Date;
}>;
export const connectDialogConnectAfter = (after: Date): ConnectDialogConnectAfterAction =>
    actionWithPayload("CONNECT_DIALOG_CONNECT_AFTER", {after});

export type ConnectDialogMailAfterAction = ActionWithPayload<"CONNECT_DIALOG_MAIL_AFTER", {
    after: Date;
}>;
export const connectDialogMailAfter = (after: Date): ConnectDialogMailAfterAction =>
    actionWithPayload("CONNECT_DIALOG_MAIL_AFTER", {after});

export type ConnectDialogAnyAction =
    ConnectDialogSetFormAction
    | ConnectDialogResetPasswordAction
    | ConnectDialogResetPasswordFailedAction
    | ConnectDialogSetEmailHintAction
    | ConnectDialogVerifyCodeAction
    | ConnectDialogVerifyCodeFailedAction
    | ConnectDialogConnectAfterAction
    | ConnectDialogMailAfterAction;
