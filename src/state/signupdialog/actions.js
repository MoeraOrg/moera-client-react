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
export const signUpFailed = () => ({
    type: SIGN_UP_FAILED
});
