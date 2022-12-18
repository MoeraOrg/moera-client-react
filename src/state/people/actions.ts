import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import {
    FriendGroupDetails,
    FriendGroupInfo,
    FriendInfo,
    PeopleGeneralInfo,
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
    nodeName: string;
    friendGroups: FriendGroupDetails[] | null;
}>;
export const friendshipUpdated = (nodeName: string,
                                  friendGroups: FriendGroupDetails[] | null): FriendshipUpdatedAction => ({
    type: FRIENDSHIP_UPDATED,
    payload: {nodeName, friendGroups}
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
    | PeopleGeneralLoadAction
    | PeopleGeneralLoadedAction
    | PeopleGeneralLoadFailedAction
    | PeopleGeneralUnsetAction
    | PeopleUnsetAction
    | SubscribersLoadAction
    | SubscribersLoadedAction
    | SubscribersLoadFailedAction
    | SubscriptionsLoadAction
    | SubscriptionsLoadedAction
    | SubscriptionsLoadFailedAction
    | FriendsLoadAction
    | FriendsLoadedAction
    | FriendsLoadFailedAction
    | FriendshipUpdateAction
    | FriendshipUpdatedAction
    | FriendshipUpdateFailedAction
    | FriendshipSetVisibilityAction
    | FriendGroupAddedAction;
