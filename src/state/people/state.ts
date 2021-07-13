import { SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

export interface PeopleState {
    tab: string;
    loadingGeneral: boolean;
    loadedGeneral: boolean;
    subscribersTotal: number;
    subscriptionsTotal: number;
    loadingSubscribers: boolean;
    loadedSubscribers: boolean;
    subscribers: SubscriberInfo[];
    loadingSubscriptions: boolean;
    loadedSubscriptions: boolean;
    subscriptions: SubscriptionInfo[];
}
