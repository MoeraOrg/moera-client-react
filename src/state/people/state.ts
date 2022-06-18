import { PrincipalValue, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

export type PeopleTab = "subscribers" | "subscriptions";

export interface PeopleState {
    tab: PeopleTab;
    loadingGeneral: boolean;
    loadedGeneral: boolean;
    subscribersTotal: number | null;
    subscriptionsTotal: number | null;
    loadingSubscribers: boolean;
    loadedSubscribers: boolean;
    subscribers: SubscriberInfo[];
    loadingSubscriptions: boolean;
    loadedSubscriptions: boolean;
    subscriptions: SubscriptionInfo[];
    operations: {
        viewSubscribers?: PrincipalValue | null;
        viewSubscriptions?: PrincipalValue | null;
        viewSubscribersTotal?: PrincipalValue | null;
        viewSubscriptionsTotal?: PrincipalValue | null;
    };
}
