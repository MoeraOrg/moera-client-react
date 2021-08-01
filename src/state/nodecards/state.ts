import { AvatarImage } from "api/node/api-types";

export interface NodeCardState {
    fullName: string | null;
    gender: string | null;
    title: string | null;
    avatar: AvatarImage | null;
    subscribersTotal: number | null;
    subscriptionsTotal: number | null;
    subscribed: boolean | null;
    subscribing: boolean;
    unsubscribing: boolean;
    subscriberId: string | null;
    loading: boolean;
    loaded: boolean;
}

export type NodeCardsState = Partial<Record<string, NodeCardState>>;
