export const OPEN_SOURCE_DIALOG = "OPEN_SOURCE_DIALOG";
export const openSourceDialog = (nodeName, postingId, commentId) => ({
    type: OPEN_SOURCE_DIALOG,
    payload: {nodeName, postingId, commentId}
});

export const CLOSE_SOURCE_DIALOG = "CLOSE_SOURCE_DIALOG";
export const closeSourceDialog = () => ({
    type: CLOSE_SOURCE_DIALOG
});

export const SOURCE_DIALOG_LOADED = "SOURCE_DIALOG_LOADED";
export const sourceDialogLoaded = (text) => ({
    type: SOURCE_DIALOG_LOADED,
    payload: {text}
});

export const SOURCE_DIALOG_LOAD_FAILED = "SOURCE_DIALOG_LOAD_FAILED";
export const sourceDialogLoadFailed = () => ({
    type: SOURCE_DIALOG_LOAD_FAILED
});
