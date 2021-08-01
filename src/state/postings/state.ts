import { Body, PostingInfo } from "api/node/api-types";
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
    posting: PostingInfo;
    deleting: boolean;
    verificationStatus: VerificationStatus;
}

export type PostingsState = Partial<Record<string, PostingState>>;
