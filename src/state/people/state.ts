import {
    ContactInfo,
    FriendInfo,
    FriendOfInfo,
    PrincipalValue,
    SubscriberInfo,
    SubscriptionInfo
} from "api/node/api-types";

export type PeopleTab = string;

export interface ContactState {
    contact: ContactInfo;
    subscriber: SubscriberInfo | null;
    subscription: SubscriptionInfo | null;
    friend: FriendInfo | null;
    friendOf: FriendOfInfo | null;
}

type ContactsState = Partial<Record<string, ContactState>>;

export interface PeopleState {
    tab: PeopleTab;
    loadingGeneral: boolean;
    loadedGeneral: boolean;
    subscribersTotal: number | null;
    subscriptionsTotal: number | null;
    friendsTotal: Partial<Record<string, number>> | null;
    friendOfsTotal: number | null;
    loadingSubscribers: boolean;
    loadedSubscribers: boolean;
    loadingSubscriptions: boolean;
    loadedSubscriptions: boolean;
    loadingFriends: boolean;
    loadedFriends: boolean;
    loadingFriendOfs: boolean;
    loadedFriendOfs: boolean;
    contacts: ContactsState;
    operations: {
        viewSubscribers?: PrincipalValue | null;
        viewSubscriptions?: PrincipalValue | null;
        viewFriends?: PrincipalValue | null;
        viewFriendOfs?: PrincipalValue | null;
        viewSubscribersTotal?: PrincipalValue | null;
        viewSubscriptionsTotal?: PrincipalValue | null;
        viewFriendsTotal?: PrincipalValue | null;
        viewFriendOfsTotal?: PrincipalValue | null;
    };
    selecting: boolean;
    selected: Partial<Record<string, boolean>>;
}
