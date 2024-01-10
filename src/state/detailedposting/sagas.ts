import { call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import {
    CommentInfo,
    CommentText,
    DraftInfo,
    DraftType,
    MediaAttachment,
    Node,
    NodeApiError,
    PrivateMediaFileInfo,
    ReactionAttributes,
    ReactionInfo,
    RepliedTo
} from "api";
import { WithContext } from "state/action-types";
import { executor } from "state/executor";
import { homeIntroduced } from "state/init-selectors";
import { errorThrown } from "state/error/actions";
import { ClientAction } from "state/action";
import {
    closeCommentDialog, CommentComposeCancelAction,
    commentComposeCancelled,
    CommentCopyLinkAction,
    CommentDeleteAction,
    commentDeleted,
    commentDeleteFailed, CommentDialogCommentLoadAction,
    commentDialogCommentLoaded,
    commentDialogCommentLoadFailed,
    CommentDialogCommentResetAction,
    commentDraftAbsent,
    CommentDraftDeleteAction,
    commentDraftDeleted,
    CommentDraftLoadAction,
    commentDraftLoaded,
    commentDraftLoadFailed,
    CommentDraftSaveAction,
    commentDraftSaved,
    commentDraftSaveFailed,
    CommentLoadAction,
    commentLoadFailed,
    CommentPostAction,
    commentPosted,
    commentPostFailed,
    CommentReactAction,
    CommentReactionDeleteAction,
    CommentReactionLoadAction,
    commentReactionSet,
    commentRepliedToSet,
    commentRepliedToUnset,
    CommentReplyAction,
    CommentsBlockedUsersLoadAction,
    commentsBlockedUsersLoaded,
    commentsBlockedUsersLoadFailed,
    commentSet,
    CommentSetVisibilityAction, CommentsFutureSliceLoadAction,
    commentsFutureSliceLoadFailed,
    commentsFutureSliceSet,
    CommentsLoadAllAction,
    CommentsPastSliceLoadAction,
    commentsPastSliceLoadFailed,
    commentsPastSliceSet,
    CommentsReceiverFeaturesLoadAction,
    commentsReceiverFeaturesLoaded, CommentsReceiverSwitchAction,
    commentsReceiverSwitched,
    commentsScrollToComposer,
    commentsSliceUpdate, CommentsUpdateAction,
    CommentVerifyAction,
    commentVerifyFailed,
    DetailedPostingLoadAction,
    DetailedPostingLoadAttachedAction,
    detailedPostingLoaded,
    detailedPostingLoadedAttached,
    detailedPostingLoadFailed, FocusedCommentLoadAction,
    focusedCommentLoaded,
    focusedCommentLoadFailed, GlanceCommentLoadAction,
    glanceCommentLoaded,
    glanceCommentLoadFailed
} from "state/detailedposting/actions";
import {
    getComment,
    getCommentComposerRepliedToName,
    getCommentDialogCommentId,
    getCommentsReceiverName,
    getCommentsReceiverPostingId,
    getCommentsState,
    getDetailedPosting,
    getDetailedPostingId,
    isCommentComposerReplied
} from "state/detailedposting/selectors";
import { fillActivityReaction, fillActivityReactionsInPostings } from "state/activityreactions/sagas";
import { fillBlockedOperations, fillBlockedOperationsInPostings } from "state/blockedoperations/sagas";
import { postingCommentCountUpdate, postingCommentsSet, postingsSet } from "state/postings/actions";
import { ClientState } from "state/state";
import { getOwnerFullName, getOwnerName, isPermitted, isPrincipalIn } from "state/node/selectors";
import { getPosting, isPostingCached } from "state/postings/selectors";
import { flashBox } from "state/flashbox/actions";
import { postingGetLink } from "state/postings/sagas";
import { fillSubscription } from "state/subscriptions/sagas";
import * as Browser from "ui/browser";
import { toAvatarDescription } from "util/avatar";
import { quoteHtml } from "util/html";
import { mentionName } from "util/names";
import { getWindowSelectionHtml, insertText } from "util/ui";

export default [
    executor("DETAILED_POSTING_LOAD", "", detailedPostingLoadSaga, homeIntroduced),
    executor("DETAILED_POSTING_LOAD_ATTACHED", "", detailedPostingLoadAttachedSaga, homeIntroduced),
    executor("COMMENTS_RECEIVER_SWITCH", "", commentsReceiverSwitchSaga, homeIntroduced),
    executor("COMMENTS_RECEIVER_FEATURES_LOAD", "", commentsReceiverFeaturesLoadSaga, homeIntroduced),
    executor("COMMENTS_LOAD_ALL", "", commentsLoadAllSaga, homeIntroduced),
    executor("COMMENTS_PAST_SLICE_LOAD", "", commentsPastSliceLoadSaga, homeIntroduced),
    executor("COMMENTS_FUTURE_SLICE_LOAD", "", commentsFutureSliceLoadSaga, homeIntroduced),
    executor("COMMENTS_UPDATE", "", commentsUpdateSaga, homeIntroduced),
    executor("COMMENTS_BLOCKED_USERS_LOAD", "", commentsBlockedUsersLoadSaga, homeIntroduced),
    executor("COMMENT_LOAD", payload => payload.commentId, commentLoadSaga, homeIntroduced),
    executor("COMMENT_POST", null, commentPostSaga),
    executor("COMMENT_DRAFT_LOAD", "", commentDraftLoadSaga),
    executor("COMMENT_DRAFT_SAVE", "", commentDraftSaveSaga),
    executor("COMMENT_DRAFT_DELETE", "", commentDraftDeleteSaga),
    executor("COMMENT_COMPOSE_CANCEL", "", commentComposeCancelSaga),
    executor("COMMENT_DELETE", payload => payload.commentId, commentDeleteSaga),
    executor("COMMENT_SET_VISIBILITY", payload => payload.commentId, commentSetVisibilitySaga),
    executor("FOCUSED_COMMENT_LOAD", "", focusedCommentLoadSaga),
    executor("COMMENT_COPY_LINK", null, commentCopyLinkSaga),
    executor("COMMENT_DIALOG_COMMENT_LOAD", "", commentDialogCommentLoadSaga),
    executor("COMMENT_DIALOG_COMMENT_RESET", "", commentDialogCommentResetSaga),
    executor("COMMENT_VERIFY", payload => payload.commentId, commentVerifySaga),
    executor("COMMENT_REACT", null, commentReactSaga, homeIntroduced),
    executor(
        "COMMENT_REACTION_LOAD",
        payload => `${payload.id}:${payload.postingId}`,
        commentReactionLoadSaga,
        homeIntroduced
    ),
    executor(
        "COMMENT_REACTION_DELETE",
        payload => `${payload.id}:${payload.postingId}`,
        commentReactionDeleteSaga,
        homeIntroduced
    ),
    executor("COMMENT_REPLY", "", commentReplySaga),
    executor("GLANCE_COMMENT_LOAD", null, glanceCommentLoadSaga)
];

function* detailedPostingLoadSaga(action: DetailedPostingLoadAction) {
    const id = yield* select(getDetailedPostingId);
    if (id == null) {
        yield* put(detailedPostingLoadFailed().causedBy(action));
        return;
    }

    try {
        const posting = yield* call(Node.getPosting, action, "", id, false, ["posting.not-found"]);
        yield* call(fillActivityReaction, action, posting)
        yield* call(fillBlockedOperations, action, posting)
        yield* put(detailedPostingLoaded(posting).causedBy(action));
        yield* call(fillSubscription, action, posting)
    } catch (e) {
        yield* put(detailedPostingLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* detailedPostingLoadAttachedSaga(action: DetailedPostingLoadAttachedAction) {
    const id = yield* select(getDetailedPostingId);
    if (id == null) {
        return;
    }
    const loaded = yield* select(state => {
        const media = getPosting(state, id)?.media;
        if (media == null) {
            return true;
        }
        return media
            .map(ma => ma.media)
            .filter((m): m is PrivateMediaFileInfo => m != null)
            .map(m => m.postingId)
            .filter((p): p is string => p != null)
            .every(p => isPostingCached(state, p));
    });
    if (loaded) {
        yield* put(detailedPostingLoadedAttached().causedBy(action));
        return;
    }

    try {
        const postings = yield* call(Node.getPostingsAttachedToPosting, action, "", id);
        yield* call(fillActivityReactionsInPostings, action, postings);
        yield* call(fillBlockedOperationsInPostings, action, postings);
        yield* put(postingsSet(postings, "").causedBy(action));
        yield* put(detailedPostingLoadedAttached().causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentsReceiverSwitchSaga(action: CommentsReceiverSwitchAction) {
    const {ownerName, ownerFullName, posting} = yield* select(state => ({
        ownerName: getOwnerName(state),
        ownerFullName: getOwnerFullName(state),
        posting: getDetailedPosting(state)
    }));
    if (posting == null || ownerName == null) {
        return;
    }
    const receiverName = posting.receiverName ?? ownerName;
    const receiverFullName = posting.receiverFullName ?? ownerFullName;
    const receiverPostingId = posting.receiverPostingId ?? posting.id;
    yield* put(commentsReceiverSwitched(receiverName, receiverFullName, receiverPostingId).causedBy(action));
}

function* commentsReceiverFeaturesLoadSaga(action: CommentsReceiverFeaturesLoadAction) {
    const nodeName = yield* select(getCommentsReceiverName);
    if (nodeName == null) {
        return;
    }
    try {
        const features = yield* call(Node.getFeatures, action, nodeName);
        yield* put(commentsReceiverFeaturesLoaded(nodeName, features).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentsLoadAllSaga(action: CommentsLoadAllAction) {
    let {receiverName, receiverPostingId, before, after} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        while (after > Number.MIN_SAFE_INTEGER) {
            const slice = yield* call(Node.getCommentsSlice, action, receiverName, receiverPostingId, null, after, 20);
            yield* put(commentsPastSliceSet(
                receiverName, receiverPostingId, slice.comments, slice.before, slice.after, slice.total,
                slice.totalInPast, slice.totalInFuture, null
            ).causedBy(action));
            after = slice.after;
        }
        while (before < Number.MAX_SAFE_INTEGER) {
            const slice = yield* call(Node.getCommentsSlice, action, receiverName, receiverPostingId, before, null, 20);
            yield* put(commentsFutureSliceSet(
                receiverName, receiverPostingId, slice.comments, slice.before, slice.after, slice.total,
                slice.totalInPast, slice.totalInFuture, null
            ).causedBy(action));
            before = slice.before;
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentsPastSliceLoadSaga(action: CommentsPastSliceLoadAction) {
    const {receiverName, receiverPostingId, after} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        yield* put(commentsPastSliceLoadFailed(receiverName, receiverPostingId).causedBy(action));
        return;
    }
    try {
        const slice = yield* call(Node.getCommentsSlice, action, receiverName, receiverPostingId, null, after, 20);
        yield* put(commentsPastSliceSet(
            receiverName, receiverPostingId, slice.comments, slice.before, slice.after, slice.total,
            slice.totalInPast, slice.totalInFuture, action.payload.anchor
        ).causedBy(action));
    } catch (e) {
        yield* put(commentsPastSliceLoadFailed(receiverName, receiverPostingId).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* commentsFutureSliceLoadSaga(action: CommentsFutureSliceLoadAction) {
    const {receiverName, receiverPostingId, before} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        yield* put(commentsFutureSliceLoadFailed(receiverName, receiverPostingId).causedBy(action));
        return;
    }
    try {
        const slice = yield* call(Node.getCommentsSlice, action, receiverName, receiverPostingId, before, null, 20);
        yield* put(commentsFutureSliceSet(
            receiverName, receiverPostingId, slice.comments, slice.before, slice.after, slice.total, slice.totalInPast,
            slice.totalInFuture, action.payload.anchor
        ).causedBy(action));
    } catch (e) {
        yield* put(commentsFutureSliceLoadFailed(receiverName, receiverPostingId).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* commentsUpdateSaga(action: CommentsUpdateAction) {
    let {receiverName, receiverPostingId, before, after} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        while (before > after) {
            const slice = yield* call(Node.getCommentsSlice, action, receiverName, receiverPostingId, after, null, 20);
            yield* put(commentsSliceUpdate(
                receiverName, receiverPostingId, slice.comments, slice.before, slice.after, slice.total,
                slice.totalInPast, slice.totalInFuture
            ).causedBy(action));
            if (after === slice.before) {
                break;
            }
            after = slice.before;
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentsBlockedUsersLoadSaga(action: WithContext<CommentsBlockedUsersLoadAction>) {
    const {homeOwnerName} = action.context;

    const {receiverName, receiverPostingId} = yield* select(state => ({
        receiverName: getCommentsReceiverName(state),
        receiverPostingId: getCommentsReceiverPostingId(state)
    }));
    if (receiverName == null || receiverPostingId == null || homeOwnerName == null) {
        yield* put(commentsBlockedUsersLoadFailed().causedBy(action));
        return;
    }

    const entryId = receiverName === homeOwnerName ? receiverPostingId : null;
    const entryNodeName = receiverName === homeOwnerName ? null : receiverName;
    const entryPostingId = receiverName === homeOwnerName ? null : receiverPostingId;

    try {
        const blocked = yield* call(Node.searchBlockedUsers, action, ":", {
            entryId,
            entryNodeName,
            entryPostingId,
            strict: true
        });
        yield* put(commentsBlockedUsersLoaded(receiverName, receiverPostingId, blocked).causedBy(action));
    } catch (e) {
        yield* put(commentsBlockedUsersLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* commentLoadSaga(action: CommentLoadAction) {
    const {commentId} = action.payload;

    const {receiverName, receiverPostingId} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        const comment = yield* call(Node.getComment, action, receiverName, receiverPostingId, commentId, false,
            ["comment.not-found"]);
        yield* put(commentSet(receiverName, comment).causedBy(action));
    } catch (e) {
        yield* put(commentLoadFailed(receiverName, receiverPostingId, commentId).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* commentPostSaga(action: CommentPostAction) {
    const {commentId, postingId, commentText, commentSourceText} = action.payload;

    const {receiverName, receiverPostingId} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        let comment;
        if (commentId == null) {
            yield* put(postingCommentCountUpdate(receiverPostingId, receiverName, 1).causedBy(action));
            const created = yield* call(Node.createComment, action, receiverName, receiverPostingId, commentText);
            yield* put(postingCommentsSet(postingId, created.total, "").causedBy(action));
            comment = created.comment;
        } else {
            comment = yield* call(Node.updateComment, action, receiverName, receiverPostingId, commentId, commentText);
        }
        yield* put(commentSet(receiverName, comment).causedBy(action));

        const draftId = yield* select((state: ClientState) =>
            (commentId == null ? state.detailedPosting.compose.draft : state.detailedPosting.commentDialog.draft)?.id);

        yield* put(commentPosted(receiverName, receiverPostingId, comment.id, comment.moment).causedBy(action));

        if (draftId != null) {
            yield* call(Node.deleteDraft, action, ":", draftId, ["draft.not-found"]);
        }

        if (receiverName !== commentText.ownerName) {
            yield* call(Node.updateRemoteComment, action, ":", receiverName, receiverPostingId, comment.id,
                commentSourceText);
        }
    } catch (e) {
        yield* put(commentPostFailed(receiverName, receiverPostingId).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* loadRemoteMediaAttachments(
    action: ClientAction, nodeName: string | null, attachments: MediaAttachment[] | null
) {
    if (attachments != null) {
        for (const attachment of attachments) {
            if (attachment.media == null && attachment.remoteMedia != null) {
                attachment.media = yield* call(Node.getPrivateMediaInfo, action, nodeName, attachment.remoteMedia.id);
            }
        }
    }
}

function* loadRepliedTo(action: ClientAction, nodeName: string, postingId: string, id: string) {
    let repliedToComment: CommentInfo | null = yield* select(state => getComment(state, id));
    if (repliedToComment == null) {
        repliedToComment = yield* call(Node.getComment, action, nodeName, postingId, id, false, ["comment.not-found"]);
    }
    if (repliedToComment != null && repliedToComment.digest != null) {
        return {
            id: repliedToComment.id,
            name: repliedToComment.ownerName,
            fullName: repliedToComment.ownerFullName,
            avatar: repliedToComment.ownerAvatar,
            heading: repliedToComment.heading,
            digest: repliedToComment.digest
        }
    } else {
        return null;
    }
}

function* commentDraftLoadSaga(action: CommentDraftLoadAction) {
    const {isDialog} = action.payload;

    const {nodeName, postingId, commentId} = yield* select((state: ClientState) => ({
        nodeName: getCommentsState(state).receiverName,
        postingId: getCommentsState(state).receiverPostingId,
        commentId: isDialog ? state.detailedPosting.commentDialog.commentId : null
    }));

    if (nodeName == null || postingId == null) {
        return;
    }

    try {
        const draftType: DraftType = commentId != null ? "comment-update" : "new-comment";
        const drafts = yield* call(Node.getDrafts, action, ":", draftType, nodeName, postingId, commentId)
        const draft = drafts.length > 0 ? drafts[0] : null;
        if (draft != null) {
            yield* call(loadRemoteMediaAttachments, action, nodeName, draft.media ?? null);
            yield* put(commentDraftLoaded(draft).causedBy(action));

            let repliedTo: RepliedTo | null = null;
            if (commentId == null && draft.repliedToId != null) {
                repliedTo = yield* call(loadRepliedTo, action, nodeName, postingId, draft.repliedToId);
            }
            if (repliedTo != null) {
                yield* put(commentRepliedToSet(
                    repliedTo.id, repliedTo.name, repliedTo.fullName ?? null, repliedTo.heading ?? ""
                ).causedBy(action));
            } else {
                yield* put(commentRepliedToUnset().causedBy(action));
            }
        } else {
            yield* put(commentDraftAbsent(nodeName, postingId, commentId).causedBy(action));
        }
    } catch (e) {
        yield* put(commentDraftLoadFailed(nodeName, postingId, commentId).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* commentDraftSaveSaga(action: CommentDraftSaveAction) {
    const {draftId, draftText, formId} = action.payload;

    if (draftText.receiverPostingId == null) {
        return;
    }

    try {
        let draft: DraftInfo;
        if (draftId == null) {
            draft = yield* call(Node.createDraft, action, ":", draftText);
        } else {
            draft = yield* call(Node.updateDraft, action, ":", draftId, draftText);
        }
        yield* put(commentDraftSaved(
            draftText.receiverName, draftText.receiverPostingId, draftText.receiverCommentId ?? null, draft, formId
        ).causedBy(action));
    } catch (e) {
        yield* put(commentDraftSaveFailed(
            draftText.receiverName, draftText.receiverPostingId, draftText.receiverCommentId ?? null
        ).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* commentDraftDeleteSaga(action: CommentDraftDeleteAction) {
    const {draft} = action.payload;

    if (draft?.id == null) {
        return;
    }

    yield* call(Node.deleteDraft, action, ":", draft.id, ["draft.not-found"]);
    if (draft.receiverPostingId != null) {
        yield* put(commentDraftDeleted(draft.receiverName, draft.receiverPostingId).causedBy(action));
    }
}

function* commentComposeCancelSaga(action: CommentComposeCancelAction) {
    const draftId = yield* select(state => state.detailedPosting.compose.draft?.id);

    if (draftId != null) {
        yield* call(Node.deleteDraft, action, ":", draftId, ["draft.not-found"]);
    }
    yield* put(commentComposeCancelled().causedBy(action));
}

function* commentDeleteSaga(action: CommentDeleteAction) {
    const {commentId} = action.payload;

    const {postingId, receiverName, receiverPostingId} = yield* select((state: ClientState) => ({
        postingId: getDetailedPostingId(state),
        receiverName: getCommentsState(state).receiverName,
        receiverPostingId: getCommentsState(state).receiverPostingId
    }));
    if (receiverName == null || receiverPostingId == null || postingId == null) {
        return;
    }
    yield* put(postingCommentCountUpdate(receiverPostingId, receiverName, -1).causedBy(action));
    try {
        const info = yield* call(Node.deleteComment, action, receiverName, receiverPostingId, commentId);
        yield* put(commentDeleted(receiverName, receiverPostingId, commentId).causedBy(action));
        yield* put(postingCommentsSet(postingId, info.total, "").causedBy(action));
        yield* call(Node.deleteRemoteComment, action, ":", receiverName, receiverPostingId, commentId);
    } catch (e) {
        yield* put(commentDeleteFailed(receiverName, receiverPostingId, commentId).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* commentSetVisibilitySaga(action: CommentSetVisibilityAction) {
    const {commentId, visible} = action.payload;

    const {
        receiverName, receiverPostingId, isOwner, ownerVisible, isSenior, seniorVisible
    } = yield* select((state: ClientState) => ({
        receiverName: getCommentsState(state).receiverName,
        receiverPostingId: getCommentsState(state).receiverPostingId,
        isOwner: isPermitted("edit", getComment(state, commentId), "owner", state),
        ownerVisible: isPrincipalIn("view", getComment(state, commentId), "public", "public", {
            useOperations: "owner"
        }),
        isSenior: isPermitted("overrideComment", getDetailedPosting(state), "owner", state),
        seniorVisible: isPrincipalIn("view", getComment(state, commentId), "unset", ["unset", "public"], {
            useOperations: "senior"
        })
    }));
    if (receiverName == null || receiverPostingId == null) {
        return;
    }

    const commentText: CommentText = {};
    if (isSenior && seniorVisible !== visible && !(isOwner && !visible)) {
        commentText.seniorOperations = {
            view: visible ? "unset" : "private"
        }
    }
    if (isOwner && ownerVisible !== visible) {
        commentText.operations = {
            view: visible ? "public" : "private"
        }
    }

    try {
        const comment = yield* call(Node.updateComment, action, receiverName, receiverPostingId, commentId, commentText);
        yield* put(commentSet(receiverName, comment).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* focusedCommentLoadSaga(action: FocusedCommentLoadAction) {
    const {receiverName, receiverPostingId, focusedCommentId} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null || focusedCommentId == null) {
        return;
    }
    try {
        const comment = yield* call(Node.getComment, action, receiverName, receiverPostingId, focusedCommentId, false,
            ["comment.not-found"]);
        yield* put(focusedCommentLoaded(receiverName, comment).causedBy(action));
    } catch (e) {
        yield* put(focusedCommentLoadFailed(receiverName, receiverPostingId).causedBy(action));
        if (!(e instanceof NodeApiError) || e.errorCode !== "comment.not-found") {
            yield* put(errorThrown(e));
        } else {
            yield* put(flashBox(i18n.t("comment-not-found")).causedBy(action));
        }
    }
}

function* commentCopyLinkSaga(action: CommentCopyLinkAction) {
    const {id, postingId} = action.payload;
    try {
        const href = yield* call(postingGetLink, action, postingId);
        yield* call(clipboardCopy, `${href}?comment=${id}`);
        if (!Browser.isAndroidBrowser()) {
            yield* put(flashBox(i18n.t("link-copied")).causedBy(action));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentDialogCommentLoadSaga(action: CommentDialogCommentLoadAction) {
    const {receiverName, receiverPostingId, commentId} = yield* select(state => ({
        receiverName: getCommentsState(state).receiverName,
        receiverPostingId: getCommentsState(state).receiverPostingId,
        commentId: getCommentDialogCommentId(state)
    }));
    if (receiverName == null || receiverPostingId == null || commentId == null) {
        return;
    }
    try {
        const comment = yield* call(Node.getComment, action, receiverName, receiverPostingId, commentId, true,
            ["comment.not-found"]);
        yield* put(commentDialogCommentLoaded(comment).causedBy(action));
    } catch (e) {
        yield* put(commentDialogCommentLoadFailed().causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* commentDialogCommentResetSaga(action: CommentDialogCommentResetAction) {
    const {draftId, closeDialog} = action.payload;

    if (closeDialog) {
        yield* put(closeCommentDialog().causedBy(action));
    }
    if (draftId != null) {
        yield* call(Node.deleteDraft, action, ":", draftId, ["draft.not-found"]);
    }
}

function* commentVerifySaga(action: CommentVerifyAction) {
    const {receiverName, receiverPostingId} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        yield* call(Node.verifyRemoteComment, action, ":", receiverName, receiverPostingId, action.payload.commentId);
    } catch (e) {
        yield* put(commentVerifyFailed(receiverName, receiverPostingId, action.payload.commentId).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* commentReactSaga(action: WithContext<CommentReactAction>) {
    const {id, negative, emoji} = action.payload;
    const {homeOwnerName, homeOwnerFullName, homeOwnerGender, homeOwnerAvatar} = action.context;

    const {seniorName, comments: {receiverName, receiverPostingId}, seniorReaction} = yield* select(state => ({
        seniorName: getDetailedPosting(state)?.ownerName,
        comments: getCommentsState(state),
        seniorReaction: getComment(state, id)?.seniorReaction
    }));
    if (receiverName == null || receiverPostingId == null || seniorName == null) {
        return;
    }
    try {
        const created = yield* call(Node.createCommentReaction, action, receiverName, receiverPostingId, id,
            {ownerName: homeOwnerName, ownerFullName: homeOwnerFullName, ownerGender: homeOwnerGender,
             ownerAvatar: toAvatarDescription(homeOwnerAvatar), negative, emoji});
        const seniorAttributes = seniorName !== homeOwnerName
            ? extractAttributes(seniorReaction)
            : {negative, emoji};
        yield* put(commentReactionSet(
            receiverName, id, receiverPostingId, {negative, emoji}, seniorAttributes, created.totals
        ).causedBy(action));
        yield* call(Node.createRemoteCommentReaction, action, ":", receiverName, receiverPostingId, id,
            {negative, emoji});
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentReactionLoadSaga(action: WithContext<CommentReactionLoadAction>) {
    const {id} = action.payload;
    const {homeOwnerName} = action.context;

    const {seniorName, comments: {receiverName, receiverPostingId}} = yield* select(state => ({
        seniorName: getDetailedPosting(state)?.ownerName,
        comments: getCommentsState(state)
    }));
    if (receiverName == null || receiverPostingId == null || seniorName == null || homeOwnerName == null) {
        return;
    }
    try {
        const reaction = extractAttributes(
            yield* call(Node.getCommentReaction, action, receiverName, receiverPostingId, id, homeOwnerName));
        const seniorReaction = extractAttributes(
            yield* call(Node.getCommentReaction, action, receiverName, receiverPostingId, id, seniorName));
        const totals = yield* call(Node.getCommentReactionTotals, action, receiverName, receiverPostingId, id);
        yield* put(commentReactionSet(
            receiverName, id, receiverPostingId, reaction, seniorReaction, totals
        ).causedBy(action));
    } catch (e) {
        if (Browser.isDevMode()) {
            yield* put(errorThrown(e));
        }
    }
}

function* commentReactionDeleteSaga(action: WithContext<CommentReactionDeleteAction>) {
    const {id} = action.payload;
    const {homeOwnerName} = action.context;

    const {seniorName, comments: {receiverName, receiverPostingId}, seniorReaction} = yield* select(state => ({
        seniorName: getDetailedPosting(state)?.ownerName,
        comments: getCommentsState(state),
        seniorReaction: getComment(state, id)?.seniorReaction
    }));
    if (receiverName == null || receiverPostingId == null || homeOwnerName == null) {
        return;
    }
    try {
        const totals = yield* call(Node.deleteCommentReaction, action, receiverName, receiverPostingId, id,
            homeOwnerName);
        const seniorAttributes = seniorName !== homeOwnerName
            ? extractAttributes(seniorReaction)
            : null;
        yield* put(commentReactionSet(
            receiverName, id, receiverPostingId, null, seniorAttributes, totals
        ).causedBy(action));
        yield* call(Node.deleteRemoteCommentReaction, action, ":", receiverName, receiverPostingId, id);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function extractAttributes(reactionInfo: ReactionInfo | null | undefined): ReactionAttributes | null {
    if (reactionInfo == null) {
        return null;
    }
    const {negative, emoji} = reactionInfo;
    return negative != null && emoji != null ? {negative, emoji} : null;
}

function* commentReplySaga(action: CommentReplyAction) {
    const {commentId, ownerName, ownerFullName, heading} = action.payload;

    const body = document.getElementById("body") as HTMLTextAreaElement | null;
    if (body == null) {
        return;
    }
    const {replied, repliedToName} = yield* select(state => ({
        replied: isCommentComposerReplied(state),
        repliedToName: getCommentComposerRepliedToName(state)
    }));
    const text = quoteHtml(getWindowSelectionHtml());
    if (body.textLength === 0 && !replied) {
        yield* put(commentRepliedToSet(commentId, ownerName, ownerFullName, heading).causedBy(action));
        if (text) {
            insertText(body, `>>>\n${text}\n>>>\n`);
        }
    } else {
        const mention = mentionName(ownerName, ownerFullName);
        if (text) {
            if (ownerName !== repliedToName) {
                insertText(body, `${mention}:\n>>>\n${text}\n>>>\n`);
            } else {
                insertText(body, `>>>\n${text}\n>>>\n`);
            }
        } else {
            insertText(body, `${mention} `);
        }
    }
    yield* put(commentsScrollToComposer().causedBy(action));
}

function* glanceCommentLoadSaga(action: GlanceCommentLoadAction) {
    const {receiverName, receiverPostingId, commentId, comment} = yield* select(
        state => {
            const comments = getCommentsState(state);
            return {
                receiverName: comments.receiverName,
                receiverPostingId: comments.receiverPostingId,
                commentId: comments.glanceCommentId,
                comment: comments.glanceCommentId != null ? getComment(state, comments.glanceCommentId) : null
            }
        }
    );

    if (receiverName == null || receiverPostingId == null || commentId == null) {
        return;
    }
    if (comment != null) {
        yield* put(glanceCommentLoaded(receiverName, comment).causedBy(action));
        return;
    }

    try {
        const comment = yield* call(Node.getComment, action, receiverName, receiverPostingId, commentId, false,
            ["comment.not-found"]);
        yield* put(glanceCommentLoaded(receiverName, comment).causedBy(action));
    } catch (e) {
        yield* put(glanceCommentLoadFailed(receiverName, receiverPostingId).causedBy(action));
        yield* put(errorThrown(e));
    }
}
