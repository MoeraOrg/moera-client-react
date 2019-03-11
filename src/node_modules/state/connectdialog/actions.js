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
