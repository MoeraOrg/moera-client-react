import { call, put, select, spawn } from 'typed-redux-saga/macro';
import clipboardCopy from 'clipboard-copy';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import {
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
    PostingVerifyAction,
    postingVerifyFailed
} from "state/postings/actions";
import { WithContext } from "state/action-types";
import { ClientState } from "state/state";
import { flashBox } from "state/flashbox/actions";
import { getPosting } from "state/postings/selectors";
import { getOwnerName } from "state/owner/selectors";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { getNodeUri } from "state/naming/sagas";
import { fillSubscription } from "state/subscriptions/sagas";
import { getNodeRootLocation } from "state/node/selectors";
import { getHomeOwnerAvatar, getHomeOwnerFullName } from "state/home/selectors";
import { introduced } from "state/init-selectors";
import { executor } from "state/executor";
import { Browser } from "ui/browser";
import { toAvatarDescription } from "util/avatar";

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
    executor(POSTING_COMMENTS_UNSUBSCRIBE, payload => payload.id, postingCommentsUnsubscribeSaga, introduced)
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
        yield* call(fillSubscription, posting);
        yield* put(postingSet(posting, nodeName));
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

function* postingReactionLoad(id: string, nodeName: string) {
    try {
        const {negative, emoji} = yield* call(Node.getPostingReaction, nodeName, id);
        const reaction = negative != null && emoji != null ? {negative, emoji} : null;
        const totals = yield* call(Node.getPostingReactionTotals, nodeName, id);
        yield* put(postingReactionSet(id, reaction, totals, nodeName));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* postingReactionLoadSaga(action: PostingReactionLoadAction) {
    const {id, nodeName} = action.payload;
    yield* call(postingReactionLoad, id, nodeName);
}

function* postingReactionsReloadSaga() {
    const postingsState = yield* select((state: ClientState) => state.postings);
    for (const nodeName of Object.getOwnPropertyNames(postingsState)) {
        for (const id of Object.getOwnPropertyNames(postingsState[nodeName])) {
            yield* spawn(postingReactionLoad, id, nodeName);
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
    if (targetNode) {
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
            yield* put(flashBox("Link copied to the clipboard"));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* postingCommentsSubscribeSaga(action: PostingCommentsSubscribeAction) {
    const {id, nodeName} = action.payload;
    const {posting, ownerName, homeOwnerFullName, homeOwnerAvatar} = yield* select(state => ({
        posting: getPosting(state, id),
        ownerName: getOwnerName(state),
        homeOwnerFullName: getHomeOwnerFullName(state),
        homeOwnerAvatar: getHomeOwnerAvatar(state)
    }));
    if (posting == null || ownerName == null) {
        yield* put(postingCommentsSubscribeFailed(id));
        return;
    }
    const targetNode = posting.receiverName ?? (nodeName || ownerName);
    const postingId = posting.receiverPostingId ?? id;
    try {
        const whoAmI = yield* call(Node.getWhoAmI, targetNode);
        const subscriber = yield* call(Node.postPostingCommentsSubscriber, targetNode, postingId, homeOwnerFullName,
            toAvatarDescription(homeOwnerAvatar));
        yield* call(Node.postPostingCommentsSubscription, ":", subscriber.id, targetNode, whoAmI.fullName ?? null,
            toAvatarDescription(whoAmI.avatar), postingId);
        yield* put(postingCommentsSubscribed(id, subscriber.id, nodeName));
    } catch (e) {
        yield* put(postingCommentsSubscribeFailed(id, nodeName));
        yield* put(errorThrown(e));
    }
}

function* postingCommentsUnsubscribeSaga(action: PostingCommentsUnsubscribeAction) {
    const {id, nodeName} = action.payload;
    const {posting, ownerName} = yield* select(state => ({
        posting: getPosting(state, id),
        ownerName: getOwnerName(state)
    }));
    if (posting == null || ownerName == null) {
        yield* put(postingCommentsUnsubscribeFailed(id));
        return;
    }
    const targetNode = posting.receiverName ?? (nodeName || ownerName);
    try {
        if (posting.subscriptions?.comments != null) {
            yield* call(Node.deleteSubscriber, targetNode, posting.subscriptions.comments);
            yield* call(Node.deleteSubscription, ":", posting.subscriptions.comments, targetNode);
        }
        yield* put(postingCommentsUnsubscribed(id, nodeName));
    } catch (e) {
        yield* put(postingCommentsUnsubscribeFailed(id, nodeName));
        yield* put(errorThrown(e));
    }
}
