import { actionWithPayload, ActionWithPayload } from "state/action-types";
import { BlockedUserInfo } from "api";

export type BlockedUsersAddedAction = ActionWithPayload<"BLOCKED_USERS_ADDED", {
    blockedUsers: BlockedUserInfo[];
}>;
export const blockedUsersAdded = (blockedUsers: BlockedUserInfo[]): BlockedUsersAddedAction =>
    actionWithPayload("BLOCKED_USERS_ADDED", {blockedUsers});

export type BlockedUsersDeletedAction = ActionWithPayload<"BLOCKED_USERS_DELETED", {
    blockedUsers: BlockedUserInfo[];
}>;
export const blockedUsersDeleted = (blockedUsers: BlockedUserInfo[]): BlockedUsersDeletedAction =>
    actionWithPayload("BLOCKED_USERS_DELETED", {blockedUsers});

export type BlockedOperationsAnyAction =
    BlockedUsersAddedAction
    | BlockedUsersDeletedAction;
