export const SHARE_DIALOG_PREPARE = "SHARE_DIALOG_PREPARE";
export const shareDialogPrepare = (title, nodeName, href) => ({
    type: SHARE_DIALOG_PREPARE,
    payload: {title, nodeName, href}
});

export const OPEN_SHARE_DIALOG = "OPEN_SHARE_DIALOG";
export const openShareDialog = (title, url) => ({
    type: OPEN_SHARE_DIALOG,
    payload: {title, url}
});

export const CLOSE_SHARE_DIALOG = "CLOSE_SHARE_DIALOG";
export const closeShareDialog = () => ({
    type: CLOSE_SHARE_DIALOG
});

export const SHARE_DIALOG_COPY_LINK = "SHARE_DIALOG_COPY_LINK";
export const shareDialogCopyLink = (url) => ({
    type: SHARE_DIALOG_COPY_LINK,
    payload: {url}
});
