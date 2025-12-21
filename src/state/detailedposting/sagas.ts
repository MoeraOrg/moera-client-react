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
    ReactionAttributes,
    ReactionInfo,
    RepliedTo
} from "api";
import { WithContext } from "state/action-types";
import { executor } from "state/executor";
import { barrier, dispatch, select } from "state/store-sagas";
import { homeIntroduced } from "state/init-barriers";
import { errorThrown } from "state/error/actions";
import { ClientAction } from "state/action";
import {
    closeCommentDialog,
    CommentComposeCancelAction,
    commentComposeCancelled,
    CommentCopyLinkAction,
    CommentDeleteAction,
    commentDeleted,
    commentDeleteFailed,
    CommentDialogCommentLoadAction,
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
    CommentDraftSavedAction,
    commentDraftSaveFailed,
    commentLoad,
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
    CommentSetVisibilityAction,
    CommentsFutureSliceLoadAction,
    commentsFutureSliceLoadFailed,
    commentsFutureSliceSet,
    CommentsLoadAllAction,
    CommentsPastSliceLoadAction,
    commentsPastSliceLoadFailed,
    commentsPastSliceSet,
    CommentsReceiverFeaturesLoadAction,
    commentsReceiverFeaturesLoaded,
    CommentsReceiverSwitchAction,
    commentsReceiverSwitched,
    commentsScrollToComposer,
    commentsSliceUpdate,
    CommentsUpdateAction,
    CommentVerifyAction,
    commentVerifyFailed,
    DetailedPostingLoadAction,
    DetailedPostingLoadAttachedAction,
    detailedPostingLoaded,
    detailedPostingLoadedAttached,
    detailedPostingLoadFailed,
    FocusedCommentLoadAction,
    focusedCommentLoaded,
    focusedCommentLoadFailed,
    GlanceCommentLoadAction,
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
import { getPosting, isPostingCached } from "state/postings/selectors";
import { postingGetLink } from "state/postings/sagas";
import { getOwnerFullName, getOwnerName, isPermitted, isPrincipalIn } from "state/node/selectors";
import { flashBox } from "state/flashbox/actions";
import { fillSubscription } from "state/subscriptions/sagas";
import * as Browser from "ui/browser";
import { uiEventCommentQuote } from "ui/ui-events";
import { toAvatarDescription } from "util/avatar";
import { getWindowSelectionHtml } from "util/ui";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import { delay, notNull } from "util/misc";
import { ut } from "util/url";

export default [
    executor("DETAILED_POSTING_LOAD", "", detailedPostingLoadSaga),
    executor("DETAILED_POSTING_LOAD_ATTACHED", "", detailedPostingLoadAttachedSaga),
    executor("COMMENTS_RECEIVER_SWITCH", "", commentsReceiverSwitchSaga),
    executor("COMMENTS_RECEIVER_FEATURES_LOAD", "", commentsReceiverFeaturesLoadSaga),
    executor("COMMENTS_LOAD_ALL", "", commentsLoadAllSaga),
    executor("COMMENTS_PAST_SLICE_LOAD", "", commentsPastSliceLoadSaga),
    executor("COMMENTS_FUTURE_SLICE_LOAD", "", commentsFutureSliceLoadSaga),
    executor("COMMENTS_UPDATE", "", commentsUpdateSaga),
    executor("COMMENTS_BLOCKED_USERS_LOAD", "", commentsBlockedUsersLoadSaga),
    executor("COMMENT_LOAD", payload => payload.commentId, commentLoadSaga),
    executor("COMMENT_POST", null, commentPostSaga),
    executor("COMMENT_DRAFT_LOAD", "", commentDraftLoadSaga),
    executor("COMMENT_DRAFT_SAVE", null, commentDraftSaveSaga),
    executor("COMMENT_DRAFT_DELETE", "", commentDraftDeleteSaga),
    executor("COMMENT_COMPOSE_CANCEL", "", commentComposeCancelSaga),
    executor("COMMENT_DELETE", payload => payload.commentId, commentDeleteSaga),
    executor("COMMENT_SET_VISIBILITY", payload => payload.commentId, commentSetVisibilitySaga),
    executor("FOCUSED_COMMENT_LOAD", "", focusedCommentLoadSaga),
    executor("COMMENT_COPY_LINK", null, commentCopyLinkSaga),
    executor("COMMENT_DIALOG_COMMENT_LOAD", "", commentDialogCommentLoadSaga),
    executor("COMMENT_DIALOG_COMMENT_RESET", "", commentDialogCommentResetSaga),
    executor("COMMENT_VERIFY", payload => payload.commentId, commentVerifySaga),
    executor("COMMENT_REACT", null, commentReactSaga),
    executor("COMMENT_REACTION_LOAD", payload => `${payload.id}:${payload.postingId}`, commentReactionLoadSaga),
    executor("COMMENT_REACTION_DELETE", payload => `${payload.id}:${payload.postingId}`, commentReactionDeleteSaga),
    executor("COMMENT_REPLY", "", commentReplySaga),
    executor("GLANCE_COMMENT_LOAD", null, glanceCommentLoadSaga)
];

async function detailedPostingLoadSaga(action: WithContext<DetailedPostingLoadAction>): Promise<void> {
    await homeIntroduced();
    const id = select(getDetailedPostingId);
    if (id == null) {
        dispatch(detailedPostingLoadFailed().causedBy(action));
        return;
    }

    try {
        const posting = await Node.getPosting(action, REL_CURRENT, id, false, ["posting.not-found"]);
        await fillActivityReaction(action, posting);
        await fillBlockedOperations(action, posting);
        dispatch(detailedPostingLoaded(posting).causedBy(action));
        await fillSubscription(action, posting);
    } catch (e) {
        dispatch(detailedPostingLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function detailedPostingLoadAttachedSaga(action: WithContext<DetailedPostingLoadAttachedAction>): Promise<void> {
    await homeIntroduced();
    const id = select(getDetailedPostingId);
    if (id == null) {
        return;
    }
    const loaded = select(state => {
        const media = getPosting(state, id, REL_CURRENT)?.media;
        if (media == null) {
            return true;
        }
        return media
            .map(ma => ma.media)
            .filter(notNull)
            .map(m => m.postingId)
            .filter(notNull)
            .every(p => isPostingCached(state, p, REL_CURRENT));
    });
    if (loaded) {
        dispatch(detailedPostingLoadedAttached().causedBy(action));
        return;
    }

    try {
        const postings = await Node.getPostingsAttachedToPosting(action, REL_CURRENT, id);
        await fillActivityReactionsInPostings(action, postings);
        await fillBlockedOperationsInPostings(action, postings);
        dispatch(postingsSet(postings, REL_CURRENT).causedBy(action));
        dispatch(detailedPostingLoadedAttached().causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function commentsReceiverSwitchSaga(action: CommentsReceiverSwitchAction): Promise<void> {
    await homeIntroduced();
    const {ownerName, ownerFullName, posting} = select(state => ({
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
    dispatch(commentsReceiverSwitched(receiverName, receiverFullName, receiverPostingId).causedBy(action));
}

async function commentsReceiverFeaturesLoadSaga(
    action: WithContext<CommentsReceiverFeaturesLoadAction>
): Promise<void> {
    await homeIntroduced();
    const nodeName = select(getCommentsReceiverName);
    if (nodeName == null) {
        return;
    }
    try {
        const features = await Node.getFeatures(action, nodeName);
        dispatch(commentsReceiverFeaturesLoaded(nodeName, features).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function commentsLoadAllSaga(action: WithContext<CommentsLoadAllAction>): Promise<void> {
    await homeIntroduced();
    let {receiverName, receiverPostingId, before, after} = select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        while (after > Number.MIN_SAFE_INTEGER) {
            const slice = await Node.getCommentsSlice(action, receiverName, receiverPostingId, null, after, 20);
            dispatch(commentsPastSliceSet(
                receiverName, receiverPostingId, slice.comments, slice.before, slice.after, slice.total,
                slice.totalInPast, slice.totalInFuture, null
            ).causedBy(action));
            after = slice.after;
        }
        while (before < Number.MAX_SAFE_INTEGER) {
            const slice = await Node.getCommentsSlice(action, receiverName, receiverPostingId, before, null, 20);
            dispatch(commentsFutureSliceSet(
                receiverName, receiverPostingId, slice.comments, slice.before, slice.after, slice.total,
                slice.totalInPast, slice.totalInFuture, null
            ).causedBy(action));
            before = slice.before;
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function commentsPastSliceLoadSaga(action: WithContext<CommentsPastSliceLoadAction>): Promise<void> {
    await homeIntroduced();
    const {receiverName, receiverPostingId, after} = select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        dispatch(commentsPastSliceLoadFailed(receiverName, receiverPostingId).causedBy(action));
        return;
    }
    try {
        const slice = await Node.getCommentsSlice(action, receiverName, receiverPostingId, null, after, 20);
        dispatch(commentsPastSliceSet(
            receiverName, receiverPostingId, slice.comments, slice.before, slice.after, slice.total,
            slice.totalInPast, slice.totalInFuture, action.payload.anchor
        ).causedBy(action));
    } catch (e) {
        dispatch(commentsPastSliceLoadFailed(receiverName, receiverPostingId).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function commentsFutureSliceLoadSaga(action: WithContext<CommentsFutureSliceLoadAction>): Promise<void> {
    await homeIntroduced();
    const {receiverName, receiverPostingId, before} = select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        dispatch(commentsFutureSliceLoadFailed(receiverName, receiverPostingId).causedBy(action));
        return;
    }
    try {
        const slice = await Node.getCommentsSlice(action, receiverName, receiverPostingId, before, null, 20);
        dispatch(commentsFutureSliceSet(
            receiverName, receiverPostingId, slice.comments, slice.before, slice.after, slice.total, slice.totalInPast,
            slice.totalInFuture, action.payload.anchor
        ).causedBy(action));
    } catch (e) {
        dispatch(commentsFutureSliceLoadFailed(receiverName, receiverPostingId).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function commentsUpdateSaga(action: WithContext<CommentsUpdateAction>): Promise<void> {
    await homeIntroduced();
    let {receiverName, receiverPostingId, before, after} = select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        while (before > after) {
            const slice = await Node.getCommentsSlice(action, receiverName, receiverPostingId, after, null, 20);
            dispatch(commentsSliceUpdate(
                receiverName, receiverPostingId, slice.comments, slice.before, slice.after, slice.total,
                slice.totalInPast, slice.totalInFuture
            ).causedBy(action));
            if (after === slice.before) {
                break;
            }
            after = slice.before;
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function commentsBlockedUsersLoadSaga(action: WithContext<CommentsBlockedUsersLoadAction>): Promise<void> {
    await homeIntroduced();
    const {homeOwnerName} = action.context;

    const {receiverName, receiverPostingId} = select(state => ({
        receiverName: getCommentsReceiverName(state),
        receiverPostingId: getCommentsReceiverPostingId(state)
    }));
    if (receiverName == null || receiverPostingId == null || homeOwnerName == null) {
        dispatch(commentsBlockedUsersLoadFailed().causedBy(action));
        return;
    }

    const entryId = receiverName === homeOwnerName ? receiverPostingId : null;
    const entryNodeName = receiverName === homeOwnerName ? null : receiverName;
    const entryPostingId = receiverName === homeOwnerName ? null : receiverPostingId;

    try {
        const blocked = await Node.searchBlockedUsers(action, REL_HOME, {
            entryId,
            entryNodeName,
            entryPostingId,
            strict: true
        });
        dispatch(commentsBlockedUsersLoaded(receiverName, receiverPostingId, blocked).causedBy(action));
    } catch (e) {
        dispatch(commentsBlockedUsersLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function commentLoadSaga(action: WithContext<CommentLoadAction>): Promise<void> {
    await homeIntroduced();
    const {commentId} = action.payload;

    const {receiverName, receiverPostingId} = select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        const comment = await Node.getComment(
            action, receiverName, receiverPostingId, commentId, false, ["comment.not-found"]
        );
        dispatch(commentSet(receiverName, comment).causedBy(action));
    } catch (e) {
        dispatch(commentLoadFailed(receiverName, receiverPostingId, commentId).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function commentPostSaga(action: WithContext<CommentPostAction>): Promise<void> {
    const {commentId, postingId, commentText, commentSourceText, formId} = action.payload;

    const {receiverName, receiverPostingId} = select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        let comment;
        if (commentId == null) {
            dispatch(postingCommentCountUpdate(receiverPostingId, receiverName, 1).causedBy(action));
            const created = await Node.createComment(action, receiverName, receiverPostingId, commentText);
            dispatch(postingCommentsSet(postingId, created.total, REL_CURRENT).causedBy(action));
            comment = created.comment;
        } else {
            comment = await Node.updateComment(action, receiverName, receiverPostingId, commentId, commentText);
        }
        dispatch(commentSet(receiverName, comment).causedBy(action));

        const draftId = select(state =>
            (commentId == null ? state.detailedPosting.compose.draft : state.detailedPosting.commentDialog.draft)?.id
        );

        dispatch(commentPosted(receiverName, receiverPostingId, comment.id, comment.moment, formId).causedBy(action));

        if (draftId != null) {
            await Node.deleteDraft(action, REL_HOME, draftId, ["draft.not-found"]);
        } else {
            deleteObsoleteDraft(receiverName, receiverPostingId, commentId, formId);
        }

        if (receiverName !== commentText.ownerName) {
            await Node.updateRemoteComment(
                action, REL_HOME, receiverName, receiverPostingId, comment.id, commentSourceText
            );
        }

        if (comment.signature == null) {
            refreshComment(receiverName, receiverPostingId, comment.id);
        }
    } catch (e) {
        dispatch(commentPostFailed(receiverName, receiverPostingId).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function deleteObsoleteDraft(
    nodeName: string, postingId: string, commentId: string | null, formId: number | null
): Promise<void> {
    const action = await barrier<CommentDraftSavedAction>("COMMENT_DRAFT_SAVED", true, 5000);
    if (
        action == null
        || action.payload.nodeName !== nodeName
        || action.payload.postingId !== postingId
        || action.payload.commentId !== commentId
        || action.payload.formId !== formId
    ) {
        return;
    }
    await Node.deleteDraft(action, REL_HOME, action.payload.draft.id, ["draft.not-found"]);
}

async function refreshComment(commentReceiverName: string, commentPostingId: string, commentId: string): Promise<void> {
    await delay(3000);

    const {receiverName, receiverPostingId} = select(getCommentsState);
    if (commentReceiverName !== receiverName || commentPostingId !== receiverPostingId) {
        return;
    }

    const comment = select(state => getComment(state, commentId));
    if (comment != null && comment.signature == null) {
        dispatch(commentLoad(commentId));
    }
}

async function loadRemoteMediaAttachments(
    action: WithContext<ClientAction>, nodeName: string, attachments: MediaAttachment[] | null
): Promise<void> {
    if (attachments != null) {
        for (const attachment of attachments) {
            if (attachment.media == null && attachment.remoteMedia != null) {
                attachment.media = await Node.getPrivateMediaInfo(action, nodeName, attachment.remoteMedia.id);
            }
        }
    }
}

async function loadRepliedTo(
    action: WithContext<ClientAction>, nodeName: string, postingId: string, id: string
): Promise<RepliedTo | null> {
    let repliedToComment: CommentInfo | null = select(state => getComment(state, id));
    if (repliedToComment == null) {
        repliedToComment = await Node.getComment(action, nodeName, postingId, id, false, ["comment.not-found"]);
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

async function commentDraftLoadSaga(action: WithContext<CommentDraftLoadAction>): Promise<void> {
    const {isDialog} = action.payload;

    const {nodeName, postingId, commentId} = select(state => ({
        nodeName: getCommentsState(state).receiverName,
        postingId: getCommentsState(state).receiverPostingId,
        commentId: isDialog ? state.detailedPosting.commentDialog.commentId : null
    }));

    if (nodeName == null || postingId == null) {
        return;
    }

    try {
        const draftType: DraftType = commentId != null ? "comment-update" : "new-comment";
        const drafts = await Node.getDrafts(action, REL_HOME, draftType, nodeName, postingId, commentId)
        const draft = drafts.length > 0 ? drafts[0] : null;
        if (draft != null) {
            await loadRemoteMediaAttachments(action, nodeName, draft.media ?? null);
            dispatch(commentDraftLoaded(draft).causedBy(action));

            let repliedTo: RepliedTo | null = null;
            if (commentId == null && draft.repliedToId != null) {
                repliedTo = await loadRepliedTo(action, nodeName, postingId, draft.repliedToId);
            }
            if (repliedTo != null) {
                dispatch(commentRepliedToSet(
                    repliedTo.id, repliedTo.name, repliedTo.fullName ?? null, repliedTo.heading ?? ""
                ).causedBy(action));
            } else {
                dispatch(commentRepliedToUnset().causedBy(action));
            }
        } else {
            dispatch(commentDraftAbsent(nodeName, postingId, commentId).causedBy(action));
        }
    } catch (e) {
        dispatch(commentDraftLoadFailed(nodeName, postingId, commentId).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function commentDraftSaveSaga(action: WithContext<CommentDraftSaveAction>): Promise<void> {
    const {draftId, draftText, formId} = action.payload;

    if (draftText.receiverPostingId == null) {
        return;
    }

    try {
        let draft: DraftInfo;
        if (draftId == null) {
            draft = await Node.createDraft(action, REL_HOME, draftText);
        } else {
            draft = await Node.updateDraft(action, REL_HOME, draftId, draftText, ["draft.not-found"]);
        }
        dispatch(commentDraftSaved(
            draftText.receiverName, draftText.receiverPostingId, draftText.receiverCommentId ?? null, draft, formId
        ).causedBy(action));
    } catch (e) {
        dispatch(commentDraftSaveFailed(
            draftText.receiverName, draftText.receiverPostingId, draftText.receiverCommentId ?? null
        ).causedBy(action));
        if (!(e instanceof NodeApiError)) {
            dispatch(errorThrown(e));
        }
    }
}

async function commentDraftDeleteSaga(action: WithContext<CommentDraftDeleteAction>): Promise<void> {
    const {draft} = action.payload;

    if (draft?.id == null) {
        return;
    }

    await Node.deleteDraft(action, REL_HOME, draft.id, ["draft.not-found"]);
    if (draft.receiverPostingId != null) {
        dispatch(commentDraftDeleted(draft.receiverName, draft.receiverPostingId).causedBy(action));
    }
}

async function commentComposeCancelSaga(action: WithContext<CommentComposeCancelAction>): Promise<void> {
    const draftId = select(state => state.detailedPosting.compose.draft?.id);

    if (draftId != null) {
        await Node.deleteDraft(action, REL_HOME, draftId, ["draft.not-found"]);
    }
    dispatch(commentComposeCancelled().causedBy(action));
}

async function commentDeleteSaga(action: WithContext<CommentDeleteAction>): Promise<void> {
    const {commentId} = action.payload;

    const {postingId, receiverName, receiverPostingId} = select(state => ({
        postingId: getDetailedPostingId(state),
        receiverName: getCommentsState(state).receiverName,
        receiverPostingId: getCommentsState(state).receiverPostingId
    }));
    if (receiverName == null || receiverPostingId == null || postingId == null) {
        return;
    }
    dispatch(postingCommentCountUpdate(receiverPostingId, receiverName, -1).causedBy(action));
    try {
        const info = await Node.deleteComment(action, receiverName, receiverPostingId, commentId);
        dispatch(commentDeleted(receiverName, receiverPostingId, commentId).causedBy(action));
        dispatch(postingCommentsSet(postingId, info.total, REL_CURRENT).causedBy(action));
        await Node.deleteRemoteComment(action, REL_HOME, receiverName, receiverPostingId, commentId);
    } catch (e) {
        dispatch(commentDeleteFailed(receiverName, receiverPostingId, commentId).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function commentSetVisibilitySaga(action: WithContext<CommentSetVisibilityAction>): Promise<void> {
    const {commentId, visible} = action.payload;

    const {
        receiverName, receiverPostingId, isOwner, ownerVisible, isSenior, seniorVisible
    } = select(state => ({
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
        const comment = await Node.updateComment(action, receiverName, receiverPostingId, commentId, commentText);
        dispatch(commentSet(receiverName, comment).causedBy(action));
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function focusedCommentLoadSaga(action: WithContext<FocusedCommentLoadAction>): Promise<void> {
    const {receiverName, receiverPostingId, focusedCommentId} = select(getCommentsState);
    if (receiverName == null || receiverPostingId == null || focusedCommentId == null) {
        return;
    }
    try {
        const comment = await Node.getComment(action, receiverName, receiverPostingId, focusedCommentId, false,
            ["comment.not-found"]);
        dispatch(focusedCommentLoaded(receiverName, comment).causedBy(action));
    } catch (e) {
        dispatch(focusedCommentLoadFailed(receiverName, receiverPostingId).causedBy(action));
        if (!(e instanceof NodeApiError) || e.errorCode !== "comment.not-found") {
            dispatch(errorThrown(e));
        } else {
            dispatch(flashBox(i18n.t("comment-not-found")).causedBy(action));
        }
    }
}

async function commentCopyLinkSaga(action: WithContext<CommentCopyLinkAction>): Promise<void> {
    const {id, postingId} = action.payload;
    try {
        const href = await postingGetLink(action, postingId, REL_CURRENT);
        await clipboardCopy(href + ut`?comment=${id}`);
        if (!Browser.isAndroidBrowser()) {
            dispatch(flashBox(i18n.t("link-copied")).causedBy(action));
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function commentDialogCommentLoadSaga(action: WithContext<CommentDialogCommentLoadAction>): Promise<void> {
    const {receiverName, receiverPostingId, commentId} = select(state => ({
        receiverName: getCommentsState(state).receiverName,
        receiverPostingId: getCommentsState(state).receiverPostingId,
        commentId: getCommentDialogCommentId(state)
    }));
    if (receiverName == null || receiverPostingId == null || commentId == null) {
        return;
    }
    try {
        const comment = await Node.getComment(
            action, receiverName, receiverPostingId, commentId, true, ["comment.not-found"]
        );
        dispatch(commentDialogCommentLoaded(comment).causedBy(action));
    } catch (e) {
        dispatch(commentDialogCommentLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function commentDialogCommentResetSaga(action: WithContext<CommentDialogCommentResetAction>): Promise<void> {
    const {draftId, closeDialog} = action.payload;

    if (closeDialog) {
        dispatch(closeCommentDialog().causedBy(action));
    }
    if (draftId != null) {
        await Node.deleteDraft(action, REL_HOME, draftId, ["draft.not-found"]);
    }
}

async function commentVerifySaga(action: WithContext<CommentVerifyAction>): Promise<void> {
    const {receiverName, receiverPostingId} = select(getCommentsState);
    if (receiverName == null || receiverPostingId == null) {
        return;
    }
    try {
        await Node.verifyRemoteComment(action, REL_HOME, receiverName, receiverPostingId, action.payload.commentId);
    } catch (e) {
        dispatch(commentVerifyFailed(receiverName, receiverPostingId, action.payload.commentId).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function commentReactSaga(action: WithContext<CommentReactAction>): Promise<void> {
    await homeIntroduced();
    const {id, negative, emoji} = action.payload;
    const {homeOwnerName, homeOwnerFullName, homeOwnerGender, homeOwnerAvatar} = action.context;

    const {seniorName, comments: {receiverName, receiverPostingId}, seniorReaction} = select(state => ({
        seniorName: getDetailedPosting(state)?.ownerName,
        comments: getCommentsState(state),
        seniorReaction: getComment(state, id)?.seniorReaction
    }));
    if (receiverName == null || receiverPostingId == null || seniorName == null) {
        return;
    }
    try {
        const created = await Node.createCommentReaction(
            action, receiverName, receiverPostingId, id, {
                ownerName: homeOwnerName, ownerFullName: homeOwnerFullName, ownerGender: homeOwnerGender,
                ownerAvatar: toAvatarDescription(homeOwnerAvatar), negative, emoji
            }
        );
        const seniorAttributes = seniorName !== homeOwnerName
            ? extractAttributes(seniorReaction)
            : {negative, emoji};
        dispatch(commentReactionSet(
            receiverName, id, receiverPostingId, {negative, emoji}, seniorAttributes, created.totals
        ).causedBy(action));
        await Node.createRemoteCommentReaction(
            action, REL_HOME, receiverName, receiverPostingId, id, {negative, emoji}
        );
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function commentReactionLoadSaga(action: WithContext<CommentReactionLoadAction>): Promise<void> {
    await homeIntroduced();
    const {id} = action.payload;
    const {homeOwnerName} = action.context;

    const {seniorName, comments: {receiverName, receiverPostingId}} = select(state => ({
        seniorName: getDetailedPosting(state)?.ownerName,
        comments: getCommentsState(state)
    }));
    if (receiverName == null || receiverPostingId == null || seniorName == null || homeOwnerName == null) {
        return;
    }
    try {
        const reaction = extractAttributes(
            await Node.getCommentReaction(action, receiverName, receiverPostingId, id, homeOwnerName));
        const seniorReaction = extractAttributes(
            await Node.getCommentReaction(action, receiverName, receiverPostingId, id, seniorName));
        const totals = await Node.getCommentReactionTotals(action, receiverName, receiverPostingId, id);
        dispatch(commentReactionSet(
            receiverName, id, receiverPostingId, reaction, seniorReaction, totals
        ).causedBy(action));
    } catch (e) {
        if (Browser.isDevMode()) {
            dispatch(errorThrown(e));
        }
    }
}

async function commentReactionDeleteSaga(action: WithContext<CommentReactionDeleteAction>): Promise<void> {
    await homeIntroduced();
    const {id} = action.payload;
    const {homeOwnerName} = action.context;

    const {seniorName, comments: {receiverName, receiverPostingId}, seniorReaction} = select(state => ({
        seniorName: getDetailedPosting(state)?.ownerName,
        comments: getCommentsState(state),
        seniorReaction: getComment(state, id)?.seniorReaction
    }));
    if (receiverName == null || receiverPostingId == null || homeOwnerName == null) {
        return;
    }
    try {
        const totals = await Node.deleteCommentReaction(action, receiverName, receiverPostingId, id,
            homeOwnerName);
        const seniorAttributes = seniorName !== homeOwnerName
            ? extractAttributes(seniorReaction)
            : null;
        dispatch(commentReactionSet(
            receiverName, id, receiverPostingId, null, seniorAttributes, totals
        ).causedBy(action));
        await Node.deleteRemoteCommentReaction(action, REL_HOME, receiverName, receiverPostingId, id);
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

function extractAttributes(reactionInfo: ReactionInfo | null | undefined): ReactionAttributes | null {
    if (reactionInfo == null) {
        return null;
    }
    const {negative, emoji} = reactionInfo;
    return negative != null && emoji != null ? {negative, emoji} : null;
}

function commentReplySaga(action: CommentReplyAction): void {
    const {commentId, ownerName, ownerFullName, heading} = action.payload;

    const {replied, repliedToName} = select(state => ({
        replied: isCommentComposerReplied(state),
        repliedToName: getCommentComposerRepliedToName(state)
    }));

    const html = getWindowSelectionHtml();

    if (!replied) {
        dispatch(commentRepliedToSet(commentId, ownerName, ownerFullName, heading).causedBy(action));
        document.dispatchEvent(uiEventCommentQuote(html || undefined));
    } else {
        if (html) {
            if (ownerName !== repliedToName) {
                document.dispatchEvent(uiEventCommentQuote(html, ownerName, ownerFullName));
            } else {
                document.dispatchEvent(uiEventCommentQuote(html));
            }
        } else {
            document.dispatchEvent(uiEventCommentQuote(undefined, ownerName, ownerFullName));
        }
    }
    dispatch(commentsScrollToComposer().causedBy(action));
}

async function glanceCommentLoadSaga(action: WithContext<GlanceCommentLoadAction>): Promise<void> {
    const {receiverName, receiverPostingId, commentId, comment} = select(
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
        dispatch(glanceCommentLoaded(receiverName, comment).causedBy(action));
        return;
    }

    try {
        const comment = await Node.getComment(
            action, receiverName, receiverPostingId, commentId, false, ["comment.not-found"]
        );
        dispatch(glanceCommentLoaded(receiverName, comment).causedBy(action));
    } catch (e) {
        dispatch(glanceCommentLoadFailed(receiverName, receiverPostingId).causedBy(action));
        dispatch(errorThrown(e));
    }
}
