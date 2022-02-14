import { createSelector } from 'reselect';

import { getPosting, isPostingBeingDeleted, isPostingCached } from "state/postings/selectors";
import { getOwnerName } from "state/owner/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { ClientState } from "state/state";
import { AvatarImage, CommentInfo, PostingInfo } from "api/node/api-types";
import { CommentsState, ExtCommentInfo } from "state/detailedposting/state";

export function getDetailedPostingId(state: ClientState): string | null {
    return state.detailedPosting.id;
}

export function isDetailedPostingDefined(state: ClientState): boolean {
    return !!getDetailedPostingId(state);
}

export function isDetailedPostingId(state: ClientState, id: string): boolean {
    return state.detailedPosting.id === id;
}

export function isDetailedPostingCached(state: ClientState): boolean {
    return isPostingCached(state, getDetailedPostingId(state));
}

export function getDetailedPosting(state: ClientState): PostingInfo | null {
    return getPosting(state, getDetailedPostingId(state));
}

export function isDetailedPostingBeingDeleted(state: ClientState): boolean {
    return isPostingBeingDeleted(state, getDetailedPostingId(state));
}

export function isDetailedPostingToBeLoaded(state: ClientState): boolean {
    return !state.detailedPosting.loading && getDetailedPosting(state) == null;
}

export function isDetailedPostingGalleryExpanded(state: ClientState): boolean {
    return state.detailedPosting.galleryExpanded;
}

export function isDetailedPostingGalleryFocused(state: ClientState): boolean {
    return state.detailedPosting.galleryFocused;
}

export function isDetailedPostingPositioned(state: ClientState): boolean {
    return state.detailedPosting.positioned;
}

export function getCommentsState(state: ClientState): CommentsState {
    return state.detailedPosting.comments;
}

export function getCommentsReceiverName(state: ClientState): string | null {
    return getCommentsState(state).receiverName;
}

export function getCommentsReceiverPostingId(state: ClientState): string | null {
    return getCommentsState(state).receiverPostingId;
}

export function isCommentsReceiverPostingId(state: ClientState, id: string): boolean {
    return getCommentsState(state).receiverPostingId === id;
}

export function isCommentsReceiverToBeSwitched(state: ClientState): boolean {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    if (ownerName == null || posting == null) {
        return false;
    }
    const receiverName = posting.receiverName ?? ownerName;
    const receiverPostingId = posting.receiverPostingId ?? posting.id;
    const comments = getCommentsState(state);

    return comments.receiverName !== receiverName || comments.receiverPostingId !== receiverPostingId;
}

export function getComments(state: ClientState): ExtCommentInfo[] {
    return getCommentsState(state).comments;
}

export function getComment(state: ClientState, id: string): ExtCommentInfo | null {
    return getCommentsState(state).comments.find(c => c.id === id) ?? null;
}

export function getFocusedCommentId(state: ClientState): string | null {
    return getCommentsState(state).focusedCommentId;
}

export function isFocusedCommentToBeLoaded(state: ClientState): boolean {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    if (ownerName == null || posting == null || isCommentsReceiverToBeSwitched(state)) {
        return false;
    }
    const comments = getCommentsState(state);
    return comments.focusedCommentId != null && !comments.loadedFocusedComment && !comments.loadingFocusedComment;
}

export function isFocusedCommentReady(state: ClientState): boolean {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    if (ownerName == null || posting == null || isCommentsReceiverToBeSwitched(state)) {
        return false;
    }
    const comments = getCommentsState(state);
    return comments.focusedCommentId == null || comments.loadedFocusedComment;
}

export function isFocusedCommentInList(state: ClientState): boolean {
    const comments = getCommentsState(state);
    return comments.focusedCommentId == null || getComment(state, comments.focusedCommentId) != null;
}

export function isCommentsReadyToBeLoaded(state: ClientState): boolean {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    return ownerName != null && posting != null && !isCommentsReceiverToBeSwitched(state)
        && isFocusedCommentReady(state);
}

export function isFutureCommentsToBeLoaded(state: ClientState): boolean {
    const comments = getCommentsState(state);
    return isCommentsReadyToBeLoaded(state) && !comments.loadingFuture
        && (comments.before === comments.focusedMoment || comments.before === comments.anchor)
        && comments.before < Number.MAX_SAFE_INTEGER;
}

export function isPastCommentsToBeLoaded(state: ClientState): boolean {
    const comments = getCommentsState(state);
    return isCommentsReadyToBeLoaded(state) && !comments.loadingPast
        && (comments.after === comments.focusedMoment - 1 || comments.after === comments.anchor)
        && comments.after > Number.MIN_SAFE_INTEGER;
}

export function isCommentMomentInLoadedRange(state: ClientState, moment: number): boolean {
    const comments = getCommentsState(state);
    return moment != null && moment <= comments.before && moment > comments.after;
}

export function isCommentsFocused(state: ClientState): boolean {
    return state.detailedPosting.comments.focused;
}

export function isCommentComposerFocused(state: ClientState): boolean {
    return state.detailedPosting.compose.focused;
}

export function getCommentDialogCommentId(state: ClientState): string | null {
    return state.detailedPosting.commentDialog.commentId;
}

export function getCommentDialogComment(state: ClientState): CommentInfo | null {
    return state.detailedPosting.commentDialog.comment;
}

export function isCommentComposeDraftToBeLoaded(state: ClientState): boolean {
    const posting = getDetailedPosting(state);
    return posting != null && isConnectedToHome(state) && !state.detailedPosting.compose.loadedDraft
        && !state.detailedPosting.compose.loadingDraft;
}

export function getCommentComposerRepliedToId(state: ClientState): string | null {
    return state.detailedPosting.compose.repliedToId;
}

export function getCommentComposerRepliedToName(state: ClientState): string | null {
    return state.detailedPosting.compose.repliedToName;
}

export function getCommentComposerRepliedToFullName(state: ClientState): string | null {
    return state.detailedPosting.compose.repliedToFullName;
}

export function getCommentComposerRepliedToHeading(state: ClientState): string | null {
    return state.detailedPosting.compose.repliedToHeading;
}

export function isCommentComposerReplied(state: ClientState): boolean {
    return getCommentComposerRepliedToId(state) != null;
}

export function isCommentDialogShown(state: ClientState): boolean {
    return state.detailedPosting.commentDialog.show;
}

export function isCommentDialogConflict(state: ClientState): boolean {
    return state.detailedPosting.commentDialog.conflict;
}

export function isCommentDialogDraftToBeLoaded(state: ClientState): boolean {
    const posting = getDetailedPosting(state);
    return posting != null && isConnectedToHome(state) && !state.detailedPosting.commentDialog.loadedDraft
        && !state.detailedPosting.commentDialog.loadingDraft;
}

export function isGlanceCommentToBeLoaded(state: ClientState): boolean {
    const comments = getCommentsState(state);
    return !comments.loadedGlanceComment
        || (comments.glanceCommentId != null
            && (comments.glanceComment == null || comments.glanceComment.id !== comments.glanceCommentId));
}

export interface NameUsage {
    nodeName: string;
    fullName: string | null;
    avatar: AvatarImage | null;
    count: number;
}

function putName(names: Map<string, NameUsage>, nodeName: string, fullName: string | null | undefined,
                 avatar: AvatarImage | null | undefined): void {
    if (!names.has(nodeName)) {
        names.set(nodeName, {nodeName, fullName: fullName ?? null, avatar: avatar ?? null, count: 1});
    } else {
        const name = names.get(nodeName)!;
        if (!name.avatar || !name.avatar.mediaId) {
            name.avatar = avatar ?? null;
        }
        name.count++;
    }
}

export const getNamesInComments = createSelector(
    getComments,
    comments => {
        const names = new Map<string, NameUsage>();
        for (const comment of comments) {
            putName(names, comment.ownerName, comment.ownerFullName, comment.ownerAvatar);
            if (comment.repliedTo) {
                putName(names, comment.repliedTo.name, comment.repliedTo.fullName, comment.repliedTo.avatar);
            }
        }
        return [...names.values()];
    }
);
