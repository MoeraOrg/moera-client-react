import { FriendGroupDetails, ProfileInfo, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

export interface NodeCardState {
    details: {
        loading: boolean;
        loaded: boolean;
        profile: ProfileInfo;
    },
    stories: {
        loading: boolean;
        loaded: boolean;
        storiesTotal: number | null;
        lastStoryCreatedAt: number | null;
    },
    people: {
        loading: boolean;
        loaded: boolean;
        subscribersTotal: number | null;
        subscriptionsTotal: number | null;
    },
    subscription: {
        loading: boolean;
        loaded: boolean;
        subscribing: boolean;
        unsubscribing: boolean;
        subscriber: SubscriberInfo | null;
        subscription: SubscriptionInfo | null;
    },
    friendship: {
        loading: boolean;
        loaded: boolean;
        updating: boolean;
        groups: FriendGroupDetails[] | null;
        remoteGroups: FriendGroupDetails[] | null;
    }
}

type NodeCardCardsState = Partial<Record<string, NodeCardState>>;

export interface NodeCardsState {
    clientName: string | null; // home owner name or URL used when querying data, null for unsigned
    cards: NodeCardCardsState;
}
