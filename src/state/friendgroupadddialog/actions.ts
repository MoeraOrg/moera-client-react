import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { PrincipalValue } from "api";

export type OpenFriendGroupAddDialogAction = ActionWithoutPayload<"OPEN_FRIEND_GROUP_ADD_DIALOG">;
export const openFriendGroupAddDialog = (): OpenFriendGroupAddDialogAction =>
    actionWithoutPayload("OPEN_FRIEND_GROUP_ADD_DIALOG");

export type CloseFriendGroupAddDialogAction = ActionWithoutPayload<"CLOSE_FRIEND_GROUP_ADD_DIALOG">;
export const closeFriendGroupAddDialog = (): CloseFriendGroupAddDialogAction =>
    actionWithoutPayload("CLOSE_FRIEND_GROUP_ADD_DIALOG");

export type FriendGroupAddAction = ActionWithPayload<"FRIEND_GROUP_ADD", {
    title: string;
    view: PrincipalValue;
}>;
export const friendGroupAdd = (title: string, view: PrincipalValue): FriendGroupAddAction =>
    actionWithPayload("FRIEND_GROUP_ADD", {title, view});

export type FriendGroupAddFailedAction = ActionWithoutPayload<"FRIEND_GROUP_ADD_FAILED">;
export const friendGroupAddFailed = (): FriendGroupAddFailedAction =>
    actionWithoutPayload("FRIEND_GROUP_ADD_FAILED");

export type FriendGroupAddDialogAnyAction =
    OpenFriendGroupAddDialogAction
    | CloseFriendGroupAddDialogAction
    | FriendGroupAddAction
    | FriendGroupAddFailedAction;
