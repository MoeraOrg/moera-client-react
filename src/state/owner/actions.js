export const OWNER_LOAD = "OWNER_LOAD";
export const ownerLoad = () => ({
    type: OWNER_LOAD
});

export const OWNER_SET = "OWNER_SET";
export const ownerSet = (name) => ({
    type: OWNER_SET,
    payload: {name}
});

export const OWNER_VERIFY = "OWNER_VERIFY";
export const ownerVerify = () => ({
    type: OWNER_VERIFY
});

export const OWNER_VERIFIED = "OWNER_VERIFIED";
export const ownerVerified = (name, correct, deadline) => ({
    type: OWNER_VERIFIED,
    payload: {name, correct, deadline}
});

export const OWNER_SWITCH_OPEN = "OWNER_SWITCH_OPEN";
export const ownerSwitchOpen = () => ({
    type: OWNER_SWITCH_OPEN
});

export const OWNER_SWITCH_CLOSE = "OWNER_SWITCH_CLOSE";
export const ownerSwitchClose = () => ({
    type: OWNER_SWITCH_CLOSE
});

export const OWNER_SWITCH = "OWNER_SWITCH";
export const ownerSwitch = (name) => ({
    type: OWNER_SWITCH,
    payload: {name}
});

export const OWNER_SWITCH_FAILED = "OWNER_SWITCH_FAILED";
export const ownerSwitchFailed = () => ({
    type: OWNER_SWITCH_FAILED
});
