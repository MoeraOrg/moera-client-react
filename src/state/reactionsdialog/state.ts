import { ReactionInfo } from "api/node/api-types";
import { VerificationStatus } from "state/state-types";

export interface ReactionsDialogTabsState {
    loading: boolean;
    total: number;
    after: number;
    items: ReactionInfo[];
}

export interface ReactionsDialogState {
    show: boolean;
    nodeName: string | null;
    postingId: string | null;
    commentId: string | null;
    negative: boolean;
    activeTab: string | null;
    reactions: Record<string, ReactionsDialogTabsState>;
    totals: {
        loading: boolean;
        loaded: boolean;
        total: number;
        emojis: number[];
    },
    verificationStatus: Record<string, VerificationStatus>;
}
