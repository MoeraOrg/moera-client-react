export const OPEN_CONNECT_DIALOG = "OPEN_CONNECT_DIALOG";
export const openConnectDialog = () => ({
    type: OPEN_CONNECT_DIALOG
});

export const CANCEL_CONNECT_DIALOG = "CANCEL_CONNECT_DIALOG";
export const cancelConnectDialog = () => ({
    type: CANCEL_CONNECT_DIALOG
});

export const RESTORE_CONNECT_DIALOG = "RESTORE_CONNECT_DIALOG";
export const restoreConnectDialog = (location, login) => ({
    type: RESTORE_CONNECT_DIALOG,
    payload: {location, login}
});

export const CONNECT_DIALOG_SET_FORM = "CONNECT_DIALOG_SET_FORM";
export const connectDialogSetForm = (location, login, form) => ({
    type: CONNECT_DIALOG_SET_FORM,
    payload: {location, login, form}
});

export const CONNECT_DIALOG_RESET_PASSWORD = "CONNECT_DIALOG_RESET_PASSWORD";
export const connectDialogResetPassword = (location) => ({
    type: CONNECT_DIALOG_RESET_PASSWORD,
    payload: {location}
});

export const CONNECT_DIALOG_RESET_PASSWORD_FAILED = "CONNECT_DIALOG_RESET_PASSWORD_FAILED";
export const connectDialogResetPasswordFailed = () => ({
    type: CONNECT_DIALOG_RESET_PASSWORD_FAILED
});
