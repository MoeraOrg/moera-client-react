import { Body, PostingInfo } from "api/node/api-types";
import { VerificationStatus } from "state/state-types";

interface ExtBody extends Body {
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

type NodePostingsState = Partial<Record<string, PostingState>>;

export type PostingsState = Partial<Record<string, NodePostingsState>>;
