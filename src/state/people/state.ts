import { ContactInfo, PrincipalValue, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

export type PeopleTab = "subscribers" | "subscriptions";

export interface ContactState {
    contact: ContactInfo;
    subscriber: SubscriberInfo | null;
    subscription: SubscriptionInfo | null;
}

type ContactsState = Partial<Record<string, ContactState>>;

export interface PeopleState {
    tab: PeopleTab;
    loadingGeneral: boolean;
    loadedGeneral: boolean;
    subscribersTotal: number | null;
    subscriptionsTotal: number | null;
    loadingSubscribers: boolean;
    loadedSubscribers: boolean;
    loadingSubscriptions: boolean;
    loadedSubscriptions: boolean;
    contacts: ContactsState;
    operations: {
        viewSubscribers?: PrincipalValue | null;
        viewSubscriptions?: PrincipalValue | null;
        viewSubscribersTotal?: PrincipalValue | null;
        viewSubscriptionsTotal?: PrincipalValue | null;
    };
}
