export const CONNECT_TO_HOME = "CONNECT_TO_HOME";
export const connectToHome = (location, assign, login, password, oldPassword, resetToken) => ({
    type: CONNECT_TO_HOME,
    payload: {location, assign, login, password, oldPassword, resetToken}
});

export const CONNECTION_TO_HOME_FAILED = "CONNECTION_TO_HOME_FAILED";
export const connectionToHomeFailed = () => ({
    type: CONNECTION_TO_HOME_FAILED
});

export const CONNECTED_TO_HOME = "CONNECTED_TO_HOME";
export const connectedToHome = (location, login, token, permissions, cartesIp, cartes, roots, clockOffset) => ({
    type: CONNECTED_TO_HOME,
    payload: {location, login, token, permissions, cartesIp, cartes, roots, clockOffset}
});

export const DISCONNECT_FROM_HOME = "DISCONNECT_FROM_HOME";
export const disconnectFromHome = (location, login) => ({
    type: DISCONNECT_FROM_HOME,
    payload: {location, login}
});

export const DISCONNECTED_FROM_HOME = "DISCONNECTED_FROM_HOME";
export const disconnectedFromHome = (location, login) => ({
    type: DISCONNECTED_FROM_HOME,
    payload: {location, login}
});

export const HOME_RESTORE = "HOME_RESTORE";
export const homeRestore = (addonApiVersion, location, login, token, permissions, cartesIp, cartes, roots) => ({
    type: HOME_RESTORE,
    payload: {addonApiVersion, location, login, token, permissions, cartesIp, cartes, roots}
});

export const HOME_OWNER_VERIFY = "HOME_OWNER_VERIFY";
export const homeOwnerVerify = () => ({
    type: HOME_OWNER_VERIFY
});

export const HOME_OWNER_SET = "HOME_OWNER_SET";
export const homeOwnerSet = (name, changing, fullName, avatar) => ({
    type: HOME_OWNER_SET,
    payload: {name, changing, fullName, avatar}
});

export const HOME_OWNER_VERIFIED = "HOME_OWNER_VERIFIED";
export const homeOwnerVerified = (name, correct) => ({
    type: HOME_OWNER_VERIFIED,
    payload: {name, correct}
});

export const BROWSER_API_SET = "BROWSER_API_SET";
export const browserApiSet = (version) => ({
    type: BROWSER_API_SET,
    payload: {version}
});

export const CONNECTIONS_SET = "CONNECTIONS_SET";
export const connectionsSet = (roots) => ({
    type: CONNECTIONS_SET,
    payload: {roots}
});

export const HOME_AVATARS_LOAD = "HOME_AVATARS_LOAD";
export const homeAvatarsLoad = () => ({
    type: HOME_AVATARS_LOAD
});

export const HOME_AVATARS_LOADED = "HOME_AVATARS_LOADED";
export const homeAvatarsLoaded = (avatars) => ({
    type: HOME_AVATARS_LOADED,
    payload: {avatars}
});

export const HOME_AVATARS_LOAD_FAILED = "HOME_AVATARS_LOAD_FAILED";
export const homeAvatarsLoadFailed = () => ({
    type: HOME_AVATARS_LOAD_FAILED
});
