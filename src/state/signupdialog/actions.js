export const SIGN_UP_STAGE_DOMAIN = 0;
export const SIGN_UP_STAGE_PASSWORD = 1;
export const SIGN_UP_STAGE_CONNECT = 2;
export const SIGN_UP_STAGE_NAME = 3;

export const OPEN_SIGN_UP_DIALOG = "OPEN_SIGN_UP_DIALOG";
export const openSignUpDialog = () => ({
    type: OPEN_SIGN_UP_DIALOG
});

export const CANCEL_SIGN_UP_DIALOG = "CANCEL_SIGN_UP_DIALOG";
export const cancelSignUpDialog = () => ({
    type: CANCEL_SIGN_UP_DIALOG
});

export const SIGN_UP = "SIGN_UP";
export const signUp = (name, domain, password, onError) => ({
    type: SIGN_UP,
    payload: {name, domain, password, onError}
});

export const SIGNED_UP = "SIGNED_UP";
export const signedUp = () => ({
    type: SIGNED_UP
});

export const SIGN_UP_FAILED = "SIGN_UP_FAILED";
export const signUpFailed = (stage) => ({
    type: SIGN_UP_FAILED,
    payload: {stage}
});

export const SIGN_UP_NAME_VERIFY = "SIGN_UP_NAME_VERIFY";
export const signUpNameVerify = (name, onVerify) => ({
    type: SIGN_UP_NAME_VERIFY,
    payload: {name, onVerify}
});
