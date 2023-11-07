import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { PrincipalValue } from "api";

export type OpenFriendGroupsDialogAction = ActionWithPayload<"OPEN_FRIEND_GROUPS_DIALOG", {
    nodeName: string | null;
}>;
export const openFriendGroupsDialog = (nodeName: string | null): OpenFriendGroupsDialogAction =>
    actionWithPayload("OPEN_FRIEND_GROUPS_DIALOG", {nodeName});

export type CloseFriendGroupsDialogAction = ActionWithoutPayload<"CLOSE_FRIEND_GROUPS_DIALOG">;
export const closeFriendGroupsDialog = (): CloseFriendGroupsDialogAction =>
    actionWithoutPayload("CLOSE_FRIEND_GROUPS_DIALOG");

export type NodeChangeFriendGroupsAction = ActionWithPayload<"NODE_CHANGE_FRIEND_GROUPS", {
    nodeName: string;
    groups: string[];
    view: PrincipalValue;
    addedGroups: number[];
    addedGroupTitles: string[];
    addedGroupView: PrincipalValue[];
}>;
export const nodeChangeFriendGroups = (
    nodeName: string, groups: string[], view: PrincipalValue, addedGroups: number[], addedGroupTitles: string[],
    addedGroupView: PrincipalValue[]
): NodeChangeFriendGroupsAction =>
    actionWithPayload(
        "NODE_CHANGE_FRIEND_GROUPS",
        {nodeName, groups, view, addedGroups, addedGroupTitles, addedGroupView}
    );

export type NodeChangeFriendGroupsFailedAction = ActionWithoutPayload<"NODE_CHANGE_FRIEND_GROUPS_FAILED">;
export const nodeChangeFriendGroupsFailed = (): NodeChangeFriendGroupsFailedAction =>
    actionWithoutPayload("NODE_CHANGE_FRIEND_GROUPS_FAILED");

export type FriendGroupsDialogAnyAction =
    OpenFriendGroupsDialogAction
    | CloseFriendGroupsDialogAction
    | NodeChangeFriendGroupsAction
    | NodeChangeFriendGroupsFailedAction;
