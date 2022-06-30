import { AvatarImage, FundraiserInfo, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

export interface NodeCardState {
    fullName: string | null;
    gender: string | null;
    title: string | null;
    avatar: AvatarImage | null;
    fundraisers: FundraiserInfo[] | null;
    storiesTotal: number | null;
    lastStoryCreatedAt: number | null;
    subscribersTotal: number | null;
    subscriptionsTotal: number | null;
    subscribing: boolean;
    unsubscribing: boolean;
    loading: boolean;
    loaded: boolean;
    subscriber: SubscriberInfo | null;
    subscription: SubscriptionInfo | null;
}

export type NodeCardsState = Partial<Record<string, NodeCardState>>;
