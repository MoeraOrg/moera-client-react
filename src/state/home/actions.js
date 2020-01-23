export const CONNECT_TO_HOME = "CONNECT_TO_HOME";
export const connectToHome = (location, assign, login, password) => ({
    type: CONNECT_TO_HOME,
    payload: {location, assign, login, password}
});

export const CONNECTION_TO_HOME_FAILED = "CONNECTION_TO_HOME_FAILED";
export const connectionToHomeFailed = () => ({
    type: CONNECTION_TO_HOME_FAILED
});

export const CONNECTED_TO_HOME = "CONNECTED_TO_HOME";
export const connectedToHome = (location, login, token, permissions, cartes) => ({
    type: CONNECTED_TO_HOME,
    payload: {location, login, token, permissions, cartes}
});

export const DISCONNECT_FROM_HOME = "DISCONNECT_FROM_HOME";
export const disconnectFromHome = (location, login) => ({
    type: DISCONNECT_FROM_HOME,
    payload: {location, login}
});

export const HOME_RESTORE = "HOME_RESTORE";
export const homeRestore = (location, login, token, permissions, cartes) => ({
    type: HOME_RESTORE,
    payload: {location, login, token, permissions, cartes}
});

export const HOME_OWNER_VERIFY = "HOME_OWNER_VERIFY";
export const homeOwnerVerify = () => ({
    type: HOME_OWNER_VERIFY
});

export const HOME_OWNER_SET = "HOME_OWNER_SET";
export const homeOwnerSet = (name) => ({
    type: HOME_OWNER_SET,
    payload: {name}
});

export const HOME_OWNER_VERIFIED = "HOME_OWNER_VERIFIED";
export const homeOwnerVerified = (name, latest, correct) => ({
    type: HOME_OWNER_VERIFIED,
    payload: {name, latest, correct}
});
