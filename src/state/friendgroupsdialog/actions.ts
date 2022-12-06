import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { PrincipalValue } from "api/node/api-types";

export const OPEN_FRIEND_GROUPS_DIALOG = "OPEN_FRIEND_GROUPS_DIALOG";
export type OpenFriendGroupsDialogAction = ActionWithPayload<typeof OPEN_FRIEND_GROUPS_DIALOG, {
    nodeName: string;
}>;
export const openFriendGroupsDialog = (nodeName: string): OpenFriendGroupsDialogAction => ({
    type: OPEN_FRIEND_GROUPS_DIALOG,
    payload: {nodeName}
});

export const CLOSE_FRIEND_GROUPS_DIALOG = "CLOSE_FRIEND_GROUPS_DIALOG";
export type CloseFriendGroupsDialogAction = Action<typeof CLOSE_FRIEND_GROUPS_DIALOG>;
export const closeFriendGroupsDialog = (): CloseFriendGroupsDialogAction => ({
    type: CLOSE_FRIEND_GROUPS_DIALOG
});

export const NODE_CHANGE_FRIEND_GROUPS = "NODE_CHANGE_FRIEND_GROUPS";
export type NodeChangeFriendGroupsAction = ActionWithPayload<typeof NODE_CHANGE_FRIEND_GROUPS, {
    nodeName: string;
    groups: string[];
    view: PrincipalValue;
    addedGroups: number[];
    addedGroupTitles: string[];
    addedGroupView: PrincipalValue[];
}>;
export const nodeChangeFriendGroups = (nodeName: string, groups: string[], view: PrincipalValue, addedGroups: number[],
                                       addedGroupTitles: string[],
                                       addedGroupView: PrincipalValue[]): NodeChangeFriendGroupsAction => ({
    type: NODE_CHANGE_FRIEND_GROUPS,
    payload: {nodeName, groups, view, addedGroups, addedGroupTitles, addedGroupView}
});

export const NODE_CHANGE_FRIEND_GROUPS_FAILED = "NODE_CHANGE_FRIEND_GROUPS_FAILED";
export type NodeChangeFriendGroupsFailedAction = Action<typeof NODE_CHANGE_FRIEND_GROUPS_FAILED>;
export const nodeChangeFriendGroupsFailed = (): NodeChangeFriendGroupsFailedAction => ({
    type: NODE_CHANGE_FRIEND_GROUPS_FAILED
});

export type FriendGroupsDialogAnyAction =
    OpenFriendGroupsDialogAction
    | CloseFriendGroupsDialogAction
    | NodeChangeFriendGroupsAction
    | NodeChangeFriendGroupsFailedAction;
