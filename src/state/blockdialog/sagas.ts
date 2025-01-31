import i18n from 'i18next';

import { executor } from "state/executor";
import { CLIENT_SETTINGS_PREFIX, Node, NodeApiError } from "api";
import { WithContext } from "state/action-types";
import {
    BlockDialogSubmitAction,
    blockDialogSubmitFailed,
    blockDialogSubmitted,
    blockedUserUnfriend,
    BlockedUserUnfriendAction,
    blockedUserUnsubscribe,
    BlockedUserUnsubscribeAction
} from "state/blockdialog/actions";
import { blockedUsersAdded, blockedUsersDeleted } from "state/blockedoperations/actions";
import { dispatch, select } from "state/store-sagas";
import { getSetting } from "state/settings/selectors";
import { ClientAction } from "state/action";
import { feedUnsubscribe } from "state/feeds/actions";
import { friendshipUpdate } from "state/people/actions";
import { settingsUpdate } from "state/settings/actions";
import { confirmBox } from "state/confirmbox/actions";
import { REL_HOME } from "util/rel-node-name";

export default [
    executor("BLOCK_DIALOG_SUBMIT", "", blockDialogSubmitSaga),
    executor("BLOCKED_USER_UNFRIEND", "", blockedUserUnfriendSaga),
    executor("BLOCKED_USER_UNSUBSCRIBE", "", blockedUserUnsubscribeSaga)
];

async function blockDialogSubmitSaga(action: WithContext<BlockDialogSubmitAction>): Promise<void> {
    const {
        nodeName, formattedName, entryNodeName, entryPostingId, prevBlockedUsers, blockedOperations, deadline,
        reasonSrc, reasonSrcFormat
    } = action.payload;
    const {homeOwnerName} = action.context;

    const ownEntryId = entryNodeName == null ? null : entryNodeName === homeOwnerName ? entryPostingId : null;
    const targetNodeName = entryNodeName == null || entryNodeName === homeOwnerName ? null : entryNodeName;
    const targetPostingId = entryNodeName == null || entryNodeName === homeOwnerName ? null : entryPostingId;

    try {
        await Promise.all(prevBlockedUsers.map(blockedUser => deleteBlockedUserIfExists(action, blockedUser.id)));
        const blockedUsers = await Promise.all(
            blockedOperations.map(blockedOperation => Node.blockUser(action, REL_HOME, {
                blockedOperation,
                nodeName,
                entryId: ownEntryId,
                entryNodeName: targetNodeName,
                entryPostingId: targetPostingId,
                deadline,
                reasonSrc,
                reasonSrcFormat
            }))
        );
        dispatch(blockDialogSubmitted(nodeName).causedBy(action));

        if (prevBlockedUsers.length > 0) {
            dispatch(blockedUsersDeleted(prevBlockedUsers).causedBy(action));
        }
        if (blockedUsers.length > 0) {
            dispatch(blockedUsersAdded(blockedUsers).causedBy(action));
            dispatch(blockedUserUnfriend(nodeName, formattedName).causedBy(action));
        }
    } catch (e) {
        dispatch(blockDialogSubmitFailed().causedBy(action));
    }
}

async function deleteBlockedUserIfExists(action: WithContext<BlockDialogSubmitAction>, id: string): Promise<void> {
    try {
        await Node.unblockUser(action, REL_HOME, id, ["blocked-user.not-found"]);
    } catch (e) {
        if (!(e instanceof NodeApiError)) {
            throw e;
        }
    }
}

async function blockedUserUnfriendSaga(action: WithContext<BlockedUserUnfriendAction>): Promise<void> {
    const {nodeName, formattedName} = action.payload;

    const {groups} = await Node.getFriend(action, REL_HOME, nodeName);
    if (groups?.find(g => g.title === "t:friends") == null) {
        return;
    }

    const unfriend = select(state => getSetting(state, "blocked-users.unfriend-on-block") as string);

    if (unfriend === "ask") {
        const onYes = (dontShowAgain: boolean): ClientAction[] => {
            const actions: ClientAction[] = [];
            actions.push(friendshipUpdate(nodeName, null));
            if (dontShowAgain) {
                actions.push(settingsUpdate([{
                    name: CLIENT_SETTINGS_PREFIX + "blocked-users.unfriend-on-block",
                    value: "yes"
                }]));
            }
            actions.push(blockedUserUnsubscribe(nodeName, formattedName));
            return actions;
        }

        const onNo = (dontShowAgain: boolean): ClientAction[] => {
            const actions: ClientAction[] = [];
            if (dontShowAgain) {
                actions.push(settingsUpdate([{
                    name: CLIENT_SETTINGS_PREFIX + "blocked-users.unfriend-on-block",
                    value: "no"
                }]));
            }
            actions.push(blockedUserUnsubscribe(nodeName, formattedName));
            return actions;
        }

        dispatch(confirmBox({
            message: i18n.t("still-friend-blocked-user", {name: formattedName}),
            onYes,
            onNo,
            variant: "primary",
            dontShowAgainBox: true
        }).causedBy(action));
    } else if (unfriend === "yes") {
        dispatch(friendshipUpdate(nodeName, null).causedBy(action));
    }
}

async function blockedUserUnsubscribeSaga(action: WithContext<BlockedUserUnsubscribeAction>): Promise<void> {
    const {nodeName, formattedName} = action.payload;

    const subscriptions = await Node.getSubscriptions(action, REL_HOME, nodeName, "feed" as const,
        ["authentication.required"]);
    const subscriptionId = subscriptions.find(s => s.remoteFeedName === "timeline")?.id;
    if (subscriptionId == null) {
        return;
    }

    const unsubscribe = select(state => getSetting(state, "blocked-users.unsubscribe-on-block") as string);

    if (unsubscribe === "ask") {
        const onYes = (dontShowAgain: boolean): ClientAction[] => {
            const actions: ClientAction[] = [];
            actions.push(feedUnsubscribe(nodeName, "timeline", subscriptionId));
            if (dontShowAgain) {
                actions.push(settingsUpdate([{
                    name: CLIENT_SETTINGS_PREFIX + "blocked-users.unsubscribe-on-block",
                    value: "yes"
                }]));
            }
            return actions;
        }

        const onNo = (dontShowAgain: boolean): ClientAction | void => {
            if (dontShowAgain) {
                return settingsUpdate([{
                    name: CLIENT_SETTINGS_PREFIX + "blocked-users.unsubscribe-on-block",
                    value: "no"
                }]);
            }
        }

        dispatch(confirmBox({
            message: i18n.t("still-subscribed-blocked-user", {name: formattedName}),
            onYes,
            onNo,
            variant: "primary",
            dontShowAgainBox: true
        }).causedBy(action));
    } else if (unsubscribe === "yes") {
        dispatch(feedUnsubscribe(nodeName, "timeline", subscriptionId).causedBy(action));
    }
}
