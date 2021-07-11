import { ActionBase, ActionWithPayload } from "state/action-base";

export type SignUpStage = 0 | 1 | 2 | 3 | 4;

export const SIGN_UP_STAGE_DOMAIN = 0;
export const SIGN_UP_STAGE_PASSWORD = 1;
export const SIGN_UP_STAGE_CONNECT = 2;
export const SIGN_UP_STAGE_PROFILE = 3;
export const SIGN_UP_STAGE_NAME = 4;

export const OPEN_SIGN_UP_DIALOG = "OPEN_SIGN_UP_DIALOG";
type OpenSignUpDialogAction = ActionBase<typeof OPEN_SIGN_UP_DIALOG>;
export const openSignUpDialog = (): OpenSignUpDialogAction => ({
    type: OPEN_SIGN_UP_DIALOG
});

export const CANCEL_SIGN_UP_DIALOG = "CANCEL_SIGN_UP_DIALOG";
type CancelSignUpDialogAction = ActionBase<typeof CANCEL_SIGN_UP_DIALOG>;
export const cancelSignUpDialog = (): CancelSignUpDialogAction => ({
    type: CANCEL_SIGN_UP_DIALOG
});

export const SIGN_UP = "SIGN_UP";
type SignUpAction = ActionWithPayload<typeof SIGN_UP, {
    provider: string;
    name: string;
    domain: string;
    password: string;
    email: string | null;
    onError: any;
}>;
export const signUp = (provider: string, name: string, domain: string, password: string, email: string | null,
                       onError: any): SignUpAction => ({
    type: SIGN_UP,
    payload: {provider, name, domain, password, email, onError}
});

export const SIGNED_UP = "SIGNED_UP";
type SignedUpAction = ActionBase<typeof SIGNED_UP>;
export const signedUp = (): SignedUpAction => ({
    type: SIGNED_UP
});

export const SIGN_UP_FAILED = "SIGN_UP_FAILED";
type SignUpFailedAction = ActionWithPayload<typeof SIGN_UP_FAILED, {
    stage: SignUpStage;
}>;
export const signUpFailed = (stage: SignUpStage): SignUpFailedAction => ({
    type: SIGN_UP_FAILED,
    payload: {stage}
});

export const SIGN_UP_NAME_VERIFY = "SIGN_UP_NAME_VERIFY";
type SignUpNameVerifyAction = ActionWithPayload<typeof SIGN_UP_NAME_VERIFY, {
    name: string;
    onVerify: any;
}>;
export const signUpNameVerify = (name: string, onVerify: any): SignUpNameVerifyAction => ({
    type: SIGN_UP_NAME_VERIFY,
    payload: {name, onVerify}
});

export const SIGN_UP_FIND_DOMAIN = "SIGN_UP_FIND_DOMAIN";
type SignUpFindDomainAction = ActionWithPayload<typeof SIGN_UP_FIND_DOMAIN, {
    provider: string;
    name: string;
    onFound: any;
}>;
export const signUpFindDomain = (provider: string, name: string, onFound: any): SignUpFindDomainAction => ({
    type: SIGN_UP_FIND_DOMAIN,
    payload: {provider, name, onFound}
});

export const SIGN_UP_DOMAIN_VERIFY = "SIGN_UP_DOMAIN_VERIFY";
type SignUpDomainVerifyAction = ActionWithPayload<typeof SIGN_UP_DOMAIN_VERIFY, {
    provider: string;
    name: string;
    onVerify: any;
}>;
export const signUpDomainVerify = (provider: string, name: string, onVerify: any): SignUpDomainVerifyAction => ({
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
