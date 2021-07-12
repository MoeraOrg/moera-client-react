import { CommentInfo } from "api/node/api-types";
import { VerificationStatus } from "state/state-types";

export interface ExtCommentInfo extends CommentInfo {
    deleting: boolean;
    verificationStatus: VerificationStatus;
    singleEmoji: boolean;
}

export interface DetailedPostingCommentsState {
    receiverName: string | null;
    receiverFullName: string | null;
    receiverPostingId: string | null;
    loadingFuture: boolean;
    loadingPast: boolean;
    before: number;
    after: number;
    comments: ExtCommentInfo[];
    totalInFuture: number;
    totalInPast: number;
    anchor: number | null;
    focused: boolean;
    loadingFocusedComment: boolean;
    loadedFocusedComment: boolean;
    focusedCommentId: string | null;
    focusedMoment: number;
    loadingGlanceComment: boolean;
    loadedGlanceComment: boolean;
    glanceCommentId: string | null;
    glanceComment: ExtCommentInfo | null;
}

export interface DetailedPostingComposeState {
    formId: number;
    beingPosted: boolean;
    focused: boolean;
    showDialog: boolean;
    loading: boolean;
    commentId: string | null;
    comment: CommentInfo | null;
    repliedToId: string | null;
    repliedToName: string | null;
    repliedToFullName: string | null;
    repliedToHeading: string | null;
    conflict: boolean;
}

export interface DetailedPostingState {
    id: string | null;
    loading: boolean;
    comments: DetailedPostingCommentsState;
    positioned: boolean;
    compose: DetailedPostingComposeState;
}
