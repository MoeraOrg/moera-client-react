import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import {
    AskSubject,
    FriendGroupInfo,
    FriendInfo,
    FriendOfInfo,
    PeopleGeneralInfo,
    PrincipalValue,
    SubscriberInfo,
    SubscriptionInfo
} from "api/node/api-types";
import { PeopleTab } from "state/people/state";

export const PEOPLE_GO_TO_TAB = "PEOPLE_GO_TO_TAB";
export type PeopleGoToTabAction = ActionWithPayload<typeof PEOPLE_GO_TO_TAB, {
    tab: PeopleTab;
}>;
export const peopleGoToTab = (tab: PeopleTab): PeopleGoToTabAction => ({
    type: PEOPLE_GO_TO_TAB,
    payload: {tab}
});

export const PEOPLE_GO_TO_DEFAULT_TAB = "PEOPLE_GO_TO_DEFAULT_TAB";
export type PeopleGoToDefaultTabAction = Action<typeof PEOPLE_GO_TO_DEFAULT_TAB>;
export const peopleGoToDefaultTab = (): PeopleGoToDefaultTabAction => ({
    type: PEOPLE_GO_TO_DEFAULT_TAB
});

export const PEOPLE_GENERAL_LOAD = "PEOPLE_GENERAL_LOAD";
export type PeopleGeneralLoadAction = Action<typeof PEOPLE_GENERAL_LOAD>;
export const peopleGeneralLoad = (): PeopleGeneralLoadAction => ({
    type: PEOPLE_GENERAL_LOAD
});

export const PEOPLE_GENERAL_LOADED = "PEOPLE_GENERAL_LOADED";
export type PeopleGeneralLoadedAction = ActionWithPayload<typeof PEOPLE_GENERAL_LOADED, {
    info: PeopleGeneralInfo;
}>;
export const peopleGeneralLoaded = (info: PeopleGeneralInfo): PeopleGeneralLoadedAction => ({
    type: PEOPLE_GENERAL_LOADED,
    payload: {info}
});

export const PEOPLE_GENERAL_LOAD_FAILED = "PEOPLE_GENERAL_LOAD_FAILED";
export type PeopleGeneralLoadFailedAction = Action<typeof PEOPLE_GENERAL_LOAD_FAILED>;
export const peopleGeneralLoadFailed = (): PeopleGeneralLoadFailedAction => ({
    type: PEOPLE_GENERAL_LOAD_FAILED
});

export const PEOPLE_GENERAL_UNSET = "PEOPLE_GENERAL_UNSET";
export type PeopleGeneralUnsetAction = Action<typeof PEOPLE_GENERAL_UNSET>;
export const peopleGeneralUnset = (): PeopleGeneralUnsetAction => ({
    type: PEOPLE_GENERAL_UNSET
});

export const PEOPLE_UNSET = "PEOPLE_UNSET";
export type PeopleUnsetAction = Action<typeof PEOPLE_UNSET>;
export const peopleUnset = (): PeopleUnsetAction => ({
    type: PEOPLE_UNSET
});

export const PEOPLE_START_SELECTION = "PEOPLE_START_SELECTION";
export type PeopleStartSelectionAction = Action<typeof PEOPLE_START_SELECTION>;
export const peopleStartSelection = (): PeopleStartSelectionAction => ({
    type: PEOPLE_START_SELECTION
});

export const PEOPLE_STOP_SELECTION = "PEOPLE_STOP_SELECTION";
export type PeopleStopSelectionAction = Action<typeof PEOPLE_STOP_SELECTION>;
export const peopleStopSelection = (): PeopleStopSelectionAction => ({
    type: PEOPLE_STOP_SELECTION
});

export const PEOPLE_SELECT_TOGGLE = "PEOPLE_SELECT_TOGGLE";
export type PeopleSelectToggleAction = ActionWithPayload<typeof PEOPLE_SELECT_TOGGLE, {
    nodeName: string
}>;
export const peopleSelectToggle = (nodeName: string): PeopleSelectToggleAction => ({
    type: PEOPLE_SELECT_TOGGLE,
    payload: {nodeName}
});

export const PEOPLE_SELECTED_SUBSCRIBE = "PEOPLE_SELECTED_SUBSCRIBE";
export type PeopleSelectedSubscribeAction = Action<typeof PEOPLE_SELECTED_SUBSCRIBE>;
export const peopleSelectedSubscribe = (): PeopleSelectedSubscribeAction => ({
    type: PEOPLE_SELECTED_SUBSCRIBE
});

export const PEOPLE_SELECTED_UNSUBSCRIBE = "PEOPLE_SELECTED_UNSUBSCRIBE";
export type PeopleSelectedUnsubscribeAction = Action<typeof PEOPLE_SELECTED_UNSUBSCRIBE>;
export const peopleSelectedUnsubscribe = (): PeopleSelectedUnsubscribeAction => ({
    type: PEOPLE_SELECTED_UNSUBSCRIBE
});

export const PEOPLE_SELECTED_FRIEND = "PEOPLE_SELECTED_FRIEND";
export type PeopleSelectedFriendAction = Action<typeof PEOPLE_SELECTED_FRIEND>;
export const peopleSelectedFriend = (): PeopleSelectedFriendAction => ({
    type: PEOPLE_SELECTED_FRIEND
});

export const PEOPLE_SELECTED_UNFRIEND = "PEOPLE_SELECTED_UNFRIEND";
export type PeopleSelectedUnfriendAction = Action<typeof PEOPLE_SELECTED_UNFRIEND>;
export const peopleSelectedUnfriend = (): PeopleSelectedUnfriendAction => ({
    type: PEOPLE_SELECTED_UNFRIEND
});

export const PEOPLE_SELECTED_ASK = "PEOPLE_SELECTED_ASK";
export type PeopleSelectedAskAction = ActionWithPayload<typeof PEOPLE_SELECTED_ASK, {
    subject: AskSubject;
    message: string;
}>;
export const peopleSelectedAsk = (subject: AskSubject, message: string): PeopleSelectedAskAction => ({
    type: PEOPLE_SELECTED_ASK,
    payload: {subject, message}
});

export const PEOPLE_SELECTED_SUBSCRIBER_SET_VISIBILITY = "PEOPLE_SELECTED_SUBSCRIBER_SET_VISIBILITY";
export type PeopleSelectedSubscriberSetVisibilityAction =
    ActionWithPayload<typeof PEOPLE_SELECTED_SUBSCRIBER_SET_VISIBILITY, {
        visible: boolean;
    }>;
export const peopleSelectedSubscriberSetVisibility =
    (visible: boolean): PeopleSelectedSubscriberSetVisibilityAction => ({
        type: PEOPLE_SELECTED_SUBSCRIBER_SET_VISIBILITY,
        payload: {visible}
    });

export const PEOPLE_SELECTED_SUBSCRIPTION_SET_VISIBILITY = "PEOPLE_SELECTED_SUBSCRIPTION_SET_VISIBILITY";
export type PeopleSelectedSubscriptionSetVisibilityAction =
    ActionWithPayload<typeof PEOPLE_SELECTED_SUBSCRIPTION_SET_VISIBILITY, {
        visible: boolean;
    }>;
export const peopleSelectedSubscriptionSetVisibility =
    (visible: boolean): PeopleSelectedSubscriptionSetVisibilityAction => ({
        type: PEOPLE_SELECTED_SUBSCRIPTION_SET_VISIBILITY,
        payload: {visible}
    });

export const PEOPLE_SELECTED_FRIENDSHIP_SET_VISIBILITY = "PEOPLE_SELECTED_FRIENDSHIP_SET_VISIBILITY";
export type PeopleSelectedFriendshipSetVisibilityAction =
    ActionWithPayload<typeof PEOPLE_SELECTED_FRIENDSHIP_SET_VISIBILITY, {
        visible: boolean;
    }>;
export const peopleSelectedFriendshipSetVisibility =
    (visible: boolean): PeopleSelectedFriendshipSetVisibilityAction => ({
        type: PEOPLE_SELECTED_FRIENDSHIP_SET_VISIBILITY,
        payload: {visible}
    });

export const PEOPLE_SELECTED_CHANGE_FRIEND_GROUPS = "PEOPLE_SELECTED_CHANGE_FRIEND_GROUPS";
export type PeopleSelectedChangeFriendGroupsAction = ActionWithPayload<typeof PEOPLE_SELECTED_CHANGE_FRIEND_GROUPS, {
    includedGroups: string[];
    excludedGroups: string[];
    addedGroups: number[];
    addedGroupTitles: string[];
    addedGroupView: PrincipalValue[];
}>;
export const peopleSelectedChangeFriendGroups = (
    includedGroups: string[], excludedGroups: string[], addedGroups: number[], addedGroupTitles: string[],
    addedGroupView: PrincipalValue[]
): PeopleSelectedChangeFriendGroupsAction => ({
    type: PEOPLE_SELECTED_CHANGE_FRIEND_GROUPS,
    payload: {includedGroups, excludedGroups, addedGroups, addedGroupTitles, addedGroupView}
});

export const PEOPLE_SET_SEARCH_PREFIX = "PEOPLE_SET_SEARCH_PREFIX";
export type PeopleSetSearchPrefixAction = ActionWithPayload<typeof PEOPLE_SET_SEARCH_PREFIX, {
    prefix: string;
}>;
export const peopleSetSearchPrefix = (prefix: string): PeopleSetSearchPrefixAction => ({
    type: PEOPLE_SET_SEARCH_PREFIX,
    payload: {prefix}
});

export const PEOPLE_SET_SORT = "PEOPLE_SET_SORT";
export type PeopleSetSortAction = ActionWithPayload<typeof PEOPLE_SET_SORT, {
    sortAlpha: boolean;
}>;
export const peopleSetSort = (sortAlpha: boolean): PeopleSetSortAction => ({
    type: PEOPLE_SET_SORT,
    payload: {sortAlpha}
});

export const SUBSCRIBERS_LOAD = "SUBSCRIBERS_LOAD";
export type SubscribersLoadAction = Action<typeof SUBSCRIBERS_LOAD>;
export const subscribersLoad = (): SubscribersLoadAction => ({
    type: SUBSCRIBERS_LOAD
});

export const SUBSCRIBERS_LOADED = "SUBSCRIBERS_LOADED";
export type SubscribersLoadedAction = ActionWithPayload<typeof SUBSCRIBERS_LOADED, {
    list: SubscriberInfo[];
}>;
export const subscribersLoaded = (list: SubscriberInfo[]): SubscribersLoadedAction => ({
    type: SUBSCRIBERS_LOADED,
    payload: {list}
});

export const SUBSCRIBERS_LOAD_FAILED = "SUBSCRIBERS_LOAD_FAILED";
export type SubscribersLoadFailedAction = Action<typeof SUBSCRIBERS_LOAD_FAILED>;
export const subscribersLoadFailed = (): SubscribersLoadFailedAction => ({
    type: SUBSCRIBERS_LOAD_FAILED
});

export const SUBSCRIPTIONS_LOAD = "SUBSCRIPTIONS_LOAD";
export type SubscriptionsLoadAction = Action<typeof SUBSCRIPTIONS_LOAD>;
export const subscriptionsLoad = (): SubscriptionsLoadAction => ({
    type: SUBSCRIPTIONS_LOAD
});

export const SUBSCRIPTIONS_LOADED = "SUBSCRIPTIONS_LOADED";
export type SubscriptionsLoadedAction = ActionWithPayload<typeof SUBSCRIPTIONS_LOADED, {
    list: SubscriptionInfo[];
}>;
export const subscriptionsLoaded = (list: SubscriptionInfo[]): SubscriptionsLoadedAction => ({
    type: SUBSCRIPTIONS_LOADED,
    payload: {list}
});

export const SUBSCRIPTIONS_LOAD_FAILED = "SUBSCRIPTIONS_LOAD_FAILED";
export type SubscriptionsLoadFailedAction = Action<typeof SUBSCRIPTIONS_LOAD_FAILED>;
export const subscriptionsLoadFailed = (): SubscriptionsLoadFailedAction => ({
    type: SUBSCRIPTIONS_LOAD_FAILED
});

export const FRIENDS_LOAD = "FRIENDS_LOAD";
export type FriendsLoadAction = Action<typeof FRIENDS_LOAD>;
export const friendsLoad = (): FriendsLoadAction => ({
    type: FRIENDS_LOAD
});

export const FRIENDS_LOADED = "FRIENDS_LOADED";
export type FriendsLoadedAction = ActionWithPayload<typeof FRIENDS_LOADED, {
    list: FriendInfo[];
}>;
export const friendsLoaded = (list: FriendInfo[]): FriendsLoadedAction => ({
    type: FRIENDS_LOADED,
    payload: {list}
});

export const FRIENDS_LOAD_FAILED = "FRIENDS_LOAD_FAILED";
export type FriendsLoadFailedAction = Action<typeof FRIENDS_LOAD_FAILED>;
export const friendsLoadFailed = (): FriendsLoadFailedAction => ({
    type: FRIENDS_LOAD_FAILED
});

export const FRIEND_OFS_LOAD = "FRIEND_OFS_LOAD";
export type FriendOfsLoadAction = Action<typeof FRIEND_OFS_LOAD>;
export const friendOfsLoad = (): FriendOfsLoadAction => ({
    type: FRIEND_OFS_LOAD
});

export const FRIEND_OFS_LOADED = "FRIEND_OFS_LOADED";
export type FriendOfsLoadedAction = ActionWithPayload<typeof FRIEND_OFS_LOADED, {
    list: FriendOfInfo[];
}>;
export const friendOfsLoaded = (list: FriendOfInfo[]): FriendOfsLoadedAction => ({
    type: FRIEND_OFS_LOADED,
    payload: {list}
});

export const FRIEND_OFS_LOAD_FAILED = "FRIEND_OFS_LOAD_FAILED";
export type FriendOfsLoadFailedAction = Action<typeof FRIEND_OFS_LOAD_FAILED>;
export const friendOfsLoadFailed = (): FriendOfsLoadFailedAction => ({
    type: FRIEND_OFS_LOAD_FAILED
});

export const FRIENDSHIP_UPDATE = "FRIENDSHIP_UPDATE";
export type FriendshipUpdateAction = ActionWithPayload<typeof FRIENDSHIP_UPDATE, {
    nodeName: string;
    friendGroups: string[] | null;
    storyId?: string | null;
}>;
export const friendshipUpdate = (nodeName: string, friendGroups: string[] | null,
                                 storyId?: string | null): FriendshipUpdateAction => ({
    type: FRIENDSHIP_UPDATE,
    payload: {nodeName, friendGroups, storyId}
});

export const FRIENDSHIP_UPDATED = "FRIENDSHIP_UPDATED";
export type FriendshipUpdatedAction = ActionWithPayload<typeof FRIENDSHIP_UPDATED, {
    friend: FriendInfo;
}>;
export const friendshipUpdated = (friend: FriendInfo): FriendshipUpdatedAction => ({
    type: FRIENDSHIP_UPDATED,
    payload: {friend}
});

export const FRIENDSHIP_UPDATE_FAILED = "FRIENDSHIP_UPDATE_FAILED";
export type FriendshipUpdateFailedAction = ActionWithPayload<typeof FRIENDSHIP_UPDATE_FAILED, {
    nodeName: string;
}>;
export const friendshipUpdateFailed = (nodeName: string): FriendshipUpdateFailedAction => ({
    type: FRIENDSHIP_UPDATE_FAILED,
    payload: {nodeName}
});

export const FRIENDSHIP_SET_VISIBILITY = "FRIENDSHIP_SET_VISIBILITY";
export type FriendshipSetVisibilityAction = ActionWithPayload<typeof FRIENDSHIP_SET_VISIBILITY, {
    nodeName: string;
    visible: boolean;
}>;
export const friendshipSetVisibility = (nodeName: string, visible: boolean): FriendshipSetVisibilityAction => ({
    type: FRIENDSHIP_SET_VISIBILITY,
    payload: {nodeName, visible}
});

export const FRIEND_GROUP_ADDED = "FRIEND_GROUP_ADDED";
export type FriendGroupAddedAction = ActionWithPayload<typeof FRIEND_GROUP_ADDED, {
    nodeName: string;
    details: FriendGroupInfo;
}>;
export const friendGroupAdded = (nodeName: string, details: FriendGroupInfo): FriendGroupAddedAction => ({
    type: FRIEND_GROUP_ADDED,
    payload: {nodeName, details}
});

export type PeopleAnyAction =
    PeopleGoToTabAction
    | PeopleGoToDefaultTabAction
    | PeopleGeneralLoadAction
    | PeopleGeneralLoadedAction
    | PeopleGeneralLoadFailedAction
    | PeopleGeneralUnsetAction
    | PeopleUnsetAction
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
    | FriendshipUpdateAction
    | FriendshipUpdatedAction
    | FriendshipUpdateFailedAction
    | FriendshipSetVisibilityAction
    | FriendGroupAddedAction;
