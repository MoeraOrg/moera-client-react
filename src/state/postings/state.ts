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
    posting: ExtPostingInfo;
    deleting: boolean;
    verificationStatus: VerificationStatus;
    subscriptions: {
        comments: string | null;
    }
}

export type NodePostingsState = Partial<Record<string, PostingState>>;

export type PostingsState = Partial<Record<string, NodePostingsState>>;
