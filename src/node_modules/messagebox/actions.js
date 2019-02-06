export const MESSAGE_BOX = "MESSAGE_BOX";
export const messageBox = (message, onClose = null) => ({
    type: MESSAGE_BOX,
    payload: {message, onClose}
});

export const CLOSE_MESSAGE_BOX = "CLOSE_MESSAGE_BOX";
export const closeMessageBox = () => ({
    type: CLOSE_MESSAGE_BOX
});
