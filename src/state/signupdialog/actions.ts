import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { SignUpStage } from "state/signupdialog/state";

export const SIGN_UP_STAGE_DOMAIN = 0 as const;
export const SIGN_UP_STAGE_PASSWORD = 1 as const;
export const SIGN_UP_STAGE_CONNECT = 2 as const;
export const SIGN_UP_STAGE_PROFILE = 3 as const;
export const SIGN_UP_STAGE_NAME = 4 as const;

export type OpenSignUpDialogAction = ActionWithoutPayload<"OPEN_SIGN_UP_DIALOG">;
export const openSignUpDialog = (): OpenSignUpDialogAction =>
    actionWithoutPayload("OPEN_SIGN_UP_DIALOG");

export type CancelSignUpDialogAction = ActionWithoutPayload<"CANCEL_SIGN_UP_DIALOG">;
export const cancelSignUpDialog = (): CancelSignUpDialogAction =>
    actionWithoutPayload("CANCEL_SIGN_UP_DIALOG");

type SignUpOnError = (fieldName: string, message: string) => void;
export type SignUpAction = ActionWithPayload<"SIGN_UP", {
    language: string;
    provider: string;
    name: string;
    domain: string | null;
    password: string;
    email: string | null;
    googlePlayAllowed: boolean;
    onError: SignUpOnError;
}>;
export const signUp = (
    language: string, provider: string, name: string, domain: string | null, password: string, email: string | null,
    googlePlayAllowed: boolean, onError: SignUpOnError
): SignUpAction =>
    actionWithPayload("SIGN_UP", {language, provider, name, domain, password, email, googlePlayAllowed, onError});

export type SignedUpAction = ActionWithoutPayload<"SIGNED_UP">;
export const signedUp = (): SignedUpAction =>
    actionWithoutPayload("SIGNED_UP");

export type SignUpFailedAction = ActionWithPayload<"SIGN_UP_FAILED", {
    stage: SignUpStage;
}>;
export const signUpFailed = (stage: SignUpStage): SignUpFailedAction =>
    actionWithPayload("SIGN_UP_FAILED", {stage});

type SignUpOnNameVerify = (name: string, free: boolean) => void;
export type SignUpNameVerifyAction = ActionWithPayload<"SIGN_UP_NAME_VERIFY", {
    name: string;
    onVerify: SignUpOnNameVerify;
}>;
export const signUpNameVerify = (name: string, onVerify: SignUpOnNameVerify): SignUpNameVerifyAction =>
    actionWithPayload("SIGN_UP_NAME_VERIFY", {name, onVerify});

type SignUpOnFoundDomain = (provide: string, name: string, domainName: string) => void;
export type SignUpFindDomainAction = ActionWithPayload<"SIGN_UP_FIND_DOMAIN", {
    provider: string;
    name: string;
    onFound: SignUpOnFoundDomain;
}>;
export const signUpFindDomain = (
    provider: string, name: string, onFound: SignUpOnFoundDomain
): SignUpFindDomainAction =>
    actionWithPayload("SIGN_UP_FIND_DOMAIN", {provider, name, onFound});

type SignUpOnDomainVerify = (name: string, free: boolean) => void;
export type SignUpDomainVerifyAction = ActionWithPayload<"SIGN_UP_DOMAIN_VERIFY", {
    provider: string;
    name: string;
    onVerify: SignUpOnDomainVerify;
}>;
export const signUpDomainVerify = (
    provider: string, name: string, onVerify: SignUpOnDomainVerify
): SignUpDomainVerifyAction =>
    actionWithPayload("SIGN_UP_DOMAIN_VERIFY", {provider, name, onVerify});

export type SignUpDialogAnyAction =
    OpenSignUpDialogAction
    | CancelSignUpDialogAction
    | SignUpAction
    | SignedUpAction
    | SignUpFailedAction
    | SignUpNameVerifyAction
    | SignUpFindDomainAction
    | SignUpDomainVerifyAction;
