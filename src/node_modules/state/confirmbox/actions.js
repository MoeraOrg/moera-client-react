export const CONFIRM_BOX = "CONFIRM_BOX";
export const confirmBox = (message, yes = "Yes", no = "No", onYes = null, onNo = null, variant = "primary") => ({
    type: CONFIRM_BOX,
    payload: {message, yes, no, onYes, onNo, variant}
});

export const CLOSE_CONFIRM_BOX = "CLOSE_CONFIRM_BOX";
export const closeConfirmBox = () => ({
    type: CLOSE_CONFIRM_BOX
});
