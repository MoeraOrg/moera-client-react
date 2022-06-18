import { PrincipalValue, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

export type PeopleTab = "subscribers" | "subscriptions";

export interface PeopleState {
    tab: PeopleTab;
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
    operations: {
        viewSubscribers?: PrincipalValue | null;
        viewSubscriptions?: PrincipalValue | null;
    };
}
