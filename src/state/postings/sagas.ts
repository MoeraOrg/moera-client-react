import { call, put, select } from 'typed-redux-saga/macro';
import clipboardCopy from 'clipboard-copy';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import {
    POSTING_COMMENTS_SUBSCRIBE,
    POSTING_COMMENTS_UNSUBSCRIBE,
    POSTING_COPY_LINK,
    POSTING_DELETE,
    POSTING_LOAD,
    POSTING_REACT,
    POSTING_REACTION_DELETE,
    POSTING_REACTION_LOAD,
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
    PostingReactAction,
    PostingReactionDeleteAction,
    PostingReactionLoadAction,
    postingReactionSet,
    postingSet,
    PostingVerifyAction,
    postingVerifyFailed
} from "state/postings/actions";
import { WithContext } from "state/action-types";
import { getPosting } from "state/postings/selectors";
import { getOwnerName } from "state/owner/selectors";
import { fillActivityReaction } from "state/activityreactions/sagas";
import { getNodeUri } from "state/naming/sagas";
import { flashBox } from "state/flashbox/actions";
import { fillSubscription } from "state/subscriptions/sagas";
import { getNodeRootLocation } from "state/node/selectors";
import { Browser } from "ui/browser";
import { introduce } from "api/node/introduce";
import { executor } from "state/executor";
import { getHomeOwnerAvatar, getHomeOwnerFullName } from "state/home/selectors";
import { toAvatarDescription } from "util/avatar";

export default [
    executor(POSTING_DELETE, payload => payload.id, postingDeleteSaga),
    executor(POSTING_LOAD, payload => payload.id, introduce(postingLoadSaga)),
    executor(POSTING_VERIFY, payload => payload.id, postingVerifySaga),
    executor(POSTING_REACT, null, introduce(postingReactSaga)),
    executor(POSTING_REACTION_LOAD, payload => payload.id, postingReactionLoadSaga),
    executor(POSTING_REACTION_DELETE, payload => payload.id, introduce(postingReactionDeleteSaga)),
    executor(POSTING_COPY_LINK, payload => payload.id, postingCopyLinkSaga),
    executor(POSTING_COMMENTS_SUBSCRIBE, payload => payload.id, introduce(postingCommentsSubscribeSaga)),
    executor(POSTING_COMMENTS_UNSUBSCRIBE, payload => payload.id, introduce(postingCommentsUnsubscribeSaga))
];

function* postingDeleteSaga(action: PostingDeleteAction) {
    const {id} = action.payload;
    const posting = yield* select(getPosting, id);
    if (posting == null) {
        return;
    }
    try {
        yield* call(Node.deletePosting, "", id);
        yield* put(postingDeleted(posting.id, posting.feedReferences ?? []));
    } catch (e) {
        yield* put(postingDeleteFailed(id));
        yield* put(errorThrown(e));
    }
}

function* postingLoadSaga(action: PostingLoadAction) {
    const {id} = action.payload;
    try {
        const data = yield* call(Node.getPosting, "", id);
        yield* call(fillActivityReaction, data);
        yield* call(fillSubscription, data);
        yield* put(postingSet(data));
    } catch (e) {
        yield* put(postingLoadFailed(id));
        yield* put(errorThrown(e));
    }
}

function* postingVerifySaga(action: WithContext<PostingVerifyAction>) {
    const {id} = action.payload;
    if (action.context.ownerName == null) {
        yield* put(postingVerifyFailed(id));
        return;
    }
    try {
        yield* call(Node.remotePostingVerify, ":", action.context.ownerName, id);
    } catch (e) {
        yield* put(postingVerifyFailed(id));
        yield* put(errorThrown(e));
    }
}

function* postingReactSaga(action: PostingReactAction) {
    const {id, negative, emoji} = action.payload;
    try {
        const data = yield* call(Node.postPostingReaction, "", id, negative, emoji);
        yield* put(postingReactionSet(id, {negative, emoji}, data.totals));
        const {ownerName, posting} = yield* select(state => ({
            ownerName: getOwnerName(state),
            posting: getPosting(state, id)
        }));
        if (ownerName != null && posting != null) {
            yield* call(Node.postRemotePostingReaction, ":", posting.receiverName ?? ownerName,
                posting.receiverPostingId ?? id, negative, emoji);
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* postingReactionLoadSaga(action: PostingReactionLoadAction) {
    const {id} = action.payload;
    try {
        const {negative, emoji} = yield* call(Node.getPostingReaction, "", id);
        const totals = yield* call(Node.getPostingReactionTotals, "", id);
        yield* put(postingReactionSet(id, {negative, emoji}, totals));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* postingReactionDeleteSaga(action: PostingReactionDeleteAction) {
    const {id} = action.payload;
    try {
        let data = yield* call(Node.deletePostingReaction, "", id);
        const {ownerName, posting} = yield* select(state => ({
            ownerName: getOwnerName(state),
            posting: getPosting(state, id)
        }));
        if (ownerName == null || posting == null) {
            return;
        }
        if (posting.receiverName != null && posting.receiverPostingId != null) {
            data = yield* call(Node.deletePostingReaction, posting.receiverName, posting.receiverPostingId);
        }
        yield* put(postingReactionSet(id, null, data));
        yield* call(Node.deleteRemotePostingReaction, ":", posting.receiverName ?? ownerName,
            posting.receiverPostingId ?? id);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

export function* postingGetLink(id: string) {
    const posting = yield* select(getPosting, id);
    if (posting == null || posting.receiverName == null) {
        const rootLocation = yield* select(getNodeRootLocation);
        return `${rootLocation}/moera/post/${id}`;
    } else {
        const nodeUri = yield* call(getNodeUri, posting.receiverName);
        return `${nodeUri}/post/${posting.receiverPostingId}`;
    }
}

function* postingCopyLinkSaga(action: PostingCopyLinkAction) {
    const {id} = action.payload;
    try {
        const href = yield* call(postingGetLink, id);
        yield* call(clipboardCopy, href);
        if (Browser.userAgentOs !== "android") {
            yield* put(flashBox("Link copied to the clipboard"));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* postingCommentsSubscribeSaga(action: PostingCommentsSubscribeAction) {
    const {id} = action.payload;
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
    const nodeName = posting.receiverName ?? ownerName;
    const postingId = posting.receiverPostingId ?? id;
    try {
        const whoAmI = yield* call(Node.getWhoAmI, nodeName);
        const subscriber = yield* call(Node.postPostingCommentsSubscriber, nodeName, postingId, homeOwnerFullName,
            toAvatarDescription(homeOwnerAvatar));
        yield* call(Node.postPostingCommentsSubscription, ":", subscriber.id, nodeName, whoAmI.fullName ?? null,
            toAvatarDescription(whoAmI.avatar), postingId);
        yield* put(postingCommentsSubscribed(id, subscriber.id));
    } catch (e) {
        yield* put(postingCommentsSubscribeFailed(id));
        yield* put(errorThrown(e));
    }
}

function* postingCommentsUnsubscribeSaga(action: PostingCommentsUnsubscribeAction) {
    const {id} = action.payload;
    const {posting, ownerName} = yield* select(state => ({
        posting: getPosting(state, id),
        ownerName: getOwnerName(state)
    }));
    if (posting == null || ownerName == null) {
        yield* put(postingCommentsUnsubscribeFailed(id));
        return;
    }
    const nodeName = posting.receiverName ?? ownerName;
    try {
        if (posting.subscriptions?.comments != null) {
            yield* call(Node.deleteSubscriber, nodeName, posting.subscriptions.comments);
            yield* call(Node.deleteSubscription, ":", posting.subscriptions.comments, nodeName);
        }
        yield* put(postingCommentsUnsubscribed(id));
    } catch (e) {
        yield* put(postingCommentsUnsubscribeFailed(id));
        yield* put(errorThrown(e));
    }
}
