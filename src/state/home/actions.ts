import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { AvatarImage, AvatarInfo, BlockedUserInfo, CarteInfo, FriendGroupInfo } from "api";
import { RootInfo } from "storage";

export type ConnectToHomeAction = ActionWithPayload<"CONNECT_TO_HOME", {
    location: string;
    assign: boolean;
    login: string;
    password: string;
    oldPassword: string | null;
    resetToken: string | null;
}>;
export const connectToHome = (
    location: string, assign: boolean, login: string, password: string, oldPassword: string | null = null,
    resetToken: string | null = null
): ConnectToHomeAction =>
    actionWithPayload("CONNECT_TO_HOME", {location, assign, login, password, oldPassword, resetToken});

export type ConnectionToHomeFailedAction = ActionWithoutPayload<"CONNECTION_TO_HOME_FAILED">;
export const connectionToHomeFailed = (): ConnectionToHomeFailedAction =>
    actionWithoutPayload("CONNECTION_TO_HOME_FAILED");

interface ConnectedToHomePayload {
    location: string;
    login: string | null;
    token: string;
    permissions: string[];
    name?: string | null;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    cartesIp?: string | null;
    cartes?: CarteInfo[] | null;
    roots?: RootInfo[] | null;
    connectionSwitch: boolean;
}

export type ConnectedToHomeAction = ActionWithPayload<"CONNECTED_TO_HOME", ConnectedToHomePayload>;
export const connectedToHome = (payload: ConnectedToHomePayload): ConnectedToHomeAction =>
    actionWithPayload("CONNECTED_TO_HOME", payload);

export type DisconnectedFromHomeAction = ActionWithoutPayload<"DISCONNECTED_FROM_HOME">;
export const disconnectedFromHome = (): DisconnectedFromHomeAction =>
    actionWithoutPayload("DISCONNECTED_FROM_HOME");

export type HomeIntroducedAction = ActionWithoutPayload<"HOME_INTRODUCED">;
export const homeIntroduced = (): HomeIntroducedAction =>
    actionWithoutPayload("HOME_INTRODUCED");

export type HomeOwnerVerifyAction = ActionWithoutPayload<"HOME_OWNER_VERIFY">;
export const homeOwnerVerify = (): HomeOwnerVerifyAction =>
    actionWithoutPayload("HOME_OWNER_VERIFY");

export type HomeOwnerSetAction = ActionWithPayload<"HOME_OWNER_SET", {
    name: string | null;
    changing: boolean | null;
    fullName: string | null;
    avatar: AvatarImage | null;
}>;
export const homeOwnerSet = (
    name: string | null, changing: boolean | null, fullName: string | null, avatar: AvatarImage | null
): HomeOwnerSetAction =>
    actionWithPayload("HOME_OWNER_SET", {name, changing, fullName, avatar});

export type HomeOwnerVerifiedAction = ActionWithPayload<"HOME_OWNER_VERIFIED", {
    name: string;
    correct: boolean;
}>;
export const homeOwnerVerified = (name: string, correct: boolean): HomeOwnerVerifiedAction =>
    actionWithPayload("HOME_OWNER_VERIFIED", {name, correct});

export type ConnectionsSetAction = ActionWithPayload<"CONNECTIONS_SET", {
    roots: RootInfo[];
}>;
export const connectionsSet = (roots: RootInfo[]): ConnectionsSetAction =>
    actionWithPayload("CONNECTIONS_SET", {roots});

export type HomeAvatarsLoadAction = ActionWithoutPayload<"HOME_AVATARS_LOAD">;
export const homeAvatarsLoad = (): HomeAvatarsLoadAction =>
    actionWithoutPayload("HOME_AVATARS_LOAD");

export type HomeAvatarsLoadedAction = ActionWithPayload<"HOME_AVATARS_LOADED", {
    avatars: AvatarInfo[];
}>;
export const homeAvatarsLoaded = (avatars: AvatarInfo[]): HomeAvatarsLoadedAction =>
    actionWithPayload("HOME_AVATARS_LOADED", {avatars});

export type HomeAvatarsLoadFailedAction = ActionWithoutPayload<"HOME_AVATARS_LOAD_FAILED">;
export const homeAvatarsLoadFailed = (): HomeAvatarsLoadFailedAction =>
    actionWithoutPayload("HOME_AVATARS_LOAD_FAILED");

export type HomeFriendGroupsLoadAction = ActionWithoutPayload<"HOME_FRIEND_GROUPS_LOAD">;
export const homeFriendGroupsLoad = (): HomeFriendGroupsLoadAction =>
    actionWithoutPayload("HOME_FRIEND_GROUPS_LOAD");

export type HomeFriendGroupsLoadedAction = ActionWithPayload<"HOME_FRIEND_GROUPS_LOADED", {
    friendGroups: FriendGroupInfo[];
}>;
export const homeFriendGroupsLoaded = (friendGroups: FriendGroupInfo[]): HomeFriendGroupsLoadedAction =>
    actionWithPayload("HOME_FRIEND_GROUPS_LOADED", {friendGroups});

export type HomeInvisibleUsersLoadAction = ActionWithoutPayload<"HOME_INVISIBLE_USERS_LOAD">;
export const homeInvisibleUsersLoad = (): HomeInvisibleUsersLoadAction =>
    actionWithoutPayload("HOME_INVISIBLE_USERS_LOAD");

export type HomeInvisibleUsersLoadedAction = ActionWithPayload<"HOME_INVISIBLE_USERS_LOADED", {
    checksum: number;
    blockedUsers: BlockedUserInfo[];
}>;
export const homeInvisibleUsersLoaded = (
    checksum: number, blockedUsers: BlockedUserInfo[]
): HomeInvisibleUsersLoadedAction =>
    actionWithPayload("HOME_INVISIBLE_USERS_LOADED", {checksum, blockedUsers});

export type HomeAnyAction =
    ConnectToHomeAction
    | ConnectionToHomeFailedAction
    | ConnectedToHomeAction
    | DisconnectedFromHomeAction
    | HomeIntroducedAction
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
