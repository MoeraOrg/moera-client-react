import { call, put, select } from 'typed-redux-saga/macro';
import clipboardCopy from 'clipboard-copy';
import * as textFieldEdit from 'text-field-edit';

import { Node, NodeApiError } from "api";
import { errorThrown } from "state/error/actions";
import {
    CANCEL_COMMENT_DIALOG,
    CancelCommentDialogAction,
    closeCommentDialog,
    COMMENT_COMPOSE_CANCEL,
    COMMENT_COPY_LINK,
    COMMENT_DELETE,
    COMMENT_DIALOG_COMMENT_LOAD,
    COMMENT_DRAFT_LOAD,
    COMMENT_DRAFT_SAVE,
    COMMENT_LOAD,
    COMMENT_POST,
    COMMENT_REACT,
    COMMENT_REACTION_DELETE,
    COMMENT_REACTION_LOAD,
    COMMENT_REPLY,
    COMMENT_VERIFY,
    CommentComposeCancelAction,
    CommentCopyLinkAction,
    CommentDeleteAction,
    commentDeleted,
    commentDeleteFailed,
    commentDialogCommentLoaded,
    commentDialogCommentLoadFailed,
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
    CommentReplyAction,
    COMMENTS_FUTURE_SLICE_LOAD,
    COMMENTS_LOAD_ALL,
    COMMENTS_PAST_SLICE_LOAD,
    COMMENTS_RECEIVER_SWITCH,
    COMMENTS_UPDATE,
    commentSet,
    commentsFutureSliceLoadFailed,
    commentsFutureSliceSet,
    commentsPastSliceLoadFailed,
    commentsPastSliceSet,
    commentsReceiverSwitched,
    commentsScrollToComposer,
    commentsSliceUpdate,
    CommentVerifyAction,
    commentVerifyFailed,
    DETAILED_POSTING_LOAD,
    detailedPostingLoaded,
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
    getCommentsState,
    getDetailedPosting,
    getDetailedPostingId,
    isCommentComposerReplied
} from "state/detailedposting/selectors";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { postingCommentsSet } from "state/postings/actions";
import { getOwnerFullName, getOwnerName } from "state/owner/selectors";
import { flashBox } from "state/flashbox/actions";
import { postingGetLink } from "state/postings/sagas";
import { fillSubscription } from "state/subscriptions/sagas";
import { getWindowSelectionHtml, mentionName } from "util/misc";
import { quoteHtml } from "util/html";
import { Browser } from "ui/browser";
import { introduce } from "api/node/introduce";
import { executor } from "state/executor";
import { ClientState } from "state/state";
import { DraftInfo } from "api/node/api-types";

export default [
    executor(DETAILED_POSTING_LOAD, "", introduce(detailedPostingLoadSaga)),
    executor(COMMENTS_RECEIVER_SWITCH, "", introduce(commentsReceiverSwitchSaga)),
    executor(COMMENTS_LOAD_ALL, "", introduce(commentsLoadAllSaga)),
    executor(COMMENTS_PAST_SLICE_LOAD, "", introduce(commentsPastSliceLoadSaga)),
    executor(COMMENTS_FUTURE_SLICE_LOAD, "", introduce(commentsFutureSliceLoadSaga)),
    executor(COMMENTS_UPDATE, "", introduce(commentsUpdateSaga)),
    executor(COMMENT_LOAD, payload => payload.commentId, introduce(commentLoadSaga)),
    executor(COMMENT_POST, null, commentPostSaga),
    executor(COMMENT_DRAFT_LOAD, "", commentDraftLoadSaga),
    executor(COMMENT_DRAFT_SAVE, "", commentDraftSaveSaga),
    executor(COMMENT_COMPOSE_CANCEL, "", commentComposeCancelSaga),
    executor(COMMENT_DELETE, payload => payload.commentId, commentDeleteSaga),
    executor(FOCUSED_COMMENT_LOAD, "", focusedCommentLoadSaga),
    executor(COMMENT_COPY_LINK, null, commentCopyLinkSaga),
    executor(COMMENT_DIALOG_COMMENT_LOAD, "", commentDialogCommentLoadSaga),
    executor(CANCEL_COMMENT_DIALOG, "", cancelCommentDialogSaga),
    executor(COMMENT_VERIFY, payload => payload.commentId, commentVerifySaga),
    executor(COMMENT_REACT, null, introduce(commentReactSaga)),
    executor(
        COMMENT_REACTION_LOAD,
        payload => `${payload.id}:${payload.postingId}`,
        introduce(commentReactionLoadSaga)
    ),
    executor(
        COMMENT_REACTION_DELETE,
        payload => `${payload.id}:${payload.postingId}`,
        introduce(commentReactionDeleteSaga)
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
        const data = yield* call(Node.getPosting, "", id);
        yield* call(fillActivityReaction, data)
        yield* call(fillSubscription, data)
        yield* put(detailedPostingLoaded(data));
    } catch (e) {
        yield* put(detailedPostingLoadFailed());
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
    const {commentId, postingId, draftId, commentText, commentSourceText} = action.payload;

    const {receiverName, receiverPostingId} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        let comment;
        if (commentId == null) {
            const data = yield* call(Node.postComment, receiverName, receiverPostingId, commentText);
            yield* put(postingCommentsSet(postingId, data.total));
            comment = data.comment;
        } else {
            comment = yield* call(Node.putComment, receiverName, receiverPostingId, commentId, commentText);
        }
        yield* put(commentSet(receiverName, comment));
        yield* put(commentPosted(receiverName, receiverPostingId, comment.id, comment.moment));
        if (draftId != null) {
            yield* call(Node.deleteDraft, ":", draftId);
        }
        yield* call(Node.putRemoteComment, ":", receiverName, receiverPostingId, comment.id, commentSourceText);
    } catch (e) {
        yield* put(commentPostFailed(receiverName, receiverPostingId));
        yield* put(errorThrown(e));
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
        const data = commentId != null
            ? yield* call(Node.getDraftCommentUpdate, ":", nodeName, postingId, commentId)
            : yield* call(Node.getDraftNewComment, ":", nodeName, postingId);
        if (data != null) {
            if (data.media != null) {
                for (const attachment of data.media) {
                    if (attachment.media == null && attachment.remoteMedia != null) {
                        attachment.media = yield* call(Node.getMediaPrivateInfo, nodeName, attachment.remoteMedia.id);
                    }
                }
            }
            yield* put(commentDraftLoaded(data));
        } else {
            yield* put(commentDraftLoadFailed(nodeName, postingId, commentId));
        }
    } catch (e) {
        yield* put(commentDraftLoadFailed(nodeName, postingId, commentId));
        yield* put(errorThrown(e));
    }
}

function* commentDraftSaveSaga(action: CommentDraftSaveAction) {
    const {draftId, draftText} = action.payload;

    if (draftText.receiverPostingId == null) {
        return;
    }

    try {
        let data: DraftInfo;
        if (draftId == null) {
            data = yield* call(Node.postDraft, ":", draftText);
        } else {
            data = yield* call(Node.putDraft, ":", draftId, draftText);
        }
        yield* put(commentDraftSaved(draftText.receiverName, draftText.receiverPostingId,
            draftText.receiverCommentId ?? null, data));
    } catch (e) {
        yield* put(commentDraftSaveFailed(draftText.receiverName, draftText.receiverPostingId,
            draftText.receiverCommentId ?? null));
        yield* put(errorThrown(e));
    }
}

function* commentComposeCancelSaga(action: CommentComposeCancelAction) {
    const {draftId} = action.payload;

    if (draftId != null) {
        yield* call(Node.deleteDraft, ":", draftId);
    }
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
            yield* put(flashBox("Comment not found"));
        }
    }
}

function* commentCopyLinkSaga(action: CommentCopyLinkAction) {
    const {id, postingId} = action.payload;
    try {
        const href = yield* call(postingGetLink, postingId);
        yield* call(clipboardCopy, `${href}?comment=${id}`);
        if (Browser.userAgentOs !== "android" || window.Android) {
            yield* put(flashBox("Link copied to the clipboard"));
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
        const draft = yield* call(Node.getDraftCommentUpdate, ":", receiverName, receiverPostingId, commentId);
        if (draft != null) {
            yield* put(commentDraftLoaded(draft));
            //...but load the original comment also
        }
        const comment = yield* call(Node.getComment, receiverName, receiverPostingId, commentId, true);
        yield* put(commentDialogCommentLoaded(comment));
    } catch (e) {
        yield* put(commentDialogCommentLoadFailed());
        yield* put(errorThrown(e));
    }
}

function* cancelCommentDialogSaga(action: CancelCommentDialogAction) {
    const {draftId} = action.payload;

    yield* put(closeCommentDialog());
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

function* commentReactSaga(action: CommentReactAction) {
    const {id, negative, emoji} = action.payload;

    const {receiverName, receiverPostingId} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        const data = yield* call(Node.postCommentReaction, receiverName, receiverPostingId, id, negative, emoji);
        yield* put(commentReactionSet(receiverName, id, receiverPostingId, {negative, emoji}, data.totals));
        yield* call(Node.postRemoteCommentReaction, ":", receiverName, receiverPostingId, id, negative, emoji);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentReactionLoadSaga(action: CommentReactionLoadAction) {
    const {id} = action.payload;

    const {receiverName, receiverPostingId} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        const {negative, emoji} = yield* call(Node.getCommentReaction, receiverName, receiverPostingId, id);
        const reaction = negative != null && emoji != null ? {negative, emoji} : null;
        const totals = yield* call(Node.getCommentReactionTotals, receiverName, receiverPostingId, id);
        yield* put(commentReactionSet(receiverName, id, receiverPostingId, reaction, totals));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* commentReactionDeleteSaga(action: CommentReactionDeleteAction) {
    const {id} = action.payload;

    const {receiverName, receiverPostingId} = yield* select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        const data = yield* call(Node.deleteCommentReaction, receiverName, receiverPostingId, id);
        yield* put(commentReactionSet(receiverName, id, receiverPostingId, null, data));
        yield* call(Node.deleteRemoteCommentReaction, ":", receiverName, receiverPostingId, id);
    } catch (e) {
        yield* put(errorThrown(e));
    }
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
            textFieldEdit.insert(body, `>>>\n${text}\n>>>\n`);
        }
    } else {
        const mention = mentionName(ownerName, ownerFullName);
        if (text) {
            if (ownerName !== repliedToName) {
                textFieldEdit.insert(body, `${mention}:\n>>>\n${text}\n>>>\n`);
            } else {
                textFieldEdit.insert(body, `>>>\n${text}\n>>>\n`);
            }
        } else {
            textFieldEdit.insert(body, `${mention} `);
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
