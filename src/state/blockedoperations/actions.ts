import { ActionWithPayload } from "state/action-types";
import { BlockedUserInfo } from "api";

export const BLOCKED_USERS_ADDED = "BLOCKED_USERS_ADDED";
export type BlockedUsersAddedAction = ActionWithPayload<typeof BLOCKED_USERS_ADDED, {
    blockedUsers: BlockedUserInfo[];
}>;
export const blockedUsersAdded = (blockedUsers: BlockedUserInfo[]): BlockedUsersAddedAction => ({
    type: BLOCKED_USERS_ADDED,
    payload: {blockedUsers}
});

export const BLOCKED_USERS_DELETED = "BLOCKED_USERS_DELETED";
export type BlockedUsersDeletedAction = ActionWithPayload<typeof BLOCKED_USERS_DELETED, {
    blockedUsers: BlockedUserInfo[];
}>;
export const blockedUsersDeleted = (blockedUsers: BlockedUserInfo[]): BlockedUsersDeletedAction => ({
    type: BLOCKED_USERS_DELETED,
    payload: {blockedUsers}
});

export type BlockedOperationsAnyAction =
    BlockedUsersAddedAction
    | BlockedUsersDeletedAction;
