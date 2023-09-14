import { BlockedUserInfo, Body, CommentInfo, DraftInfo, Features, RepliedTo } from "api";
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
    invisible: boolean;
}

export interface CommentsState {
    receiverName: string | null;
    receiverFullName: string | null;
    receiverPostingId: string | null;
    receiverFeatures: Features | null;
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
    loadingBlockedUsers: boolean;
    loadedBlockedUsers: boolean;
    blockedUsers: BlockedUserInfo[];
    showInvisible: boolean;
}

export interface CommentComposeState {
    formId: number;
    beingPosted: boolean;
    focused: boolean;
    repliedToId: string | null;
    repliedToName: string | null;
    repliedToFullName: string | null;
    repliedToHeading: string | null;
    loadingDraft: boolean;
    loadedDraft: boolean;
    draft: DraftInfo | null;
    savingDraft: boolean;
    savedDraft: boolean;
}

export interface CommentDialogState {
    show: boolean;
    loading: boolean;
    loaded: boolean;
    commentId: string | null;
    comment: CommentInfo | null;
    beingPosted: boolean;
    posted: boolean;
    conflict: boolean;
    loadingDraft: boolean;
    loadedDraft: boolean;
    draft: DraftInfo | null;
    savingDraft: boolean;
    savedDraft: boolean;
}

export interface DetailedPostingState {
    id: string | null;
    loading: boolean;
    loadedAttached: boolean;
    galleryExpanded: boolean;
    galleryFocused: boolean;
    comments: CommentsState;
    positioned: boolean;
    compose: CommentComposeState;
    commentDialog: CommentDialogState;
}
