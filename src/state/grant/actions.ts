import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";

export type GrantValidateAction = ActionWithoutPayload<"GRANT_VALIDATE">;
export const grantValidate = (): GrantValidateAction =>
    actionWithoutPayload("GRANT_VALIDATE");

export type GrantValidatedAction = ActionWithPayload<"GRANT_VALIDATED", {
    valid: boolean;
    error: string | null;
}>;
export const grantValidated = (valid: boolean, error: string | null): GrantValidatedAction =>
    actionWithPayload("GRANT_VALIDATED", {valid, error});

export type GrantConfirmAction = ActionWithoutPayload<"GRANT_CONFIRM">;
export const grantConfirm = (): GrantConfirmAction =>
    actionWithoutPayload("GRANT_CONFIRM");

export type GrantConfirmedAction = ActionWithoutPayload<"GRANT_CONFIRMED">;
export const grantConfirmed = (): GrantConfirmedAction =>
    actionWithoutPayload("GRANT_CONFIRMED");

export type GrantConfirmFailedAction = ActionWithoutPayload<"GRANT_CONFIRM_FAILED">;
export const grantConfirmFailed = (): GrantConfirmFailedAction =>
    actionWithoutPayload("GRANT_CONFIRM_FAILED");

export type GrantAnyAction =
    GrantValidateAction
    | GrantValidatedAction
    | GrantConfirmAction
    | GrantConfirmedAction
    | GrantConfirmFailedAction;
