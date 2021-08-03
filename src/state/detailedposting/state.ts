import { Body, CommentInfo, RepliedTo } from "api/node/api-types";
import { VerificationStatus } from "state/state-types";

export interface ExtBody extends Body {
    previewText?: string;
}

export interface ExtRepliedTo extends RepliedTo {
    headingHtml?: string;
}

export interface ExtCommentInfo extends CommentInfo {
    deleting: boolean;
    verificationStatus: VerificationStatus;
    singleEmoji: boolean;
    body: ExtBody;
    repliedTo?: ExtRepliedTo | null;
}

export interface CommentsState {
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

export interface CommentComposeState {
    formId: number;
    beingPosted: boolean;
    focused: boolean;
    loading: boolean;
    repliedToId: string | null;
    repliedToName: string | null;
    repliedToFullName: string | null;
    repliedToHeading: string | null;
    draftId: string | null;
    savingDraft: boolean;
    savedDraft: boolean;
}

export interface CommentDialogState {
    show: boolean;
    loading: boolean;
    commentId: string | null;
    comment: CommentInfo | null;
    beingPosted: boolean;
    conflict: boolean;
    draftId: string | null;
    savingDraft: boolean;
    savedDraft: boolean;
}

export interface DetailedPostingState {
    id: string | null;
    loading: boolean;
    comments: CommentsState;
    positioned: boolean;
    compose: CommentComposeState;
    commentDialog: CommentDialogState;
}
