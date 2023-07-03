import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { SignUpStage } from "state/signupdialog/state";

export const SIGN_UP_STAGE_DOMAIN = 0 as const;
export const SIGN_UP_STAGE_PASSWORD = 1 as const;
export const SIGN_UP_STAGE_CONNECT = 2 as const;
export const SIGN_UP_STAGE_PROFILE = 3 as const;
export const SIGN_UP_STAGE_NAME = 4 as const;

export const OPEN_SIGN_UP_DIALOG = "OPEN_SIGN_UP_DIALOG";
export type OpenSignUpDialogAction = Action<typeof OPEN_SIGN_UP_DIALOG>;
export const openSignUpDialog = (): OpenSignUpDialogAction => ({
    type: OPEN_SIGN_UP_DIALOG
});

export const CANCEL_SIGN_UP_DIALOG = "CANCEL_SIGN_UP_DIALOG";
export type CancelSignUpDialogAction = Action<typeof CANCEL_SIGN_UP_DIALOG>;
export const cancelSignUpDialog = (): CancelSignUpDialogAction => ({
    type: CANCEL_SIGN_UP_DIALOG
});

export const SIGN_UP = "SIGN_UP";
type SignUpOnError = (fieldName: string, message: string) => void;
export type SignUpAction = ActionWithPayload<typeof SIGN_UP, {
    language: string;
    provider: string;
    name: string;
    domain: string | null;
    password: string;
    email: string | null;
    googlePlayAllowed: boolean;
    onError: SignUpOnError;
}>;
export const signUp = (language: string, provider: string, name: string, domain: string | null, password: string,
                       email: string | null, googlePlayAllowed: boolean, onError: SignUpOnError): SignUpAction => ({
    type: SIGN_UP,
    payload: {language, provider, name, domain, password, email, googlePlayAllowed, onError}
});

export const SIGNED_UP = "SIGNED_UP";
export type SignedUpAction = Action<typeof SIGNED_UP>;
export const signedUp = (): SignedUpAction => ({
    type: SIGNED_UP
});

export const SIGN_UP_FAILED = "SIGN_UP_FAILED";
export type SignUpFailedAction = ActionWithPayload<typeof SIGN_UP_FAILED, {
    stage: SignUpStage;
}>;
export const signUpFailed = (stage: SignUpStage): SignUpFailedAction => ({
    type: SIGN_UP_FAILED,
    payload: {stage}
});

export const SIGN_UP_NAME_VERIFY = "SIGN_UP_NAME_VERIFY";
type SignUpOnNameVerify = (name: string, free: boolean) => void;
export type SignUpNameVerifyAction = ActionWithPayload<typeof SIGN_UP_NAME_VERIFY, {
    name: string;
    onVerify: SignUpOnNameVerify;
}>;
export const signUpNameVerify = (name: string, onVerify: SignUpOnNameVerify): SignUpNameVerifyAction => ({
    type: SIGN_UP_NAME_VERIFY,
    payload: {name, onVerify}
});

export const SIGN_UP_FIND_DOMAIN = "SIGN_UP_FIND_DOMAIN";
type SignUpOnFoundDomain = (provide: string, name: string, domainName: string) => void;
export type SignUpFindDomainAction = ActionWithPayload<typeof SIGN_UP_FIND_DOMAIN, {
    provider: string;
    name: string;
    onFound: SignUpOnFoundDomain;
}>;
export const signUpFindDomain = (provider: string, name: string,
                                 onFound: SignUpOnFoundDomain): SignUpFindDomainAction => ({
    type: SIGN_UP_FIND_DOMAIN,
    payload: {provider, name, onFound}
});

export const SIGN_UP_DOMAIN_VERIFY = "SIGN_UP_DOMAIN_VERIFY";
type SignUpOnDomainVerify = (name: string, free: boolean) => void;
export type SignUpDomainVerifyAction = ActionWithPayload<typeof SIGN_UP_DOMAIN_VERIFY, {
    provider: string;
    name: string;
    onVerify: SignUpOnDomainVerify;
}>;
export const signUpDomainVerify = (provider: string, name: string,
                                   onVerify: SignUpOnDomainVerify): SignUpDomainVerifyAction => ({
    type: SIGN_UP_DOMAIN_VERIFY,
    payload: {provider, name, onVerify}
});

export type SignUpDialogAnyAction =
    OpenSignUpDialogAction
    | CancelSignUpDialogAction
    | SignUpAction
    | SignedUpAction
    | SignUpFailedAction
    | SignUpNameVerifyAction
    | SignUpFindDomainAction
    | SignUpDomainVerifyAction;
