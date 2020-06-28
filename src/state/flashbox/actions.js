export const FLASH_BOX = "FLASH_BOX";
export const flashBox = (message) => ({
    type: FLASH_BOX,
    payload: {message}
});

export const FLASH_BOX_DISMISS = "FLASH_BOX_DISMISS";
export const flashBoxDismiss = () => ({
    type: FLASH_BOX_DISMISS
});

export const FLASH_BOX_CLOSE = "FLASH_BOX_CLOSE";
export const flashBoxClose = () => ({
    type: FLASH_BOX_CLOSE
});
