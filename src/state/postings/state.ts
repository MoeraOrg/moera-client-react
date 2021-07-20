import { Body, PostingInfo } from "api/node/api-types";

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
    verificationStatus: string;
}

export type PostingsState = Record<string, PostingState>;
