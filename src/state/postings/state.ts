import { Body, PostingInfo } from "api";
import { VerificationStatus } from "state/state-types";

export interface ExtBody extends Body {
    previewText?: string;
    subjectHtml?: string;
}

export interface ExtPostingInfo extends PostingInfo {
    bodyPreview?: ExtBody | null;
    body: ExtBody;
}

export interface PostingState {
    posting?: ExtPostingInfo;
    deleting?: boolean;
    verificationStatus?: VerificationStatus;
    visitedAt?: Date | null;
    visitRecorded?: boolean;
    subscriptions?: {
        comments: string | null;
    }
    references?: PostingReference[];
    /** Unix time of the last load or change in state references. */
    lastUsedAt?: number;
    /** Whether the last cache maintenance found a reference to this entry. */
    referenced?: boolean;
}

export type NodePostingsState = Partial<Record<string, PostingState>>;

export type PostingsState = Partial<Record<string, NodePostingsState>>;

export interface PostingReference {
    nodeName: string;
    postingId: string;
}
