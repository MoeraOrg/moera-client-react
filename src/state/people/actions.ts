import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { PeopleGeneralInfo, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

export const PEOPLE_GO_TO_TAB = "PEOPLE_GO_TO_TAB";
export type PeopleGoToTabAction = ActionWithPayload<typeof PEOPLE_GO_TO_TAB, {
    tab: string;
}>;
export const peopleGoToTab = (tab: string): PeopleGoToTabAction => ({
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

export type PeopleAnyAction =
    PeopleGoToTabAction
    | PeopleGeneralLoadAction
    | PeopleGeneralLoadedAction
    | PeopleGeneralLoadFailedAction
    | SubscribersLoadAction
    | SubscribersLoadedAction
    | SubscribersLoadFailedAction
    | SubscriptionsLoadAction
    | SubscriptionsLoadedAction
    | SubscriptionsLoadFailedAction;
