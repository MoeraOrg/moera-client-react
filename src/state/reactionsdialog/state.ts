import { ReactionInfo, ReactionTotalInfo } from "api";
import { VerificationStatus } from "state/state-types";
import { RelNodeName } from "util/rel-node-name";

export type ReactionsDialogReactionUpdate =
    {type: "added"; reaction: ReactionInfo} | {type: "deleted"; reaction: ReactionInfo | null};

export interface ReactionsDialogTabsState {
    loading: boolean;
    total: number;
    after: number;
    items: ReactionInfo[];
    pendingUpdates?: ReactionsDialogReactionUpdate[];
}

export interface ReactionsDialogState {
    generation: number;
    show: boolean;
    nodeName: RelNodeName | string;
    postingId: string | null;
    commentId: string | null;
    negative: boolean;
    activeTab: number | null;
    reactions: Partial<Record<number, ReactionsDialogTabsState>>;
    totals: {
        generation: number;
        loading: boolean;
        loaded: boolean;
        total: number;
        emojis: ReactionTotalInfo[];
    },
    verificationStatus: Partial<Record<string, VerificationStatus>>;
}
