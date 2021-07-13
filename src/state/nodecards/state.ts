export interface NodeCardState {
    fullName: string | null;
    gender: string | null;
    title: string | null;
    subscribersTotal: number | null;
    subscriptionsTotal: number | null;
    subscribed: boolean | null;
    subscribing: boolean;
    unsubscribing: boolean;
    subscriberId: string | null;
    loading: boolean;
    loaded: boolean;
}

export type NodeCardsState = Record<string, NodeCardState>;
