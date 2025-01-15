import { all, call, put, select } from 'typed-redux-saga';
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
import { ClientState } from "state/state";
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

function* blockDialogSubmitSaga(action: WithContext<BlockDialogSubmitAction>) {
    const {
        nodeName, formattedName, entryNodeName, entryPostingId, prevBlockedUsers, blockedOperations, deadline,
        reasonSrc, reasonSrcFormat
    } = action.payload;
    const {homeOwnerName} = action.context;

    const ownEntryId = entryNodeName == null ? null : entryNodeName === homeOwnerName ? entryPostingId : null;
    const targetNodeName = entryNodeName == null || entryNodeName === homeOwnerName ? null : entryNodeName;
    const targetPostingId = entryNodeName == null || entryNodeName === homeOwnerName ? null : entryPostingId;

    try {
        yield* all(prevBlockedUsers.map(blockedUser => call(deleteBlockedUserIfExists, action, blockedUser.id)));
        const blockedUsers = yield* all(
            blockedOperations.map(blockedOperation => call(Node.blockUser, action, REL_HOME, {
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
        yield* put(blockDialogSubmitted(nodeName).causedBy(action));

        if (prevBlockedUsers.length > 0) {
            yield* put(blockedUsersDeleted(prevBlockedUsers).causedBy(action));
        }
        if (blockedUsers.length > 0) {
            yield* put(blockedUsersAdded(blockedUsers).causedBy(action));
            yield* put(blockedUserUnfriend(nodeName, formattedName).causedBy(action));
        }
    } catch (e) {
        yield* put(blockDialogSubmitFailed().causedBy(action));
    }
}

function* deleteBlockedUserIfExists(action: WithContext<BlockDialogSubmitAction>, id: string) {
    try {
        return yield* call(Node.unblockUser, action, REL_HOME, id, ["blocked-user.not-found"]);
    } catch (e) {
        if (!(e instanceof NodeApiError)) {
            throw e;
        }
        return null;
    }
}

function* blockedUserUnfriendSaga(action: WithContext<BlockedUserUnfriendAction>) {
    const {nodeName, formattedName} = action.payload;

    const {groups} = yield* call(Node.getFriend, action, REL_HOME, nodeName);
    if (groups?.find(g => g.title === "t:friends") == null) {
        return;
    }

    const unfriend = yield* select((state: ClientState) =>
        getSetting(state, "blocked-users.unfriend-on-block") as string);

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

        yield* put(confirmBox({
            message: i18n.t("still-friend-blocked-user", {name: formattedName}),
            onYes,
            onNo,
            variant: "primary",
            dontShowAgainBox: true
        }).causedBy(action));
    } else if (unfriend === "yes") {
        yield* put(friendshipUpdate(nodeName, null).causedBy(action));
    }
}

function* blockedUserUnsubscribeSaga(action: WithContext<BlockedUserUnsubscribeAction>) {
    const {nodeName, formattedName} = action.payload;

    const subscriptions = yield* call(Node.getSubscriptions, action, REL_HOME, nodeName, "feed" as const,
        ["authentication.required"]);
    const subscriptionId = subscriptions.find(s => s.remoteFeedName === "timeline")?.id;
    if (subscriptionId == null) {
        return;
    }

    const unsubscribe = yield* select((state: ClientState) =>
        getSetting(state, "blocked-users.unsubscribe-on-block") as string);

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

        yield* put(confirmBox({
            message: i18n.t("still-subscribed-blocked-user", {name: formattedName}),
            onYes,
            onNo,
            variant: "primary",
            dontShowAgainBox: true
        }).causedBy(action));
    } else if (unsubscribe === "yes") {
        yield* put(feedUnsubscribe(nodeName, "timeline", subscriptionId).causedBy(action));
    }
}
