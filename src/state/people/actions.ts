import { ActionBase } from "state/action-base";
import { PeopleGeneralInfo, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

export const PEOPLE_GO_TO_TAB = "PEOPLE_GO_TO_TAB";
type PeopleGoToTabAction = ActionBase<typeof PEOPLE_GO_TO_TAB, {
    tab: string;
}>;
export const peopleGoToTab = (tab: string): PeopleGoToTabAction => ({
    type: PEOPLE_GO_TO_TAB,
    payload: {tab}
});

export const PEOPLE_GENERAL_LOAD = "PEOPLE_GENERAL_LOAD";
type PeopleGeneralLoadAction = ActionBase<typeof PEOPLE_GENERAL_LOAD, never>;
export const peopleGeneralLoad = (): PeopleGeneralLoadAction => ({
    type: PEOPLE_GENERAL_LOAD
});

export const PEOPLE_GENERAL_LOADED = "PEOPLE_GENERAL_LOADED";
type PeopleGeneralLoadedAction = ActionBase<typeof PEOPLE_GENERAL_LOADED, {
    info: PeopleGeneralInfo;
}>;
export const peopleGeneralLoaded = (info: PeopleGeneralInfo): PeopleGeneralLoadedAction => ({
    type: PEOPLE_GENERAL_LOADED,
    payload: {info}
});

export const PEOPLE_GENERAL_LOAD_FAILED = "PEOPLE_GENERAL_LOAD_FAILED";
type PeopleGeneralLoadFailedAction = ActionBase<typeof PEOPLE_GENERAL_LOAD_FAILED, never>;
export const peopleGeneralLoadFailed = (): PeopleGeneralLoadFailedAction => ({
    type: PEOPLE_GENERAL_LOAD_FAILED
});

export const SUBSCRIBERS_LOAD = "SUBSCRIBERS_LOAD";
type SubscribersLoadAction = ActionBase<typeof SUBSCRIBERS_LOAD, never>;
export const subscribersLoad = (): SubscribersLoadAction => ({
    type: SUBSCRIBERS_LOAD
});

export const SUBSCRIBERS_LOADED = "SUBSCRIBERS_LOADED";
type SubscribersLoadedAction = ActionBase<typeof SUBSCRIBERS_LOADED, {
    list: SubscriberInfo[];
}>;
export const subscribersLoaded = (list: SubscriberInfo[]): SubscribersLoadedAction => ({
    type: SUBSCRIBERS_LOADED,
    payload: {list}
});

export const SUBSCRIBERS_LOAD_FAILED = "SUBSCRIBERS_LOAD_FAILED";
type SubscribersLoadFailedAction = ActionBase<typeof SUBSCRIBERS_LOAD_FAILED, never>;
export const subscribersLoadFailed = (): SubscribersLoadFailedAction => ({
    type: SUBSCRIBERS_LOAD_FAILED
});

export const SUBSCRIPTIONS_LOAD = "SUBSCRIPTIONS_LOAD";
type SubscriptionsLoadAction = ActionBase<typeof SUBSCRIPTIONS_LOAD, never>;
export const subscriptionsLoad = (): SubscriptionsLoadAction => ({
    type: SUBSCRIPTIONS_LOAD
});

export const SUBSCRIPTIONS_LOADED = "SUBSCRIPTIONS_LOADED";
type SubscriptionsLoadedAction = ActionBase<typeof SUBSCRIPTIONS_LOADED, {
    list: SubscriptionInfo[];
}>;
export const subscriptionsLoaded = (list: SubscriptionInfo[]): SubscriptionsLoadedAction => ({
    type: SUBSCRIPTIONS_LOADED,
    payload: {list}
});

export const SUBSCRIPTIONS_LOAD_FAILED = "SUBSCRIPTIONS_LOAD_FAILED";
type SubscriptionsLoadFailedAction = ActionBase<typeof SUBSCRIPTIONS_LOAD_FAILED, never>;
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
