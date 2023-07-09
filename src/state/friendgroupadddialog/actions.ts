import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { PrincipalValue } from "api/node/api-types";

export const OPEN_FRIEND_GROUP_ADD_DIALOG = "OPEN_FRIEND_GROUP_ADD_DIALOG";
export type OpenFriendGroupAddDialogAction = Action<typeof OPEN_FRIEND_GROUP_ADD_DIALOG>;
export const openFriendGroupAddDialog = (): OpenFriendGroupAddDialogAction => ({
    type: OPEN_FRIEND_GROUP_ADD_DIALOG
});

export const CLOSE_FRIEND_GROUP_ADD_DIALOG = "CLOSE_FRIEND_GROUP_ADD_DIALOG";
export type CloseFriendGroupAddDialogAction = Action<typeof CLOSE_FRIEND_GROUP_ADD_DIALOG>;
export const closeFriendGroupAddDialog = (): CloseFriendGroupAddDialogAction => ({
    type: CLOSE_FRIEND_GROUP_ADD_DIALOG
});

export const FRIEND_GROUP_ADD = "FRIEND_GROUP_ADD";
export type FriendGroupAddAction = ActionWithPayload<typeof FRIEND_GROUP_ADD, {
    title: string;
    view: PrincipalValue;
}>;
export const friendGroupAdd = (title: string, view: PrincipalValue): FriendGroupAddAction => ({
    type: FRIEND_GROUP_ADD,
    payload: {title, view}
});

export const FRIEND_GROUP_ADD_FAILED = "FRIEND_GROUP_ADD_FAILED";
export type FriendGroupAddFailedAction = Action<typeof FRIEND_GROUP_ADD_FAILED>;
export const friendGroupAddFailed = (): FriendGroupAddFailedAction => ({
    type: FRIEND_GROUP_ADD_FAILED
});

export type FriendGroupAddDialogAnyAction =
    OpenFriendGroupAddDialogAction
    | CloseFriendGroupAddDialogAction
    | FriendGroupAddAction
    | FriendGroupAddFailedAction;
