import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import {
    BlockedByUserInfo,
    BlockedUserInfo,
    FriendGroupDetails,
    ProfileInfo,
    SubscriberInfo,
    SubscriptionInfo
} from "api";

export type NodeCardPrepareAction = ActionWithPayload<"NODE_CARD_PREPARE", {
    nodeName: string;
}>;
export const nodeCardPrepare = (nodeName: string): NodeCardPrepareAction =>
    actionWithPayload("NODE_CARD_PREPARE", {nodeName});

export type NodeCardDetailsLoadAction = ActionWithPayload<"NODE_CARD_DETAILS_LOAD", {
    nodeName: string;
}>;
export const nodeCardDetailsLoad = (nodeName: string): NodeCardDetailsLoadAction =>
    actionWithPayload("NODE_CARD_DETAILS_LOAD", {nodeName});

export type NodeCardDetailsLoadFailedAction = ActionWithPayload<"NODE_CARD_DETAILS_LOAD_FAILED", {
    nodeName: string;
}>;
export const nodeCardDetailsLoadFailed = (nodeName: string): NodeCardDetailsLoadFailedAction =>
    actionWithPayload("NODE_CARD_DETAILS_LOAD_FAILED", {nodeName});

export type NodeCardDetailsSetAction = ActionWithPayload<"NODE_CARD_DETAILS_SET", {
    nodeName: string;
    profile: ProfileInfo
}>;
export const nodeCardDetailsSet = (nodeName: string, profile: ProfileInfo): NodeCardDetailsSetAction =>
    actionWithPayload("NODE_CARD_DETAILS_SET", {nodeName, profile});

export type NodeCardStoriesLoadAction = ActionWithPayload<"NODE_CARD_STORIES_LOAD", {
    nodeName: string;
}>;
export const nodeCardStoriesLoad = (nodeName: string): NodeCardStoriesLoadAction =>
    actionWithPayload("NODE_CARD_STORIES_LOAD", {nodeName});

export type NodeCardStoriesLoadFailedAction = ActionWithPayload<"NODE_CARD_STORIES_LOAD_FAILED", {
    nodeName: string;
}>;
export const nodeCardStoriesLoadFailed = (nodeName: string): NodeCardStoriesLoadFailedAction =>
    actionWithPayload("NODE_CARD_STORIES_LOAD_FAILED", {nodeName});

export type NodeCardStoriesSetAction = ActionWithPayload<"NODE_CARD_STORIES_SET", {
    nodeName: string;
    storiesTotal: number;
    lastStoryCreatedAt: number | null;
}>;
export const nodeCardStoriesSet = (
    nodeName: string, storiesTotal: number, lastStoryCreatedAt: number | null
): NodeCardStoriesSetAction =>
    actionWithPayload("NODE_CARD_STORIES_SET", {nodeName, storiesTotal, lastStoryCreatedAt});

export type NodeCardPeopleLoadAction = ActionWithPayload<"NODE_CARD_PEOPLE_LOAD", {
    nodeName: string;
}>;
export const nodeCardPeopleLoad = (nodeName: string): NodeCardPeopleLoadAction =>
    actionWithPayload("NODE_CARD_PEOPLE_LOAD", {nodeName});

export type NodeCardPeopleLoadFailedAction = ActionWithPayload<"NODE_CARD_PEOPLE_LOAD_FAILED", {
    nodeName: string;
}>;
export const nodeCardPeopleLoadFailed = (nodeName: string): NodeCardPeopleLoadFailedAction =>
    actionWithPayload("NODE_CARD_PEOPLE_LOAD_FAILED", {nodeName});

export type NodeCardPeopleSetAction = ActionWithPayload<"NODE_CARD_PEOPLE_SET", {
    nodeName: string;
    subscribersTotal: number | null;
    subscriptionsTotal: number | null;
}>;
export const nodeCardPeopleSet = (
    nodeName: string, subscribersTotal: number | null, subscriptionsTotal: number | null
): NodeCardPeopleSetAction =>
    actionWithPayload("NODE_CARD_PEOPLE_SET", {nodeName, subscribersTotal, subscriptionsTotal});

export type NodeCardSubscriptionLoadAction = ActionWithPayload<"NODE_CARD_SUBSCRIPTION_LOAD", {
    nodeName: string;
}>;
export const nodeCardSubscriptionLoad = (nodeName: string): NodeCardSubscriptionLoadAction =>
    actionWithPayload("NODE_CARD_SUBSCRIPTION_LOAD", {nodeName});

export type NodeCardSubscriptionLoadFailedAction = ActionWithPayload<"NODE_CARD_SUBSCRIPTION_LOAD_FAILED", {
    nodeName: string;
}>;
export const nodeCardSubscriptionLoadFailed = (nodeName: string): NodeCardSubscriptionLoadFailedAction =>
    actionWithPayload("NODE_CARD_SUBSCRIPTION_LOAD_FAILED", {nodeName});

export type NodeCardSubscriptionSetAction = ActionWithPayload<"NODE_CARD_SUBSCRIPTION_SET", {
    nodeName: string;
    subscriber: SubscriberInfo | null;
    subscription: SubscriptionInfo | null;
}>;
export const nodeCardSubscriptionSet = (
    nodeName: string, subscriber: SubscriberInfo | null, subscription: SubscriptionInfo | null
): NodeCardSubscriptionSetAction =>
    actionWithPayload("NODE_CARD_SUBSCRIPTION_SET", {nodeName, subscriber, subscription});

export type NodeCardFriendshipLoadAction = ActionWithPayload<"NODE_CARD_FRIENDSHIP_LOAD", {
    nodeName: string;
}>;
export const nodeCardFriendshipLoad = (nodeName: string): NodeCardFriendshipLoadAction =>
    actionWithPayload("NODE_CARD_FRIENDSHIP_LOAD", {nodeName});

export type NodeCardFriendshipLoadFailedAction = ActionWithPayload<"NODE_CARD_FRIENDSHIP_LOAD_FAILED", {
    nodeName: string;
}>;
export const nodeCardFriendshipLoadFailed = (nodeName: string): NodeCardFriendshipLoadFailedAction =>
    actionWithPayload("NODE_CARD_FRIENDSHIP_LOAD_FAILED", {nodeName});

export type NodeCardFriendshipSetAction = ActionWithPayload<"NODE_CARD_FRIENDSHIP_SET", {
    nodeName: string;
    groups: FriendGroupDetails[] | null;
    remoteGroups: FriendGroupDetails[] | null;
}>;
export const nodeCardFriendshipSet = (
    nodeName: string, groups: FriendGroupDetails[] | null, remoteGroups: FriendGroupDetails[] | null
): NodeCardFriendshipSetAction =>
    actionWithPayload("NODE_CARD_FRIENDSHIP_SET", {nodeName, groups, remoteGroups});

export type NodeCardBlockingLoadAction = ActionWithPayload<"NODE_CARD_BLOCKING_LOAD", {
    nodeName: string;
}>;
export const nodeCardBlockingLoad = (nodeName: string): NodeCardBlockingLoadAction =>
    actionWithPayload("NODE_CARD_BLOCKING_LOAD", {nodeName});

export type NodeCardBlockingLoadFailedAction = ActionWithPayload<"NODE_CARD_BLOCKING_LOAD_FAILED", {
    nodeName: string;
}>;
export const nodeCardBlockingLoadFailed = (nodeName: string): NodeCardBlockingLoadFailedAction =>
    actionWithPayload("NODE_CARD_BLOCKING_LOAD_FAILED", {nodeName});

export type NodeCardBlockingSetAction = ActionWithPayload<"NODE_CARD_BLOCKING_SET", {
    nodeName: string;
    blocked: BlockedUserInfo[] | null;
    blockedBy: BlockedByUserInfo[] | null;
}>;
export const nodeCardBlockingSet = (
    nodeName: string, blocked: BlockedUserInfo[] | null, blockedBy: BlockedByUserInfo[] | null
): NodeCardBlockingSetAction =>
    actionWithPayload("NODE_CARD_BLOCKING_SET", {nodeName, blocked, blockedBy});

export type NodeCardSheriffListLoadAction = ActionWithPayload<"NODE_CARD_SHERIFF_LIST_LOAD", {
    nodeName: string;
}>;
export const nodeCardSheriffListLoad = (nodeName: string): NodeCardSheriffListLoadAction =>
    actionWithPayload("NODE_CARD_SHERIFF_LIST_LOAD", {nodeName});

export type NodeCardSheriffListLoadFailedAction = ActionWithPayload<"NODE_CARD_SHERIFF_LIST_LOAD_FAILED", {
    nodeName: string;
}>;
export const nodeCardSheriffListLoadFailed = (nodeName: string): NodeCardSheriffListLoadFailedAction =>
    actionWithPayload("NODE_CARD_SHERIFF_LIST_LOAD_FAILED", {nodeName});

export type NodeCardSheriffListSetAction = ActionWithPayload<"NODE_CARD_SHERIFF_LIST_SET", {
    nodeName: string;
    blocked: boolean;
}>;
export const nodeCardSheriffListSet = (nodeName: string, blocked: boolean): NodeCardSheriffListSetAction =>
    actionWithPayload("NODE_CARD_SHERIFF_LIST_SET", {nodeName, blocked});

export type NodeCardsClientSwitchAction = ActionWithoutPayload<"NODE_CARDS_CLIENT_SWITCH">;
export const nodeCardsClientSwitch = (): NodeCardsClientSwitchAction =>
    actionWithoutPayload("NODE_CARDS_CLIENT_SWITCH");

export type NodeCardsRefreshAction = ActionWithoutPayload<"NODE_CARDS_REFRESH">;
export const nodeCardsRefresh = (): NodeCardsRefreshAction =>
    actionWithoutPayload("NODE_CARDS_REFRESH");

export type NodeCardCopyMentionAction = ActionWithPayload<"NODE_CARD_COPY_MENTION", {
    nodeName: string;
    fullName: string | null;
}>;
export const nodeCardCopyMention = (nodeName: string, fullName: string | null): NodeCardCopyMentionAction =>
    actionWithPayload("NODE_CARD_COPY_MENTION", {nodeName, fullName});

export type SheriffListAddAction = ActionWithPayload<"SHERIFF_LIST_ADD", {
    nodeName: string;
}>;
export const sheriffListAdd = (nodeName: string): SheriffListAddAction =>
    actionWithPayload("SHERIFF_LIST_ADD", {nodeName});

export type SheriffListDeleteAction = ActionWithPayload<"SHERIFF_LIST_DELETE", {
    nodeName: string;
}>;
export const sheriffListDelete = (nodeName: string): SheriffListDeleteAction =>
    actionWithPayload("SHERIFF_LIST_DELETE", {nodeName});

export type NodeCardsAnyAction =
    NodeCardPrepareAction
    | NodeCardDetailsLoadAction
    | NodeCardDetailsLoadFailedAction
    | NodeCardDetailsSetAction
    | NodeCardStoriesLoadAction
    | NodeCardStoriesLoadFailedAction
    | NodeCardStoriesSetAction
    | NodeCardPeopleLoadAction
    | NodeCardPeopleLoadFailedAction
    | NodeCardPeopleSetAction
    | NodeCardSubscriptionLoadAction
    | NodeCardSubscriptionLoadFailedAction
    | NodeCardSubscriptionSetAction
    | NodeCardFriendshipLoadAction
    | NodeCardFriendshipLoadFailedAction
    | NodeCardFriendshipSetAction
    | NodeCardBlockingLoadAction
    | NodeCardBlockingLoadFailedAction
    | NodeCardBlockingSetAction
    | NodeCardSheriffListLoadAction
    | NodeCardSheriffListLoadFailedAction
    | NodeCardSheriffListSetAction
    | NodeCardsClientSwitchAction
    | NodeCardsRefreshAction
    | NodeCardCopyMentionAction
    | SheriffListAddAction
    | SheriffListDeleteAction;
