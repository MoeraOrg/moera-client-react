import { call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import { Node } from "api";
import { ReactionTotalsInfo } from "api/node/api-types";
import { errorThrown } from "state/error/actions";
import {
    EntryReactionAttributes,
    POSTING_COMMENT_ADDED_BLOCK,
    POSTING_COMMENT_ADDED_UNBLOCK,
    POSTING_COMMENTS_SUBSCRIBE,
    POSTING_COMMENTS_UNSUBSCRIBE,
    POSTING_COPY_LINK,
    POSTING_DELETE,
    POSTING_LOAD,
    POSTING_OPERATIONS_UPDATE,
    POSTING_REACT,
    POSTING_REACTION_DELETE,
    POSTING_REACTION_LOAD,
    POSTING_REACTIONS_RELOAD,
    POSTING_VERIFY,
    PostingCommentAddedBlockAction,
    postingCommentAddedBlocked,
    postingCommentAddedBlockFailed,
    PostingCommentAddedUnblockAction,
    postingCommentAddedUnblocked,
    postingCommentAddedUnblockFailed,
    PostingCommentsSubscribeAction,
    postingCommentsSubscribed,
    postingCommentsSubscribeFailed,
    PostingCommentsUnsubscribeAction,
    postingCommentsUnsubscribed,
    postingCommentsUnsubscribeFailed,
    PostingCopyLinkAction,
    PostingDeleteAction,
    postingDeleted,
    postingDeleteFailed,
    PostingLoadAction,
    postingLoadFailed,
    PostingOperationsUpdateAction,
    postingOperationsUpdated,
    PostingReactAction,
    PostingReactionDeleteAction,
    PostingReactionLoadAction,
    postingReactionSet,
    postingSet,
    postingsReactionSet,
    PostingVerifyAction,
    postingVerifyFailed
} from "state/postings/actions";
import { WithContext } from "state/action-types";
import { ClientState } from "state/state";
import { flashBox } from "state/flashbox/actions";
import {
    getPosting,
    getPostingCommentAddedInstantBlockId,
    getPostingCommentsSubscriptionId
} from "state/postings/selectors";
import { getNodeRootLocation, getOwnerName } from "state/node/selectors";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { getNodeUri } from "state/naming/sagas";
import { fillSubscription } from "state/subscriptions/sagas";
import { isConnectedToHome } from "state/home/selectors";
import { introduced } from "state/init-selectors";
import { executor } from "state/executor";
import { Browser } from "ui/browser";

export default [
    executor(POSTING_DELETE, payload => payload.id, postingDeleteSaga),
    executor(POSTING_LOAD, payload => payload.id, postingLoadSaga, introduced),
    executor(POSTING_VERIFY, payload => payload.id, postingVerifySaga),
    executor(POSTING_OPERATIONS_UPDATE, payload => payload.id, postingOperationsUpdateSaga),
    executor(POSTING_REACT, null, postingReactSaga, introduced),
    executor(POSTING_REACTION_LOAD, payload => payload.id, postingReactionLoadSaga),
    executor(POSTING_REACTIONS_RELOAD, "", postingReactionsReloadSaga),
    executor(POSTING_REACTION_DELETE, payload => payload.id, postingReactionDeleteSaga, introduced),
    executor(POSTING_COPY_LINK, payload => payload.id, postingCopyLinkSaga),
    executor(POSTING_COMMENTS_SUBSCRIBE, payload => payload.id, postingCommentsSubscribeSaga, introduced),
    executor(POSTING_COMMENTS_UNSUBSCRIBE, payload => payload.id, postingCommentsUnsubscribeSaga, introduced),
    executor(POSTING_COMMENT_ADDED_BLOCK, payload => payload.id, postingCommentAddedBlockSaga, introduced),
    executor(POSTING_COMMENT_ADDED_UNBLOCK, payload => payload.id, postingCommentAddedUnblockSaga, introduced)
];

function* postingDeleteSaga(action: PostingDeleteAction) {
    const {id, nodeName} = action.payload;
    const posting = yield* select(getPosting, id, nodeName);
    if (posting == null) {
        return;
    }
    try {
        yield* call(Node.deletePosting, nodeName, id);
        yield* put(postingDeleted(posting.id, posting.feedReferences ?? [], nodeName));
    } catch (e) {
        yield* put(postingDeleteFailed(id, nodeName));
        yield* put(errorThrown(e));
    }
}

function* postingLoadSaga(action: PostingLoadAction) {
    const {id, nodeName} = action.payload;
    try {
        const posting = yield* call(Node.getPosting, nodeName, id);
        yield* call(fillActivityReaction, posting);
        yield* put(postingSet(posting, nodeName));
        yield* call(fillSubscription, posting);
    } catch (e) {
        yield* put(postingLoadFailed(id, nodeName));
        yield* put(errorThrown(e));
    }
}

function* postingVerifySaga(action: WithContext<PostingVerifyAction>) {
    const {id, nodeName} = action.payload;
    const targetNodeName = nodeName || action.context.ownerName;
    if (targetNodeName == null) {
        yield* put(postingVerifyFailed(id, nodeName));
        return;
    }
    try {
        yield* call(Node.remotePostingVerify, ":", targetNodeName, id);
    } catch (e) {
        yield* put(postingVerifyFailed(id, nodeName));
        yield* put(errorThrown(e));
    }
}

function* postingOperationsUpdateSaga(action: PostingOperationsUpdateAction) {
    const {id, nodeName, operations} = action.payload;
    try {
        const data = yield* call(Node.putPosting, nodeName, id, {operations});
        yield* put(postingOperationsUpdated(id, nodeName, data.operations ?? {}));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* postingReactSaga(action: PostingReactAction) {
    const {id, negative, emoji, nodeName} = action.payload;
    try {
        const data = yield* call(Node.postPostingReaction, nodeName, id, negative, emoji);
        yield* put(postingReactionSet(id, {negative, emoji}, data.totals, nodeName));
        const {ownerName, posting} = yield* select(state => ({
            ownerName: getOwnerName(state),
            posting: getPosting(state, id, nodeName)
        }));
        if (ownerName != null && posting != null) {
            yield* call(Node.postRemotePostingReaction, ":", posting.receiverName ?? (nodeName || ownerName),
                posting.receiverPostingId ?? id, negative, emoji);
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* postingReactionLoadSaga(action: PostingReactionLoadAction) {
    const {id, nodeName} = action.payload;
    try {
        const {negative, emoji} = yield* call(Node.getPostingReaction, nodeName, id);
        const reaction = negative != null && emoji != null ? {negative, emoji} : null;
        const totals = yield* call(Node.getPostingReactionTotals, nodeName, id);
        yield* put(postingReactionSet(id, reaction, totals, nodeName));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* postingReactionsReloadSaga() {
    const {postingsState, connectedToHome} = yield* select((state: ClientState) => ({
        postingsState: state.postings,
        connectedToHome: isConnectedToHome(state)
    }));
    for (const nodeName of Object.keys(postingsState)) {
        const ids = Object.keys(postingsState[nodeName] ?? {});
        if (connectedToHome) {
            const infos = yield* call(Node.searchPostingReactions, nodeName, ids);
            const reactions = infos
                .map(info => ({entryId: info.postingId, negative: info.negative, emoji: info.emoji}))
                .filter((attr): attr is EntryReactionAttributes => attr.negative != null && attr.emoji != null);
            const totals = yield* call(Node.searchPostingReactionTotals, nodeName, ids);
            put(postingsReactionSet(reactions, totals, nodeName));
        } else {
            const totals = ids
                .map(id => postingsState[nodeName]![id]!.posting.reactions)
                .filter((ts): ts is ReactionTotalsInfo => ts != null);
            put(postingsReactionSet([], totals, nodeName))
        }
    }
}

function* postingReactionDeleteSaga(action: PostingReactionDeleteAction) {
    const {id, nodeName} = action.payload;
    try {
        let totals = yield* call(Node.deletePostingReaction, nodeName, id);
        const {ownerName, posting} = yield* select(state => ({
            ownerName: getOwnerName(state),
            posting: getPosting(state, id)
        }));
        if (ownerName == null || posting == null) {
            return;
        }
        if (posting.receiverName != null && posting.receiverPostingId != null) {
            totals = yield* call(Node.deletePostingReaction, posting.receiverName, posting.receiverPostingId);
        }
        yield* put(postingReactionSet(id, null, totals, nodeName));
        yield* call(Node.deleteRemotePostingReaction, ":", posting.receiverName ?? (nodeName || ownerName),
            posting.receiverPostingId ?? id);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

export function* postingGetLink(id: string, nodeName: string = "") {
    const posting = yield* select(getPosting, id, nodeName);
    const targetNode = posting?.receiverName != null ? posting.receiverName : nodeName;
    if (targetNode && posting?.receiverDeletedAt == null) {
        const nodeUri = yield* call(getNodeUri, targetNode);
        return `${nodeUri}/post/${posting?.receiverPostingId ?? id}`;
    } else {
        const rootLocation = yield* select(getNodeRootLocation);
        return `${rootLocation}/moera/post/${id}`;
    }
}

function* postingCopyLinkSaga(action: PostingCopyLinkAction) {
    const {id, nodeName} = action.payload;
    try {
        const href = yield* call(postingGetLink, id, nodeName);
        yield* call(clipboardCopy, href);
        if (Browser.userAgentOs !== "android" || window.Android) {
            yield* put(flashBox(i18n.t("link-copied")));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* postingCommentsSubscribeSaga(action: PostingCommentsSubscribeAction) {
    const {id, nodeName} = action.payload;
    const {posting, ownerName} = yield* select(state => ({
        posting: getPosting(state, id),
        ownerName: getOwnerName(state)
    }));
    if (posting == null || ownerName == null) {
        yield* put(postingCommentsSubscribeFailed(id, nodeName));
        return;
    }
    const targetNode = posting.receiverName ?? (nodeName || ownerName);
    const postingId = posting.receiverPostingId ?? id;
    try {
        const subscription = yield* call(Node.postPostingCommentsSubscription, ":", targetNode, postingId);
        yield* put(postingCommentsSubscribed(id, subscription.id, nodeName));
    } catch (e) {
        yield* put(postingCommentsSubscribeFailed(id, nodeName));
        yield* put(errorThrown(e));
    }
}

function* postingCommentsUnsubscribeSaga(action: PostingCommentsUnsubscribeAction) {
    const {id, nodeName} = action.payload;
    const {posting, ownerName, subscriptionId} = yield* select(state => ({
        posting: getPosting(state, id),
        ownerName: getOwnerName(state),
        subscriptionId: getPostingCommentsSubscriptionId(state, id)
    }));
    if (posting == null || ownerName == null) {
        yield* put(postingCommentsUnsubscribeFailed(id, nodeName));
        return;
    }
    try {
        if (subscriptionId != null) {
            yield* call(Node.deleteSubscription, ":", subscriptionId);
        }
        yield* put(postingCommentsUnsubscribed(id, nodeName));
    } catch (e) {
        yield* put(postingCommentsUnsubscribeFailed(id, nodeName));
        yield* put(errorThrown(e));
    }
}

function* postingCommentAddedBlockSaga(action: PostingCommentAddedBlockAction) {
    const {id, nodeName} = action.payload;
    const {posting} = yield* select(state => ({
        posting: getPosting(state, id)
    }));
    if (posting == null) {
        yield* put(postingCommentAddedBlockFailed(id, nodeName));
        return;
    }
    const postingId = posting.receiverPostingId ?? id;
    try {
        const blockedInstant = yield* call(Node.postBlockedInstant, ":",
            {storyType: "comment-added" as const, entryId: postingId});
        yield* put(postingCommentAddedBlocked(id, blockedInstant.id, nodeName));
    } catch (e) {
        yield* put(postingCommentAddedBlockFailed(id, nodeName));
        yield* put(errorThrown(e));
    }
}

function* postingCommentAddedUnblockSaga(action: PostingCommentAddedUnblockAction) {
    const {id, nodeName} = action.payload;
    const {posting, instantBlockId} = yield* select(state => ({
        posting: getPosting(state, id),
        instantBlockId: getPostingCommentAddedInstantBlockId(state, id)
    }));
    if (posting == null) {
        yield* put(postingCommentAddedUnblockFailed(id, nodeName));
        return;
    }
    try {
        if (instantBlockId != null) {
            yield* call(Node.deleteBlockedInstant, ":", instantBlockId);
        }
        yield* put(postingCommentAddedUnblocked(id, nodeName));
    } catch (e) {
        yield* put(postingCommentAddedUnblockFailed(id, nodeName));
        yield* put(errorThrown(e));
    }
}
