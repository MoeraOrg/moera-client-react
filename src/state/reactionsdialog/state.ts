import { ReactionInfo, ReactionTotalInfo } from "api";
import { VerificationStatus } from "state/state-types";
import { RelNodeName } from "util/rel-node-name";

export interface ReactionsDialogTabsState {
    loading: boolean;
    total: number;
    after: number;
    items: ReactionInfo[];
}

export interface ReactionsDialogState {
    show: boolean;
    nodeName: RelNodeName | string;
    postingId: string | null;
    commentId: string | null;
    negative: boolean;
    activeTab: number | null;
    reactions: Partial<Record<number, ReactionsDialogTabsState>>;
    totals: {
        loading: boolean;
        loaded: boolean;
        total: number;
        emojis: ReactionTotalInfo[];
    },
    verificationStatus: Partial<Record<string, VerificationStatus>>;
}
