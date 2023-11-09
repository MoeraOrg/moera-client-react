import { call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import { Node, ReactionTotalsInfo } from "api";
import { errorThrown } from "state/error/actions";
import { ClientAction } from "state/action";
import {
    EntryReactionAttributes,
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
    PostingReactionsReloadAction,
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
import { fillBlockedOperations } from "state/blockedoperations/sagas";
import { getNodeUri } from "state/naming/sagas";
import { fillSubscription } from "state/subscriptions/sagas";
import { isConnectedToHome } from "state/home/selectors";
import { introduced } from "state/init-selectors";
import { executor } from "state/executor";
import { Browser } from "ui/browser";
import { toAvatarDescription } from "util/avatar";

export default [
    executor("POSTING_DELETE", payload => payload.id, postingDeleteSaga),
    executor("POSTING_LOAD", payload => payload.id, postingLoadSaga, introduced),
    executor("POSTING_VERIFY", payload => payload.id, postingVerifySaga),
    executor("POSTING_OPERATIONS_UPDATE", payload => payload.id, postingOperationsUpdateSaga),
    executor("POSTING_REACT", null, postingReactSaga, introduced),
    executor("POSTING_REACTION_LOAD", payload => payload.id, postingReactionLoadSaga),
    executor("POSTING_REACTIONS_RELOAD", "", postingReactionsReloadSaga),
    executor("POSTING_REACTION_DELETE", payload => payload.id, postingReactionDeleteSaga, introduced),
    executor("POSTING_COPY_LINK", payload => payload.id, postingCopyLinkSaga),
    executor("POSTING_COMMENTS_SUBSCRIBE", payload => payload.id, postingCommentsSubscribeSaga, introduced),
    executor("POSTING_COMMENTS_UNSUBSCRIBE", payload => payload.id, postingCommentsUnsubscribeSaga, introduced),
    executor("POSTING_COMMENT_ADDED_BLOCK", payload => payload.id, postingCommentAddedBlockSaga, introduced),
    executor("POSTING_COMMENT_ADDED_UNBLOCK", payload => payload.id, postingCommentAddedUnblockSaga, introduced)
];

function* postingDeleteSaga(action: PostingDeleteAction) {
    const {id, nodeName} = action.payload;
    const posting = yield* select(getPosting, id, nodeName);
    if (posting == null) {
        return;
    }
    try {
        yield* call(Node.deletePosting, action, nodeName, id);
        yield* put(postingDeleted(posting.id, posting.feedReferences ?? [], nodeName).causedBy(action));
    } catch (e) {
        yield* put(postingDeleteFailed(id, nodeName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* postingLoadSaga(action: PostingLoadAction) {
    const {id, nodeName} = action.payload;
    try {
        const posting = yield* call(Node.getPosting, action, nodeName, id, false, ["posting.not-found"]);
        yield* call(fillActivityReaction, action, posting);
        yield* call(fillBlockedOperations, action, posting);
        yield* put(postingSet(posting, nodeName).causedBy(action));
        yield* call(fillSubscription, action, posting);
    } catch (e) {
        yield* put(postingLoadFailed(id, nodeName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* postingVerifySaga(action: WithContext<PostingVerifyAction>) {
    const {id, nodeName} = action.payload;
    const targetNodeName = nodeName || action.context.ownerName;
    if (targetNodeName == null) {
        yield* put(postingVerifyFailed(id, nodeName).causedBy(action));
        return;
    }
    try {
        yield* call(Node.verifyRemotePosting, action, ":", targetNodeName, id);
    } catch (e) {
        yield* put(postingVerifyFailed(id, nodeName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* postingOperationsUpdateSaga(action: PostingOperationsUpdateAction) {
    const {id, nodeName, operations} = action.payload;
    try {
        const posting = yield* call(Node.updatePosting, action, nodeName, id, {operations});
        yield* put(postingOperationsUpdated(id, nodeName, posting.operations ?? {}).causedBy(action));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* postingReactSaga(action: WithContext<PostingReactAction>) {
    const {id, negative, emoji, nodeName} = action.payload;
    const {ownerName, homeOwnerName, homeOwnerFullName, homeOwnerGender, homeOwnerAvatar} = action.context;
    try {
        const created = yield* call(Node.createPostingReaction, action, nodeName, id, {
            ownerName: homeOwnerName, ownerFullName: homeOwnerFullName, ownerGender: homeOwnerGender,
            ownerAvatar: toAvatarDescription(homeOwnerAvatar), negative, emoji
        });
        yield* put(postingReactionSet(id, {negative, emoji}, created.totals, nodeName).causedBy(action));
        const posting = yield* select(state => getPosting(state, id, nodeName));
        if (ownerName != null && posting != null) {
            yield* call(Node.createRemotePostingReaction, action, ":", posting.receiverName ?? (nodeName || ownerName),
                posting.receiverPostingId ?? id, {negative, emoji});
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* postingReactionLoadSaga(action: WithContext<PostingReactionLoadAction>) {
    const {id, nodeName} = action.payload;
    const {homeOwnerName} = action.context;
    try {
        let reaction = null;
        if (homeOwnerName != null) {
            const {negative, emoji} = yield* call(Node.getPostingReaction, action, nodeName, id, homeOwnerName);
            reaction = negative != null && emoji != null ? {negative, emoji} : null;
        }
        const totals = yield* call(Node.getPostingReactionTotals, action, nodeName, id);
        yield* put(postingReactionSet(id, reaction, totals, nodeName).causedBy(action));
    } catch (e) {
        if (Browser.isDevMode()) {
            yield* put(errorThrown(e));
        }
    }
}

function* postingReactionsReloadSaga(action: WithContext<PostingReactionsReloadAction>) {
    const {homeOwnerName} = action.context;
    const {postingsState, connectedToHome} = yield* select((state: ClientState) => ({
        postingsState: state.postings,
        connectedToHome: isConnectedToHome(state)
    }));
    for (const nodeName of Object.keys(postingsState)) {
        const ids = Object.keys(postingsState[nodeName] ?? {});
        if (connectedToHome) {
            const infos = yield* call(Node.searchPostingReactions, action, nodeName, {ownerName: homeOwnerName, ids});
            const reactions = infos
                .map(info => ({entryId: info.postingId, negative: info.negative, emoji: info.emoji}))
                .filter((attr): attr is EntryReactionAttributes => attr.negative != null && attr.emoji != null);
            const totals = yield* call(Node.searchPostingReactionTotals, action, nodeName, {postings: ids});
            put(postingsReactionSet(reactions, totals, nodeName).causedBy(action));
        } else {
            const totals = ids
                .map(id => postingsState[nodeName]![id]!.posting.reactions)
                .filter((ts): ts is ReactionTotalsInfo => ts != null);
            put(postingsReactionSet([], totals, nodeName).causedBy(action))
        }
    }
}

function* postingReactionDeleteSaga(action: WithContext<PostingReactionDeleteAction>) {
    const {id, nodeName} = action.payload;
    const {ownerName, homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    try {
        let totals = yield* call(Node.deletePostingReaction, action, nodeName, id, homeOwnerName);
        const posting = yield* select(state => getPosting(state, id));
        if (ownerName == null || posting == null) {
            return;
        }
        if (posting.receiverName != null && posting.receiverPostingId != null) {
            totals = yield* call(Node.deletePostingReaction, action,
                posting.receiverName, posting.receiverPostingId, homeOwnerName);
        }
        yield* put(postingReactionSet(id, null, totals, nodeName).causedBy(action));
        yield* call(Node.deleteRemotePostingReaction, action, ":", posting.receiverName ?? (nodeName || ownerName),
            posting.receiverPostingId ?? id);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

export function* postingGetLink(action: ClientAction, id: string, nodeName: string = "") {
    const posting = yield* select(getPosting, id, nodeName);
    const targetNode = posting?.receiverName != null ? posting.receiverName : nodeName;
    if (targetNode && posting?.receiverDeletedAt == null) {
        const nodeUri = yield* call(getNodeUri, action, targetNode);
        return `${nodeUri}/post/${posting?.receiverPostingId ?? id}`;
    } else {
        const rootLocation = yield* select(getNodeRootLocation);
        return `${rootLocation}/moera/post/${id}`;
    }
}

function* postingCopyLinkSaga(action: PostingCopyLinkAction) {
    const {id, nodeName} = action.payload;
    try {
        const href = yield* call(postingGetLink, action, id, nodeName);
        yield* call(clipboardCopy, href);
        if (!Browser.isAndroidBrowser()) {
            yield* put(flashBox(i18n.t("link-copied")).causedBy(action));
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
        yield* put(postingCommentsSubscribeFailed(id, nodeName).causedBy(action));
        return;
    }
    const remoteNodeName = posting.receiverName ?? (nodeName || ownerName);
    const remotePostingId = posting.receiverPostingId ?? id;
    try {
        const subscription = yield* call(Node.createSubscription, action, ":",
            {type: "posting-comments" as const, remoteNodeName, remotePostingId});
        yield* put(postingCommentsSubscribed(id, subscription.id, nodeName).causedBy(action));
    } catch (e) {
        yield* put(postingCommentsSubscribeFailed(id, nodeName).causedBy(action));
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
        yield* put(postingCommentsUnsubscribeFailed(id, nodeName).causedBy(action));
        return;
    }
    try {
        if (subscriptionId != null) {
            yield* call(Node.deleteSubscription, action, ":", subscriptionId);
        }
        yield* put(postingCommentsUnsubscribed(id, nodeName).causedBy(action));
    } catch (e) {
        yield* put(postingCommentsUnsubscribeFailed(id, nodeName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* postingCommentAddedBlockSaga(action: PostingCommentAddedBlockAction) {
    const {id, nodeName} = action.payload;
    const {posting} = yield* select(state => ({
        posting: getPosting(state, id)
    }));
    if (posting == null) {
        yield* put(postingCommentAddedBlockFailed(id, nodeName).causedBy(action));
        return;
    }
    const postingId = posting.receiverPostingId ?? id;
    try {
        const blockedInstant = yield* call(Node.blockInstant, action, ":",
            {storyType: "comment-added" as const, entryId: postingId});
        yield* put(postingCommentAddedBlocked(id, blockedInstant.id, nodeName).causedBy(action));
    } catch (e) {
        yield* put(postingCommentAddedBlockFailed(id, nodeName).causedBy(action));
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
        yield* put(postingCommentAddedUnblockFailed(id, nodeName).causedBy(action));
        return;
    }
    try {
        if (instantBlockId != null) {
            yield* call(Node.unblockInstant, action, ":", instantBlockId);
        }
        yield* put(postingCommentAddedUnblocked(id, nodeName).causedBy(action));
    } catch (e) {
        yield* put(postingCommentAddedUnblockFailed(id, nodeName).causedBy(action));
        yield* put(errorThrown(e));
    }
}
