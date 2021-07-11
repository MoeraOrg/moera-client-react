import { ActionBase, ActionWithPayload } from "state/action-base";
import { AvatarImage, CarteInfo } from "api/node/api-types";

export const CONNECT_TO_HOME = "CONNECT_TO_HOME";
type ConnectToHomeAction = ActionWithPayload<typeof CONNECT_TO_HOME, {
    location: string;
    assign: boolean;
    login: string;
    password: string;
    oldPassword: string | null;
    resetToken: string | null;
}>;
export const connectToHome = (location: string, assign: boolean, login: string, password: string,
                              oldPassword: string | null = null,
                              resetToken: string | null = null): ConnectToHomeAction => ({
    type: CONNECT_TO_HOME,
    payload: {location, assign, login, password, oldPassword, resetToken}
});

export const CONNECTION_TO_HOME_FAILED = "CONNECTION_TO_HOME_FAILED";
type ConnectionToHomeFailedAction = ActionBase<typeof CONNECTION_TO_HOME_FAILED>;
export const connectionToHomeFailed = (): ConnectionToHomeFailedAction => ({
    type: CONNECTION_TO_HOME_FAILED
});

export const CONNECTED_TO_HOME = "CONNECTED_TO_HOME";
type ConnectedToHomeAction = ActionWithPayload<typeof CONNECTED_TO_HOME, {
    location: string;
    login: string;
    token: string;
    permissions: string[];
    cartesIp: string;
    cartes: CarteInfo[];
    roots: string[] | null;
    clockOffset: number;
}>;
export const connectedToHome = (location: string, login: string, token: string, permissions: string[], cartesIp: string,
                                cartes: CarteInfo[], roots: string[] | null,
                                clockOffset: number): ConnectedToHomeAction => ({
    type: CONNECTED_TO_HOME,
    payload: {location, login, token, permissions, cartesIp, cartes, roots, clockOffset}
});

export const DISCONNECT_FROM_HOME = "DISCONNECT_FROM_HOME";
type DisconnectFromHomeAction = ActionWithPayload<typeof DISCONNECT_FROM_HOME, {
    location: string;
    login: string;
}>;
export const disconnectFromHome = (location: string, login: string): DisconnectFromHomeAction => ({
    type: DISCONNECT_FROM_HOME,
    payload: {location, login}
});

export const DISCONNECTED_FROM_HOME = "DISCONNECTED_FROM_HOME";
type DisconnectedFromHomeAction = ActionWithPayload<typeof DISCONNECTED_FROM_HOME, {
    location: string;
    login: string;
}>;
export const disconnectedFromHome = (location: string, login: string): DisconnectedFromHomeAction => ({
    type: DISCONNECTED_FROM_HOME,
    payload: {location, login}
});

export const HOME_RESTORE = "HOME_RESTORE";
type HomeRestoreAction = ActionWithPayload<typeof HOME_RESTORE, {
    addonApiVersion: number;
    location: string;
    login: string;
    token: string;
    permissions: string[];
    cartesIp: string;
    cartes: CarteInfo[];
    roots: string[] | null;
}>;
export const homeRestore = (addonApiVersion: number, location: string, login: string, token: string,
                            permissions: string[], cartesIp: string, cartes: CarteInfo[],
                            roots: string[] | null): HomeRestoreAction => ({
    type: HOME_RESTORE,
    payload: {addonApiVersion, location, login, token, permissions, cartesIp, cartes, roots}
});

export const HOME_OWNER_VERIFY = "HOME_OWNER_VERIFY";
type HomeOwnerVerifyAction = ActionBase<typeof HOME_OWNER_VERIFY>;
export const homeOwnerVerify = (): HomeOwnerVerifyAction => ({
    type: HOME_OWNER_VERIFY
});

export const HOME_OWNER_SET = "HOME_OWNER_SET";
type HomeOwnerSetAction = ActionWithPayload<typeof HOME_OWNER_SET, {
    name: string;
    changing: boolean;
    fullName: string | null;
    avatar: AvatarImage | null;
}>;
export const homeOwnerSet = (name: string, changing: boolean, fullName: string | null,
                             avatar: AvatarImage | null): HomeOwnerSetAction => ({
    type: HOME_OWNER_SET,
    payload: {name, changing, fullName, avatar}
});

export const HOME_OWNER_VERIFIED = "HOME_OWNER_VERIFIED";
type HomeOwnerVerifiedAction = ActionWithPayload<typeof HOME_OWNER_VERIFIED, {
    name: string;
    correct: boolean;
}>;
export const homeOwnerVerified = (name: string, correct: boolean): HomeOwnerVerifiedAction => ({
    type: HOME_OWNER_VERIFIED,
    payload: {name, correct}
});

export const BROWSER_API_SET = "BROWSER_API_SET";
type BrowserApiSetAction = ActionWithPayload<typeof BROWSER_API_SET, {
    version: number;
}>;
export const browserApiSet = (version: number): BrowserApiSetAction => ({
    type: BROWSER_API_SET,
    payload: {version}
});

export const CONNECTIONS_SET = "CONNECTIONS_SET";
type ConnectionsSetAction = ActionWithPayload<typeof CONNECTIONS_SET, {
    roots: string[];
}>;
export const connectionsSet = (roots: string[]): ConnectionsSetAction => ({
    type: CONNECTIONS_SET,
    payload: {roots}
});

export const HOME_AVATARS_LOAD = "HOME_AVATARS_LOAD";
type HomeAvatarsLoadAction = ActionBase<typeof HOME_AVATARS_LOAD>;
export const homeAvatarsLoad = (): HomeAvatarsLoadAction => ({
    type: HOME_AVATARS_LOAD
});

export const HOME_AVATARS_LOADED = "HOME_AVATARS_LOADED";
type HomeAvatarsLoadedAction = ActionWithPayload<typeof HOME_AVATARS_LOADED, {
    avatars: AvatarImage[];
}>;
export const homeAvatarsLoaded = (avatars: AvatarImage[]): HomeAvatarsLoadedAction => ({
    type: HOME_AVATARS_LOADED,
    payload: {avatars}
});

export const HOME_AVATARS_LOAD_FAILED = "HOME_AVATARS_LOAD_FAILED";
type HomeAvatarsLoadFailedAction = ActionBase<typeof HOME_AVATARS_LOAD_FAILED>;
export const homeAvatarsLoadFailed = (): HomeAvatarsLoadFailedAction => ({
    type: HOME_AVATARS_LOAD_FAILED
});

export type HomeAnyAction =
    ConnectToHomeAction
    | ConnectionToHomeFailedAction
    | ConnectedToHomeAction
    | DisconnectFromHomeAction
    | DisconnectedFromHomeAction
    | HomeRestoreAction
    | HomeOwnerVerifyAction
    | HomeOwnerSetAction
    | HomeOwnerVerifiedAction
    | BrowserApiSetAction
    | ConnectionsSetAction
    | HomeAvatarsLoadAction
    | HomeAvatarsLoadedAction
    | HomeAvatarsLoadFailedAction;
