import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import {
    AskSubject,
    BlockedByUserInfo,
    BlockedUserInfo,
    FriendGroupInfo,
    FriendInfo,
    FriendOfInfo,
    PeopleGeneralInfo,
    PrincipalValue,
    SubscriberInfo,
    SubscriptionInfo
} from "api";
import { PeopleTab } from "state/people/state";

export type PeopleGoToTabAction = ActionWithPayload<"PEOPLE_GO_TO_TAB", {
    tab: PeopleTab;
}>;
export const peopleGoToTab = (tab: PeopleTab): PeopleGoToTabAction =>
    actionWithPayload("PEOPLE_GO_TO_TAB", {tab});

export type PeopleGoToDefaultTabAction = ActionWithoutPayload<"PEOPLE_GO_TO_DEFAULT_TAB">;
export const peopleGoToDefaultTab = (): PeopleGoToDefaultTabAction =>
    actionWithoutPayload("PEOPLE_GO_TO_DEFAULT_TAB");

export type PeopleGeneralLoadAction = ActionWithoutPayload<"PEOPLE_GENERAL_LOAD">;
export const peopleGeneralLoad = (): PeopleGeneralLoadAction =>
    actionWithoutPayload("PEOPLE_GENERAL_LOAD");

export type PeopleGeneralLoadedAction = ActionWithPayload<"PEOPLE_GENERAL_LOADED", {
    info: PeopleGeneralInfo;
}>;
export const peopleGeneralLoaded = (info: PeopleGeneralInfo): PeopleGeneralLoadedAction =>
    actionWithPayload("PEOPLE_GENERAL_LOADED", {info});

export type PeopleGeneralLoadFailedAction = ActionWithoutPayload<"PEOPLE_GENERAL_LOAD_FAILED">;
export const peopleGeneralLoadFailed = (): PeopleGeneralLoadFailedAction =>
    actionWithoutPayload("PEOPLE_GENERAL_LOAD_FAILED");

export type PeopleGeneralUnsetAction = ActionWithoutPayload<"PEOPLE_GENERAL_UNSET">;
export const peopleGeneralUnset = (): PeopleGeneralUnsetAction =>
    actionWithoutPayload("PEOPLE_GENERAL_UNSET");

export type PeopleStartSelectionAction = ActionWithoutPayload<"PEOPLE_START_SELECTION">;
export const peopleStartSelection = (): PeopleStartSelectionAction =>
    actionWithoutPayload("PEOPLE_START_SELECTION");

export type PeopleStopSelectionAction = ActionWithoutPayload<"PEOPLE_STOP_SELECTION">;
export const peopleStopSelection = (): PeopleStopSelectionAction =>
    actionWithoutPayload("PEOPLE_STOP_SELECTION");

export type PeopleSelectToggleAction = ActionWithPayload<"PEOPLE_SELECT_TOGGLE", {
    nodeName: string
}>;
export const peopleSelectToggle = (nodeName: string): PeopleSelectToggleAction =>
    actionWithPayload("PEOPLE_SELECT_TOGGLE", {nodeName});

export type PeopleSelectedSubscribeAction = ActionWithoutPayload<"PEOPLE_SELECTED_SUBSCRIBE">;
export const peopleSelectedSubscribe = (): PeopleSelectedSubscribeAction =>
    actionWithoutPayload("PEOPLE_SELECTED_SUBSCRIBE");

export type PeopleSelectedUnsubscribeAction = ActionWithoutPayload<"PEOPLE_SELECTED_UNSUBSCRIBE">;
export const peopleSelectedUnsubscribe = (): PeopleSelectedUnsubscribeAction =>
    actionWithoutPayload("PEOPLE_SELECTED_UNSUBSCRIBE");

export type PeopleSelectedFriendAction = ActionWithoutPayload<"PEOPLE_SELECTED_FRIEND">;
export const peopleSelectedFriend = (): PeopleSelectedFriendAction =>
    actionWithoutPayload("PEOPLE_SELECTED_FRIEND");

export type PeopleSelectedUnfriendAction = ActionWithoutPayload<"PEOPLE_SELECTED_UNFRIEND">;
export const peopleSelectedUnfriend = (): PeopleSelectedUnfriendAction =>
    actionWithoutPayload("PEOPLE_SELECTED_UNFRIEND");

export type PeopleSelectedAskAction = ActionWithPayload<"PEOPLE_SELECTED_ASK", {
    subject: AskSubject;
    message: string;
}>;
export const peopleSelectedAsk = (subject: AskSubject, message: string): PeopleSelectedAskAction =>
    actionWithPayload("PEOPLE_SELECTED_ASK", {subject, message});

export type PeopleSelectedSubscriberSetVisibilityAction =
    ActionWithPayload<"PEOPLE_SELECTED_SUBSCRIBER_SET_VISIBILITY", {
        visible: boolean;
    }>;
export const peopleSelectedSubscriberSetVisibility = (
    visible: boolean
): PeopleSelectedSubscriberSetVisibilityAction =>
    actionWithPayload("PEOPLE_SELECTED_SUBSCRIBER_SET_VISIBILITY", {visible});

export type PeopleSelectedSubscriptionSetVisibilityAction =
    ActionWithPayload<"PEOPLE_SELECTED_SUBSCRIPTION_SET_VISIBILITY", {
        visible: boolean;
    }>;
export const peopleSelectedSubscriptionSetVisibility = (
    visible: boolean
): PeopleSelectedSubscriptionSetVisibilityAction =>
    actionWithPayload("PEOPLE_SELECTED_SUBSCRIPTION_SET_VISIBILITY", {visible});

export type PeopleSelectedFriendshipSetVisibilityAction =
    ActionWithPayload<"PEOPLE_SELECTED_FRIENDSHIP_SET_VISIBILITY", {
        visible: boolean;
    }>;
export const peopleSelectedFriendshipSetVisibility = (
    visible: boolean
): PeopleSelectedFriendshipSetVisibilityAction =>
    actionWithPayload("PEOPLE_SELECTED_FRIENDSHIP_SET_VISIBILITY", {visible});

export type PeopleSelectedChangeFriendGroupsAction = ActionWithPayload<"PEOPLE_SELECTED_CHANGE_FRIEND_GROUPS", {
    includedGroups: string[];
    excludedGroups: string[];
    addedGroups: number[];
    addedGroupTitles: string[];
    addedGroupView: PrincipalValue[];
}>;
export const peopleSelectedChangeFriendGroups = (
    includedGroups: string[], excludedGroups: string[], addedGroups: number[], addedGroupTitles: string[],
    addedGroupView: PrincipalValue[]
): PeopleSelectedChangeFriendGroupsAction =>
    actionWithPayload(
        "PEOPLE_SELECTED_CHANGE_FRIEND_GROUPS",
        {includedGroups, excludedGroups, addedGroups, addedGroupTitles, addedGroupView}
    );

export type PeopleSetSearchPrefixAction = ActionWithPayload<"PEOPLE_SET_SEARCH_PREFIX", {
    prefix: string;
}>;
export const peopleSetSearchPrefix = (prefix: string): PeopleSetSearchPrefixAction =>
    actionWithPayload("PEOPLE_SET_SEARCH_PREFIX", {prefix});

export type PeopleSetSortAction = ActionWithPayload<"PEOPLE_SET_SORT", {
    sortAlpha: boolean;
}>;
export const peopleSetSort = (sortAlpha: boolean): PeopleSetSortAction =>
    actionWithPayload("PEOPLE_SET_SORT", {sortAlpha});

export type SubscribersLoadAction = ActionWithoutPayload<"SUBSCRIBERS_LOAD">;
export const subscribersLoad = (): SubscribersLoadAction =>
    actionWithoutPayload("SUBSCRIBERS_LOAD");

export type SubscribersLoadedAction = ActionWithPayload<"SUBSCRIBERS_LOADED", {
    list: SubscriberInfo[];
}>;
export const subscribersLoaded = (list: SubscriberInfo[]): SubscribersLoadedAction =>
    actionWithPayload("SUBSCRIBERS_LOADED", {list});

export type SubscribersLoadFailedAction = ActionWithoutPayload<"SUBSCRIBERS_LOAD_FAILED">;
export const subscribersLoadFailed = (): SubscribersLoadFailedAction =>
    actionWithoutPayload("SUBSCRIBERS_LOAD_FAILED");

export type SubscriptionsLoadAction = ActionWithoutPayload<"SUBSCRIPTIONS_LOAD">;
export const subscriptionsLoad = (): SubscriptionsLoadAction =>
    actionWithoutPayload("SUBSCRIPTIONS_LOAD");

export type SubscriptionsLoadedAction = ActionWithPayload<"SUBSCRIPTIONS_LOADED", {
    list: SubscriptionInfo[];
}>;
export const subscriptionsLoaded = (list: SubscriptionInfo[]): SubscriptionsLoadedAction =>
    actionWithPayload("SUBSCRIPTIONS_LOADED", {list});

export type SubscriptionsLoadFailedAction = ActionWithoutPayload<"SUBSCRIPTIONS_LOAD_FAILED">;
export const subscriptionsLoadFailed = (): SubscriptionsLoadFailedAction =>
    actionWithoutPayload("SUBSCRIPTIONS_LOAD_FAILED");

export type FriendsLoadAction = ActionWithoutPayload<"FRIENDS_LOAD">;
export const friendsLoad = (): FriendsLoadAction =>
    actionWithoutPayload("FRIENDS_LOAD");

export type FriendsLoadedAction = ActionWithPayload<"FRIENDS_LOADED", {
    list: FriendInfo[];
}>;
export const friendsLoaded = (list: FriendInfo[]): FriendsLoadedAction =>
    actionWithPayload("FRIENDS_LOADED", {list});

export type FriendsLoadFailedAction = ActionWithoutPayload<"FRIENDS_LOAD_FAILED">;
export const friendsLoadFailed = (): FriendsLoadFailedAction =>
    actionWithoutPayload("FRIENDS_LOAD_FAILED");

export type FriendOfsLoadAction = ActionWithoutPayload<"FRIEND_OFS_LOAD">;
export const friendOfsLoad = (): FriendOfsLoadAction =>
    actionWithoutPayload("FRIEND_OFS_LOAD");

export type FriendOfsLoadedAction = ActionWithPayload<"FRIEND_OFS_LOADED", {
    list: FriendOfInfo[];
}>;
export const friendOfsLoaded = (list: FriendOfInfo[]): FriendOfsLoadedAction =>
    actionWithPayload("FRIEND_OFS_LOADED", {list});

export type FriendOfsLoadFailedAction = ActionWithoutPayload<"FRIEND_OFS_LOAD_FAILED">;
export const friendOfsLoadFailed = (): FriendOfsLoadFailedAction =>
    actionWithoutPayload("FRIEND_OFS_LOAD_FAILED");

export type BlockedLoadAction = ActionWithoutPayload<"BLOCKED_LOAD">;
export const blockedLoad = (): BlockedLoadAction =>
    actionWithoutPayload("BLOCKED_LOAD");

export type BlockedLoadedAction = ActionWithPayload<"BLOCKED_LOADED", {
    list: BlockedUserInfo[];
}>;
export const blockedLoaded = (list: BlockedUserInfo[]): BlockedLoadedAction =>
    actionWithPayload("BLOCKED_LOADED", {list});

export type BlockedLoadFailedAction = ActionWithoutPayload<"BLOCKED_LOAD_FAILED">;
export const blockedLoadFailed = (): BlockedLoadFailedAction =>
    actionWithoutPayload("BLOCKED_LOAD_FAILED");

export type BlockedByLoadAction = ActionWithoutPayload<"BLOCKED_BY_LOAD">;
export const blockedByLoad = (): BlockedByLoadAction =>
    actionWithoutPayload("BLOCKED_BY_LOAD");

export type BlockedByLoadedAction = ActionWithPayload<"BLOCKED_BY_LOADED", {
    list: BlockedByUserInfo[];
}>;
export const blockedByLoaded = (list: BlockedByUserInfo[]): BlockedByLoadedAction =>
    actionWithPayload("BLOCKED_BY_LOADED", {list});

export type BlockedByLoadFailedAction = ActionWithoutPayload<"BLOCKED_BY_LOAD_FAILED">;
export const blockedByLoadFailed = (): BlockedByLoadFailedAction =>
    actionWithoutPayload("BLOCKED_BY_LOAD_FAILED");

export type FriendshipUpdateAction = ActionWithPayload<"FRIENDSHIP_UPDATE", {
    nodeName: string;
    friendGroups: string[] | null;
    storyId?: string | null;
}>;
export const friendshipUpdate = (
    nodeName: string, friendGroups: string[] | null, storyId?: string | null
): FriendshipUpdateAction =>
    actionWithPayload("FRIENDSHIP_UPDATE", {nodeName, friendGroups, storyId});

export type FriendshipUpdatedAction = ActionWithPayload<"FRIENDSHIP_UPDATED", {
    friend: FriendInfo;
}>;
export const friendshipUpdated = (friend: FriendInfo): FriendshipUpdatedAction =>
    actionWithPayload("FRIENDSHIP_UPDATED", {friend});

export type FriendshipUpdateFailedAction = ActionWithPayload<"FRIENDSHIP_UPDATE_FAILED", {
    nodeName: string;
}>;
export const friendshipUpdateFailed = (nodeName: string): FriendshipUpdateFailedAction =>
    actionWithPayload("FRIENDSHIP_UPDATE_FAILED", {nodeName});

export type FriendshipSetVisibilityAction = ActionWithPayload<"FRIENDSHIP_SET_VISIBILITY", {
    nodeName: string;
    visible: boolean;
}>;
export const friendshipSetVisibility = (nodeName: string, visible: boolean): FriendshipSetVisibilityAction =>
    actionWithPayload("FRIENDSHIP_SET_VISIBILITY", {nodeName, visible});

export type FriendGroupAddedAction = ActionWithPayload<"FRIEND_GROUP_ADDED", {
    nodeName: string;
    details: FriendGroupInfo;
}>;
export const friendGroupAdded = (nodeName: string, details: FriendGroupInfo): FriendGroupAddedAction =>
    actionWithPayload("FRIEND_GROUP_ADDED", {nodeName, details});

export type PeopleAnyAction =
    PeopleGoToTabAction
    | PeopleGoToDefaultTabAction
    | PeopleGeneralLoadAction
    | PeopleGeneralLoadedAction
    | PeopleGeneralLoadFailedAction
    | PeopleGeneralUnsetAction
    | PeopleStartSelectionAction
    | PeopleStopSelectionAction
    | PeopleSelectToggleAction
    | PeopleSelectedSubscribeAction
    | PeopleSelectedUnsubscribeAction
    | PeopleSelectedFriendAction
    | PeopleSelectedUnfriendAction
    | PeopleSelectedAskAction
    | PeopleSelectedSubscriberSetVisibilityAction
    | PeopleSelectedSubscriptionSetVisibilityAction
    | PeopleSelectedFriendshipSetVisibilityAction
    | PeopleSelectedChangeFriendGroupsAction
    | PeopleSetSearchPrefixAction
    | PeopleSetSortAction
    | SubscribersLoadAction
    | SubscribersLoadedAction
    | SubscribersLoadFailedAction
    | SubscriptionsLoadAction
    | SubscriptionsLoadedAction
    | SubscriptionsLoadFailedAction
    | FriendsLoadAction
    | FriendsLoadedAction
    | FriendsLoadFailedAction
    | FriendOfsLoadAction
    | FriendOfsLoadedAction
    | FriendOfsLoadFailedAction
    | BlockedLoadAction
    | BlockedLoadedAction
    | BlockedLoadFailedAction
    | BlockedByLoadAction
    | BlockedByLoadedAction
    | BlockedByLoadFailedAction
    | FriendshipUpdateAction
    | FriendshipUpdatedAction
    | FriendshipUpdateFailedAction
    | FriendshipSetVisibilityAction
    | FriendGroupAddedAction;
