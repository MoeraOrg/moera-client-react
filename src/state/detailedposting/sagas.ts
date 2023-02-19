import { call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import { Node, NodeApiError } from "api";
import {
    CommentInfo,
    CommentText,
    DraftInfo,
    MediaAttachment,
    PrivateMediaFileInfo,
    ReactionAttributes,
    ReactionInfo,
    RepliedTo
} from "api/node/api-types";
import { WithContext } from "state/action-types";
import { executor } from "state/executor";
import { introduced } from "state/init-selectors";
import { errorThrown } from "state/error/actions";
import {
    closeCommentDialog,
    COMMENT_COMPOSE_CANCEL,
    COMMENT_COPY_LINK,
    COMMENT_DELETE,
    COMMENT_DIALOG_COMMENT_LOAD,
    COMMENT_DIALOG_COMMENT_RESET,
    COMMENT_DRAFT_DELETE,
    COMMENT_DRAFT_LOAD,
    COMMENT_DRAFT_SAVE,
    COMMENT_LOAD,
    COMMENT_POST,
    COMMENT_REACT,
    COMMENT_REACTION_DELETE,
    COMMENT_REACTION_LOAD,
    COMMENT_REPLY,
    COMMENT_SET_VISIBILITY,
    COMMENT_VERIFY,
    commentComposeCancelled,
    CommentCopyLinkAction,
    CommentDeleteAction,
    commentDeleted,
    commentDeleteFailed,
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
    COMMENTS_BLOCKED_USERS_LOAD,
    COMMENTS_FUTURE_SLICE_LOAD,
    COMMENTS_LOAD_ALL,
    COMMENTS_PAST_SLICE_LOAD,
    COMMENTS_RECEIVER_FEATURES_LOAD,
    COMMENTS_RECEIVER_SWITCH,
    COMMENTS_UPDATE,
    CommentsBlockedUsersLoadAction,
    commentsBlockedUsersLoaded,
    commentsBlockedUsersLoadFailed,
    commentSet,
    CommentSetVisibilityAction,
    commentsFutureSliceLoadFailed,
    commentsFutureSliceSet,
    commentsPastSliceLoadFailed,
    commentsPastSliceSet,
    commentsReceiverFeaturesLoaded,
    commentsReceiverSwitched,
    commentsScrollToComposer,
    commentsSliceUpdate,
    CommentVerifyAction,
    commentVerifyFailed,
    DETAILED_POSTING_LOAD,
    DETAILED_POSTING_LOAD_ATTACHED,
    detailedPostingLoaded,
    detailedPostingLoadedAttached,
    detailedPostingLoadFailed,
    FOCUSED_COMMENT_LOAD,
    focusedCommentLoaded,
    focusedCommentLoadFailed,
    GLANCE_COMMENT_LOAD,
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
import { Browser } from "ui/browser";
import { getWindowSelectionHtml, insertText, mentionName } from "util/misc";
import { quoteHtml } from "util/html";

export default [
    executor(DETAILED_POSTING_LOAD, "", detailedPostingLoadSaga, introduced),
    executor(DETAILED_POSTING_LOAD_ATTACHED, "", detailedPostingLoadAttachedSaga, introduced),
    executor(COMMENTS_RECEIVER_SWITCH, "", commentsReceiverSwitchSaga, introduced),
    executor(COMMENTS_RECEIVER_FEATURES_LOAD, payload => payload.nodeName, commentsReceiverFeaturesLoadSaga, introduced),
    executor(COMMENTS_LOAD_ALL, "", commentsLoadAllSaga, introduced),
    executor(COMMENTS_PAST_SLICE_LOAD, "", commentsPastSliceLoadSaga, introduced),
    executor(COMMENTS_FUTURE_SLICE_LOAD, "", commentsFutureSliceLoadSaga, introduced),
    executor(COMMENTS_UPDATE, "", commentsUpdateSaga, introduced),
    executor(COMMENTS_BLOCKED_USERS_LOAD, "", commentsBlockedUsersLoadSaga, introduced),
    executor(COMMENT_LOAD, payload => payload.commentId, commentLoadSaga, introduced),
    executor(COMMENT_POST, null, commentPostSaga),
    executor(COMMENT_DRAFT_LOAD, "", commentDraftLoadSaga),
    executor(COMMENT_DRAFT_SAVE, "", commentDraftSaveSaga),
    executor(COMMENT_DRAFT_DELETE, "", commentDraftDeleteSaga),
    executor(COMMENT_COMPOSE_CANCEL, "", commentComposeCancelSaga),
    executor(COMMENT_DELETE, payload => payload.commentId, commentDeleteSaga),
    executor(COMMENT_SET_VISIBILITY, payload => payload.commentId, commentSetVisibilitySaga),
    executor(FOCUSED_COMMENT_LOAD, "", focusedCommentLoadSaga),
    executor(COMMENT_COPY_LINK, null, commentCopyLinkSaga),
    executor(COMMENT_DIALOG_COMMENT_LOAD, "", commentDialogCommentLoadSaga),
    executor(COMMENT_DIALOG_COMMENT_RESET, "", commentDialogCommentResetSaga),
    executor(COMMENT_VERIFY, payload => payload.commentId, commentVerifySaga),
    executor(COMMENT_REACT, null, commentReactSaga, introduced),
    executor(
        COMMENT_REACTION_LOAD,
        payload => `${payload.id}:${payload.postingId}`,
        commentReactionLoadSaga,
        introduced
    ),
    executor(
        COMMENT_REACTION_DELETE,
        payload => `${payload.id}:${payload.postingId}`,
        commentReactionDeleteSaga,
        introduced
    ),
    executor(COMMENT_REPLY, "", commentReplySaga),
    executor(GLANCE_COMMENT_LOAD, null, glanceCommentLoadSaga)
];

function* detailedPostingLoadSaga() {
    const id = yield* select(getDetailedPostingId);
    if (id == null) {
        yield* put(detailedPostingLoadFailed());
        return;
    }

    try {
        const posting = yield* call(Node.getPosting, "", id);
        yield* call(fillActivityReaction, posting)
        yield* call(fillBlockedOperations, posting)
        yield* put(detailedPostingLoaded(posting));
        yield* call(fillSubscription, posting)
    } catch (e) {
        yield* put(detailedPostingLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* detailedPostingLoadAttachedSaga() {
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
        yield* put(detailedPostingLoadedAttached());
        return;
    }

    try {
        const postings = yield* call(Node.getPostingAttached, "", id);
        yield* call(fillActivityReactionsInPostings, postings);
        yield* call(fillBlockedOperationsInPostings, postings);
        yield* put(postingsSet(postings, ""));
        yield* put(detailedPostingLoadedAttached());
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentsReceiverSwitchSaga() {
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
    yield* put(commentsReceiverSwitched(receiverName, receiverFullName, receiverPostingId));
}

function* commentsReceiverFeaturesLoadSaga() {
    const nodeName = yield* select(getCommentsReceiverName);
    if (nodeName == null) {
        return;
    }
    try {
        const features = yield* call(Node.getFeatures, nodeName);
        yield* put(commentsReceiverFeaturesLoaded(nodeName, features));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentsLoadAllSaga() {
    let {receiverName, receiverPostingId, before, after} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        while (after > Number.MIN_SAFE_INTEGER) {
            const data = yield* call(Node.getCommentsSlice, receiverName, receiverPostingId, null, after, 20);
            yield* put(commentsPastSliceSet(receiverName, receiverPostingId, data.comments, data.before, data.after,
                data.total, data.totalInPast, data.totalInFuture));
            after = data.after;
        }
        while (before < Number.MAX_SAFE_INTEGER) {
            const data = yield* call(Node.getCommentsSlice, receiverName, receiverPostingId, before, null, 20);
            yield* put(commentsFutureSliceSet(receiverName, receiverPostingId, data.comments, data.before, data.after,
                data.total, data.totalInPast, data.totalInFuture));
            before = data.before;
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentsPastSliceLoadSaga() {
    const {receiverName, receiverPostingId, after} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        yield* put(commentsPastSliceLoadFailed(receiverName, receiverPostingId));
        return;
    }
    try {
        const data = yield* call(Node.getCommentsSlice, receiverName, receiverPostingId, null, after, 20);
        yield* put(commentsPastSliceSet(receiverName, receiverPostingId, data.comments, data.before, data.after,
            data.total, data.totalInPast, data.totalInFuture));
    } catch (e) {
        yield* put(commentsPastSliceLoadFailed(receiverName, receiverPostingId));
        yield* put(errorThrown(e));
    }
}

function* commentsFutureSliceLoadSaga() {
    const {receiverName, receiverPostingId, before} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        yield* put(commentsFutureSliceLoadFailed(receiverName, receiverPostingId));
        return;
    }
    try {
        const data = yield* call(Node.getCommentsSlice, receiverName, receiverPostingId, before, null, 20);
        yield* put(commentsFutureSliceSet(receiverName, receiverPostingId, data.comments, data.before, data.after,
            data.total, data.totalInPast, data.totalInFuture));
    } catch (e) {
        yield* put(commentsFutureSliceLoadFailed(receiverName, receiverPostingId));
        yield* put(errorThrown(e));
    }
}

function* commentsUpdateSaga() {
    let {receiverName, receiverPostingId, before, after} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        while (before > after) {
            const data = yield* call(Node.getCommentsSlice, receiverName, receiverPostingId, after, null, 20);
            yield* put(commentsSliceUpdate(receiverName, receiverPostingId, data.comments, data.before, data.after,
                data.total, data.totalInPast, data.totalInFuture));
            if (after === data.before) {
                break;
            }
            after = data.before;
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
        yield* put(commentsBlockedUsersLoadFailed());
        return;
    }

    const entryId = receiverName === homeOwnerName ? receiverPostingId : null;
    const entryNodeName = receiverName === homeOwnerName ? null : receiverName;
    const entryPostingId = receiverName === homeOwnerName ? null : receiverPostingId;

    try {
        const blocked = yield* call(Node.searchBlockedUsers, ":", {entryId, entryNodeName, entryPostingId});
        yield* put(commentsBlockedUsersLoaded(receiverName, receiverPostingId, blocked));
    } catch (e) {
        yield* put(commentsBlockedUsersLoadFailed());
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
        const data = yield* call(Node.getComment, receiverName, receiverPostingId, commentId);
        yield* put(commentSet(receiverName, data));
    } catch (e) {
        yield* put(commentLoadFailed(receiverName, receiverPostingId, commentId));
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
            yield* put(postingCommentCountUpdate(receiverPostingId, receiverName, 1));
            const data = yield* call(Node.postComment, receiverName, receiverPostingId, commentText);
            yield* put(postingCommentsSet(postingId, data.total));
            comment = data.comment;
        } else {
            comment = yield* call(Node.putComment, receiverName, receiverPostingId, commentId, commentText);
        }
        yield* put(commentSet(receiverName, comment));

        const draftId = yield* select((state: ClientState) =>
            (commentId == null ? state.detailedPosting.compose.draft : state.detailedPosting.commentDialog.draft)?.id);

        yield* put(commentPosted(receiverName, receiverPostingId, comment.id, comment.moment));

        if (draftId != null) {
            yield* call(Node.deleteDraft, ":", draftId);
        }

        if (receiverName !== commentText.ownerName) {
            yield* call(Node.putRemoteComment, ":", receiverName, receiverPostingId, comment.id, commentSourceText);
        }
    } catch (e) {
        yield* put(commentPostFailed(receiverName, receiverPostingId));
        yield* put(errorThrown(e));
    }
}

function* loadRemoteMediaAttachments(nodeName: string | null, attachments: MediaAttachment[] | null) {
    if (attachments != null) {
        for (const attachment of attachments) {
            if (attachment.media == null && attachment.remoteMedia != null) {
                attachment.media = yield* call(Node.getMediaPrivateInfo, nodeName, attachment.remoteMedia.id);
            }
        }
    }
}

function* loadRepliedTo(nodeName: string, postingId: string, id: string) {
    let repliedToComment: CommentInfo | null = yield* select(state => getComment(state, id));
    if (repliedToComment == null) {
        repliedToComment = yield* call(Node.getComment, nodeName, postingId, id);
    }
    if (repliedToComment != null) {
        return {
            id: repliedToComment.id,
            name: repliedToComment.ownerName,
            fullName: repliedToComment.ownerFullName,
            avatar: repliedToComment.ownerAvatar,
            heading: repliedToComment.heading
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
        const draft: DraftInfo | null = commentId != null
            ? yield* call(Node.getDraftCommentUpdate, ":", nodeName, postingId, commentId)
            : yield* call(Node.getDraftNewComment, ":", nodeName, postingId);
        if (draft != null) {
            yield* call(loadRemoteMediaAttachments, nodeName, draft.media ?? null);
            yield* put(commentDraftLoaded(draft));

            let repliedTo: RepliedTo | null = null;
            if (commentId == null && draft.repliedToId != null) {
                repliedTo = yield* call(loadRepliedTo, nodeName, postingId, draft.repliedToId);
            }
            if (repliedTo != null) {
                yield* put(commentRepliedToSet(repliedTo.id, repliedTo.name, repliedTo.fullName ?? null,
                    repliedTo.heading ?? ""));
            } else {
                yield* put(commentRepliedToUnset());
            }
        } else {
            yield* put(commentDraftAbsent(nodeName, postingId, commentId));
        }
    } catch (e) {
        yield* put(commentDraftLoadFailed(nodeName, postingId, commentId));
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
            draft = yield* call(Node.postDraft, ":", draftText);
        } else {
            draft = yield* call(Node.putDraft, ":", draftId, draftText);
        }
        yield* put(commentDraftSaved(draftText.receiverName, draftText.receiverPostingId,
            draftText.receiverCommentId ?? null, draft, formId));
    } catch (e) {
        yield* put(commentDraftSaveFailed(draftText.receiverName, draftText.receiverPostingId,
            draftText.receiverCommentId ?? null));
        yield* put(errorThrown(e));
    }
}

function* commentDraftDeleteSaga(action: CommentDraftDeleteAction) {
    const {draft} = action.payload;

    if (draft?.id == null) {
        return;
    }

    yield* call(Node.deleteDraft, ":", draft.id);
    if (draft.receiverPostingId != null) {
        yield* put(commentDraftDeleted(draft.receiverName, draft.receiverPostingId));
    }
}

function* commentComposeCancelSaga() {
    const draftId = yield* select(state => state.detailedPosting.compose.draft?.id);

    if (draftId != null) {
        yield* call(Node.deleteDraft, ":", draftId);
    }
    yield* put(commentComposeCancelled());
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
    yield* put(postingCommentCountUpdate(receiverPostingId, receiverName, -1));
    try {
        const data = yield* call(Node.deleteComment, receiverName, receiverPostingId, commentId);
        yield* put(commentDeleted(receiverName, receiverPostingId, commentId));
        yield* put(postingCommentsSet(postingId, data.total));
        yield* call(Node.deleteRemoteComment, ":", receiverName, receiverPostingId, commentId);
    } catch (e) {
        yield* put(commentDeleteFailed(receiverName, receiverPostingId, commentId));
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
        const comment = yield* call(Node.putComment, receiverName, receiverPostingId, commentId, commentText);
        yield* put(commentSet(receiverName, comment));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* focusedCommentLoadSaga() {
    const {receiverName, receiverPostingId, focusedCommentId} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null || focusedCommentId == null) {
        return;
    }
    try {
        const data = yield* call(Node.getComment, receiverName, receiverPostingId, focusedCommentId);
        yield* put(focusedCommentLoaded(receiverName, data));
    } catch (e) {
        yield* put(focusedCommentLoadFailed(receiverName, receiverPostingId));
        if (!(e instanceof NodeApiError) || e.errorCode !== "comment.not-found") {
            yield* put(errorThrown(e));
        } else {
            yield* put(flashBox(i18n.t("comment-not-found")));
        }
    }
}

function* commentCopyLinkSaga(action: CommentCopyLinkAction) {
    const {id, postingId} = action.payload;
    try {
        const href = yield* call(postingGetLink, postingId);
        yield* call(clipboardCopy, `${href}?comment=${id}`);
        if (Browser.userAgentOs !== "android" || window.Android) {
            yield* put(flashBox(i18n.t("link-copied")));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentDialogCommentLoadSaga() {
    const {receiverName, receiverPostingId, commentId} = yield* select(state => ({
        receiverName: getCommentsState(state).receiverName,
        receiverPostingId: getCommentsState(state).receiverPostingId,
        commentId: getCommentDialogCommentId(state)
    }));
    if (receiverName == null || receiverPostingId == null || commentId == null) {
        return;
    }
    try {
        const comment = yield* call(Node.getComment, receiverName, receiverPostingId, commentId, true);
        yield* put(commentDialogCommentLoaded(comment));
    } catch (e) {
        yield* put(commentDialogCommentLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* commentDialogCommentResetSaga(action: CommentDialogCommentResetAction) {
    const {draftId, closeDialog} = action.payload;

    if (closeDialog) {
        yield* put(closeCommentDialog());
    }
    if (draftId != null) {
        yield* call(Node.deleteDraft, ":", draftId);
    }
}

function* commentVerifySaga(action: CommentVerifyAction) {
    const {receiverName, receiverPostingId} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        yield* call(Node.remoteCommentVerify, ":", receiverName, receiverPostingId, action.payload.commentId);
    } catch (e) {
        yield* put(commentVerifyFailed(receiverName, receiverPostingId, action.payload.commentId));
        yield* put(errorThrown(e));
    }
}

function* commentReactSaga(action: WithContext<CommentReactAction>) {
    const {id, negative, emoji} = action.payload;

    const {seniorName, comments: {receiverName, receiverPostingId}, seniorReaction} = yield* select(state => ({
        seniorName: getDetailedPosting(state)?.ownerName,
        comments: getCommentsState(state),
        seniorReaction: getComment(state, id)?.seniorReaction
    }));
    if (receiverName == null || receiverPostingId == null || seniorName == null) {
        return;
    }
    try {
        const data = yield* call(Node.postCommentReaction, receiverName, receiverPostingId, id, negative, emoji);
        const seniorAttributes = seniorName !== action.context.homeOwnerName
            ? extractAttributes(seniorReaction)
            : {negative, emoji};
        yield* put(commentReactionSet(receiverName, id, receiverPostingId, {negative, emoji},
            seniorAttributes, data.totals));
        yield* call(Node.postRemoteCommentReaction, ":", receiverName, receiverPostingId, id, negative, emoji);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentReactionLoadSaga(action: CommentReactionLoadAction) {
    const {id} = action.payload;

    const {seniorName, comments: {receiverName, receiverPostingId}} = yield* select(state => ({
        seniorName: getDetailedPosting(state)?.ownerName,
        comments: getCommentsState(state)
    }));
    if (receiverName == null || receiverPostingId == null || seniorName == null) {
        return;
    }
    try {
        const reaction = extractAttributes(yield* call(Node.getCommentReaction, receiverName, receiverPostingId, id));
        const seniorReaction = extractAttributes(
            yield* call(Node.getCommentReaction, receiverName, receiverPostingId, id, seniorName));
        const totals = yield* call(Node.getCommentReactionTotals, receiverName, receiverPostingId, id);
        yield* put(commentReactionSet(receiverName, id, receiverPostingId, reaction, seniorReaction, totals));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentReactionDeleteSaga(action: WithContext<CommentReactionDeleteAction>) {
    const {id} = action.payload;

    const {seniorName, comments: {receiverName, receiverPostingId}, seniorReaction} = yield* select(state => ({
        seniorName: getDetailedPosting(state)?.ownerName,
        comments: getCommentsState(state),
        seniorReaction: getComment(state, id)?.seniorReaction
    }));
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        const totals = yield* call(Node.deleteCommentReaction, receiverName, receiverPostingId, id);
        const seniorAttributes = seniorName !== action.context.homeOwnerName
            ? extractAttributes(seniorReaction)
            : null;
        yield* put(commentReactionSet(receiverName, id, receiverPostingId, null, seniorAttributes, totals));
        yield* call(Node.deleteRemoteCommentReaction, ":", receiverName, receiverPostingId, id);
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
        yield* put(commentRepliedToSet(commentId, ownerName, ownerFullName, heading));
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
    yield* put(commentsScrollToComposer());
}

function* glanceCommentLoadSaga() {
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
        yield* put(glanceCommentLoaded(receiverName, comment));
        return;
    }

    try {
        const data = yield* call(Node.getComment, receiverName, receiverPostingId, commentId);
        yield* put(glanceCommentLoaded(receiverName, data));
    } catch (e) {
        yield* put(glanceCommentLoadFailed(receiverName, receiverPostingId));
        yield* put(errorThrown(e));
    }
}
