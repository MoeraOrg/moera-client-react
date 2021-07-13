import { PostingInfo } from "api/node/api-types";

export interface PostingState {
    posting: PostingInfo;
    deleting: boolean;
    verificationStatus: string;
}

export type PostingsState = Record<string, PostingState>;
