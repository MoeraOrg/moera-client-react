import { actionWithPayload, ActionWithPayload } from "state/action-types";
import { ConnectPageForm } from "state/connectpage/state";

export type ConnectPageSetFormAction = ActionWithPayload<"CONNECT_PAGE_SET_FORM", {
    location: string;
    login: string;
    form: ConnectPageForm;
}>;
export const connectPageSetForm = (
    location: string, login: string, form: ConnectPageForm
): ConnectPageSetFormAction =>
    actionWithPayload("CONNECT_PAGE_SET_FORM", {location, login, form});

export type ConnectPageResetPasswordAction = ActionWithPayload<"CONNECT_PAGE_RESET_PASSWORD", {
    location: string;
}>;
export const connectPageResetPassword = (location: string): ConnectPageResetPasswordAction =>
    actionWithPayload("CONNECT_PAGE_RESET_PASSWORD", {location});

export type ConnectPageResetPasswordFailedAction = ActionWithPayload<"CONNECT_PAGE_RESET_PASSWORD_FAILED", {
    error: string;
}>;
export const connectPageResetPasswordFailed = (error: string): ConnectPageResetPasswordFailedAction =>
    actionWithPayload("CONNECT_PAGE_RESET_PASSWORD_FAILED", {error});

export type ConnectPageSetEmailHintAction = ActionWithPayload<"CONNECT_PAGE_SET_EMAIL_HINT", {
    emailHint: string;
}>;
export const connectPageSetEmailHint = (emailHint: string): ConnectPageSetEmailHintAction =>
    actionWithPayload("CONNECT_PAGE_SET_EMAIL_HINT", {emailHint});

export type ConnectPageVerifyCodeAction = ActionWithPayload<"CONNECT_PAGE_VERIFY_CODE", {
    location: string;
    resetToken: string;
}>;
export const connectPageVerifyCode = (location: string, resetToken: string): ConnectPageVerifyCodeAction =>
    actionWithPayload("CONNECT_PAGE_VERIFY_CODE", {location, resetToken});

export type ConnectPageVerifyCodeFailedAction = ActionWithPayload<"CONNECT_PAGE_VERIFY_CODE_FAILED", {
    error: string;
}>;
export const connectPageVerifyCodeFailed = (error: string): ConnectPageVerifyCodeFailedAction =>
    actionWithPayload("CONNECT_PAGE_VERIFY_CODE_FAILED", {error});

export type ConnectPageConnectAfterAction = ActionWithPayload<"CONNECT_PAGE_CONNECT_AFTER", {
    after: Date;
}>;
export const connectPageConnectAfter = (after: Date): ConnectPageConnectAfterAction =>
    actionWithPayload("CONNECT_PAGE_CONNECT_AFTER", {after});

export type ConnectPageMailAfterAction = ActionWithPayload<"CONNECT_PAGE_MAIL_AFTER", {
    after: Date;
}>;
export const connectPageMailAfter = (after: Date): ConnectPageMailAfterAction =>
    actionWithPayload("CONNECT_PAGE_MAIL_AFTER", {after});

export type ConnectPageAnyAction =
    ConnectPageSetFormAction
    | ConnectPageResetPasswordAction
    | ConnectPageResetPasswordFailedAction
    | ConnectPageSetEmailHintAction
    | ConnectPageVerifyCodeAction
    | ConnectPageVerifyCodeFailedAction
    | ConnectPageConnectAfterAction
    | ConnectPageMailAfterAction;
