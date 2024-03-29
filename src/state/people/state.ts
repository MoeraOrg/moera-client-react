import {
    BlockedByUserInfo,
    BlockedUserInfo,
    ContactInfo,
    FriendInfo,
    FriendOfInfo,
    PrincipalValue,
    SubscriberInfo,
    SubscriptionInfo
} from "api";

export type PeopleTab = "subscribers" | "subscriptions" | "friend-ofs" | "blocked" | "blocked-by" | string;

export interface ContactState {
    contact: ContactInfo;
    subscriber: SubscriberInfo | null;
    subscription: SubscriptionInfo | null;
    friend: FriendInfo | null;
    friendOf: FriendOfInfo | null;
    blocked: BlockedUserInfo[] | null;
    blockedBy: BlockedByUserInfo[] | null;
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
    blockedTotal: number | null;
    blockedByTotal: number | null;
    loadingSubscribers: boolean;
    loadedSubscribers: boolean;
    loadingSubscriptions: boolean;
    loadedSubscriptions: boolean;
    loadingFriends: boolean;
    loadedFriends: boolean;
    loadingFriendOfs: boolean;
    loadedFriendOfs: boolean;
    loadingBlocked: boolean;
    loadedBlocked: boolean;
    loadingBlockedBy: boolean;
    loadedBlockedBy: boolean;
    contacts: ContactsState;
    operations: {
        viewSubscribers?: PrincipalValue | null;
        viewSubscriptions?: PrincipalValue | null;
        viewFriends?: PrincipalValue | null;
        viewFriendOfs?: PrincipalValue | null;
        viewBlocked?: PrincipalValue | null;
        viewBlockedBy?: PrincipalValue | null;
        viewSubscribersTotal?: PrincipalValue | null;
        viewSubscriptionsTotal?: PrincipalValue | null;
        viewFriendsTotal?: PrincipalValue | null;
        viewFriendOfsTotal?: PrincipalValue | null;
    };
    selecting: boolean;
    selected: Partial<Record<string, boolean>>;
    searchRegexes: RegExp[];
    sortAlpha: boolean;
}
