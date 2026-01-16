import { actionWithPayload, ActionWithPayload } from "state/action-types";
import { SignUpMode, SignUpStage } from "state/signup/state";

export const SIGN_UP_STAGE_CHECK_NAME = 0 as const;
export const SIGN_UP_STAGE_DOMAIN = 1 as const;
export const SIGN_UP_STAGE_PASSWORD = 2 as const;
export const SIGN_UP_STAGE_CONNECT = 3 as const;
export const SIGN_UP_STAGE_PROFILE = 4 as const;
export const SIGN_UP_STAGE_NAME = 5 as const;

type SignUpOnError = (fieldName: string, message: string) => void;
export type SignUpAction = ActionWithPayload<"SIGN_UP", {
    mode: SignUpMode;
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
    mode: SignUpMode, language: string, provider: string, name: string, domain: string | null, password: string,
    email: string | null, googlePlayAllowed: boolean, onError: SignUpOnError
): SignUpAction =>
    actionWithPayload("SIGN_UP", {mode, language, provider, name, domain, password, email, googlePlayAllowed, onError});

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

export type SignUpDomainRegisteredAction = ActionWithPayload<"SIGN_UP_DOMAIN_REGISTERED", {
    domainName: string;
}>;
export const signUpDomainRegistered = (domainName: string): SignUpDomainRegisteredAction =>
    actionWithPayload("SIGN_UP_DOMAIN_REGISTERED", {domainName});

export type SignUpAnyAction =
    SignUpAction
    | SignUpFailedAction
    | SignUpNameVerifyAction
    | SignUpFindDomainAction
    | SignUpDomainVerifyAction
    | SignUpDomainRegisteredAction;
