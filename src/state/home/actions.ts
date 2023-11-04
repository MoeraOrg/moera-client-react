import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { AvatarImage, AvatarInfo, BlockedUserInfo, CarteInfo, FriendGroupInfo } from "api";
import { RootInfo } from "storage";

export const CONNECT_TO_HOME = "CONNECT_TO_HOME";
export type ConnectToHomeAction = ActionWithPayload<typeof CONNECT_TO_HOME, {
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
export type ConnectionToHomeFailedAction = Action<typeof CONNECTION_TO_HOME_FAILED>;
export const connectionToHomeFailed = (): ConnectionToHomeFailedAction => ({
    type: CONNECTION_TO_HOME_FAILED
});

export const CONNECTED_TO_HOME = "CONNECTED_TO_HOME";
export type ConnectedToHomeAction = ActionWithPayload<typeof CONNECTED_TO_HOME, {
    location: string;
    login: string | null;
    token: string;
    permissions: string[];
    cartesIp: string | null;
    cartes: CarteInfo[] | null;
    roots: RootInfo[] | null;
    clockOffset: number | null;
    connectionSwitch: boolean;
}>;
export const connectedToHome = (location: string, login: string | null, token: string, permissions: string[],
                                cartesIp: string | null, cartes: CarteInfo[] | null, roots: RootInfo[] | null,
                                clockOffset: number | null, connectionSwitch: boolean): ConnectedToHomeAction => ({
    type: CONNECTED_TO_HOME,
    payload: {location, login, token, permissions, cartesIp, cartes, roots, clockOffset, connectionSwitch}
});

export const DISCONNECT_FROM_HOME = "DISCONNECT_FROM_HOME";
export type DisconnectFromHomeAction = ActionWithPayload<typeof DISCONNECT_FROM_HOME, {
    location: string;
    login: string | null;
}>;
export const disconnectFromHome = (location: string, login: string | null): DisconnectFromHomeAction => ({
    type: DISCONNECT_FROM_HOME,
    payload: {location, login}
});

export const DISCONNECTED_FROM_HOME = "DISCONNECTED_FROM_HOME";
export type DisconnectedFromHomeAction = ActionWithPayload<typeof DISCONNECTED_FROM_HOME, {
    location: string;
    login: string | null;
}>;
export const disconnectedFromHome = (location: string, login: string | null): DisconnectedFromHomeAction => ({
    type: DISCONNECTED_FROM_HOME,
    payload: {location, login}
});

export const HOME_RESTORE = "HOME_RESTORE";
export type HomeRestoreAction = ActionWithPayload<typeof HOME_RESTORE, {
    location: string;
    login: string | null;
    token: string | null;
    permissions: string[];
    cartesIp: string | null;
    cartes: CarteInfo[] | null;
    roots: RootInfo[] | null;
}>;
export const homeRestore = (location: string, login: string | null, token: string | null, permissions: string[],
                            cartesIp: string | null, cartes: CarteInfo[] | null,
                            roots: RootInfo[] | null): HomeRestoreAction => ({
    type: HOME_RESTORE,
    payload: {location, login, token, permissions, cartesIp, cartes, roots}
});

export const HOME_OWNER_VERIFY = "HOME_OWNER_VERIFY";
export type HomeOwnerVerifyAction = Action<typeof HOME_OWNER_VERIFY>;
export const homeOwnerVerify = (): HomeOwnerVerifyAction => ({
    type: HOME_OWNER_VERIFY
});

export const HOME_OWNER_SET = "HOME_OWNER_SET";
export type HomeOwnerSetAction = ActionWithPayload<typeof HOME_OWNER_SET, {
    name: string | null;
    changing: boolean | null;
    fullName: string | null;
    avatar: AvatarImage | null;
}>;
export const homeOwnerSet = (name: string | null, changing: boolean | null, fullName: string | null,
                             avatar: AvatarImage | null): HomeOwnerSetAction => ({
    type: HOME_OWNER_SET,
    payload: {name, changing, fullName, avatar}
});

export const HOME_OWNER_VERIFIED = "HOME_OWNER_VERIFIED";
export type HomeOwnerVerifiedAction = ActionWithPayload<typeof HOME_OWNER_VERIFIED, {
    name: string;
    correct: boolean;
}>;
export const homeOwnerVerified = (name: string, correct: boolean): HomeOwnerVerifiedAction => ({
    type: HOME_OWNER_VERIFIED,
    payload: {name, correct}
});

export const CONNECTIONS_SET = "CONNECTIONS_SET";
export type ConnectionsSetAction = ActionWithPayload<typeof CONNECTIONS_SET, {
    roots: RootInfo[];
}>;
export const connectionsSet = (roots: RootInfo[]): ConnectionsSetAction => ({
    type: CONNECTIONS_SET,
    payload: {roots}
});

export const HOME_AVATARS_LOAD = "HOME_AVATARS_LOAD";
export type HomeAvatarsLoadAction = Action<typeof HOME_AVATARS_LOAD>;
export const homeAvatarsLoad = (): HomeAvatarsLoadAction => ({
    type: HOME_AVATARS_LOAD
});

export const HOME_AVATARS_LOADED = "HOME_AVATARS_LOADED";
export type HomeAvatarsLoadedAction = ActionWithPayload<typeof HOME_AVATARS_LOADED, {
    avatars: AvatarInfo[];
}>;
export const homeAvatarsLoaded = (avatars: AvatarInfo[]): HomeAvatarsLoadedAction => ({
    type: HOME_AVATARS_LOADED,
    payload: {avatars}
});

export const HOME_AVATARS_LOAD_FAILED = "HOME_AVATARS_LOAD_FAILED";
export type HomeAvatarsLoadFailedAction = Action<typeof HOME_AVATARS_LOAD_FAILED>;
export const homeAvatarsLoadFailed = (): HomeAvatarsLoadFailedAction => ({
    type: HOME_AVATARS_LOAD_FAILED
});

export const HOME_FRIEND_GROUPS_LOAD = "HOME_FRIEND_GROUPS_LOAD";
export type HomeFriendGroupsLoadAction = Action<typeof HOME_FRIEND_GROUPS_LOAD>;
export const homeFriendGroupsLoad = (): HomeFriendGroupsLoadAction => ({
    type: HOME_FRIEND_GROUPS_LOAD
});

export const HOME_FRIEND_GROUPS_LOADED = "HOME_FRIEND_GROUPS_LOADED";
export type HomeFriendGroupsLoadedAction = ActionWithPayload<typeof HOME_FRIEND_GROUPS_LOADED, {
    friendGroups: FriendGroupInfo[];
}>;
export const homeFriendGroupsLoaded = (friendGroups: FriendGroupInfo[]): HomeFriendGroupsLoadedAction => ({
    type: HOME_FRIEND_GROUPS_LOADED,
    payload: {friendGroups}
});

export const HOME_INVISIBLE_USERS_LOAD = "HOME_INVISIBLE_USERS_LOAD";
export type HomeInvisibleUsersLoadAction = Action<typeof HOME_INVISIBLE_USERS_LOAD>;
export const homeInvisibleUsersLoad = (): HomeInvisibleUsersLoadAction => ({
    type: HOME_INVISIBLE_USERS_LOAD
});

export const HOME_INVISIBLE_USERS_LOADED = "HOME_INVISIBLE_USERS_LOADED";
export type HomeInvisibleUsersLoadedAction = ActionWithPayload<typeof HOME_INVISIBLE_USERS_LOADED, {
    checksum: number;
    blockedUsers: BlockedUserInfo[];
}>;
export const homeInvisibleUsersLoaded = (checksum: number,
                                         blockedUsers: BlockedUserInfo[]): HomeInvisibleUsersLoadedAction => ({
    type: HOME_INVISIBLE_USERS_LOADED,
    payload: {checksum, blockedUsers}
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
    | ConnectionsSetAction
    | HomeAvatarsLoadAction
    | HomeAvatarsLoadedAction
    | HomeAvatarsLoadFailedAction
    | HomeFriendGroupsLoadAction
    | HomeFriendGroupsLoadedAction
    | HomeInvisibleUsersLoadAction
    | HomeInvisibleUsersLoadedAction;
