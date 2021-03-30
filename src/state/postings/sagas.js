import { call, put, select } from 'redux-saga/effects';
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
    postingCommentsSubscribed,
    postingCommentsSubscribeFailed,
    postingCommentsUnsubscribed,
    postingCommentsUnsubscribeFailed,
    postingDeleted,
    postingDeleteFailed,
    postingLoadFailed,
    postingReactionSet,
    postingSet,
    postingVerifyFailed
} from "state/postings/actions";
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
import { getHomeOwnerFullName } from "state/home/selectors";

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

function* postingDeleteSaga(action) {
    const {id} = action.payload;
    const posting = yield select(getPosting, id);
    try {
        yield call(Node.deletePosting, "", id);
        yield put(postingDeleted(posting.id, posting.feedReferences));
    } catch (e) {
        yield put(postingDeleteFailed(id));
        yield put(errorThrown(e));
    }
}

function* postingLoadSaga(action) {
    try {
        const data = yield call(Node.getPosting, "", action.payload.id);
        yield call(fillActivityReaction, data);
        yield call(fillSubscription, data);
        yield put(postingSet(data));
    } catch (e) {
        yield put(postingLoadFailed());
        yield put(errorThrown(e));
    }
}

function* postingVerifySaga(action) {
    try {
        yield call(Node.remotePostingVerify, ":", action.context.ownerName, action.payload.id);
    } catch (e) {
        yield put(postingVerifyFailed());
        yield put(errorThrown(e));
    }
}

function* postingReactSaga(action) {
    const {id, negative, emoji} = action.payload;
    try {
        const data = yield call(Node.postPostingReaction, "", id, negative, emoji);
        yield put(postingReactionSet(id, {negative, emoji}, data.totals));
        const {ownerName, posting} = yield select(state => ({
            ownerName: getOwnerName(state),
            posting: getPosting(state, id)
        }));
        yield call(Node.postRemotePostingReaction, ":", posting.receiverName ?? ownerName,
            posting.receiverPostingId ?? id, negative, emoji);
    } catch (e) {
        yield put(errorThrown(e));
    }
}

function* postingReactionLoadSaga(action) {
    const {id} = action.payload;
    try {
        const {negative, emoji} = yield call(Node.getPostingReaction, "", id);
        const totals = yield call(Node.getPostingReactionTotals, "", id);
        yield put(postingReactionSet(id, {negative, emoji}, totals));
    } catch (e) {
        yield put(errorThrown(e));
    }
}

function* postingReactionDeleteSaga(action) {
    const {id} = action.payload;
    try {
        let data = yield call(Node.deletePostingReaction, "", id);
        const {ownerName, posting} = yield select(state => ({
            ownerName: getOwnerName(state),
            posting: getPosting(state, id)
        }));
        if (posting.receiverName != null) {
            data = yield call(Node.deletePostingReaction, posting.receiverName, posting.receiverPostingId);
        }
        yield put(postingReactionSet(id, null, data));
        yield call(Node.deleteRemotePostingReaction, ":", posting.receiverName ?? ownerName,
            posting.receiverPostingId ?? id);
    } catch (e) {
        yield put(errorThrown(e));
    }
}

export function* postingGetLink(id) {
    const posting = yield select(getPosting, id);
    if (posting.receiverName == null) {
        const rootLocation = yield select(getNodeRootLocation);
        return `${rootLocation}/moera/post/${id}`;
    } else {
        const nodeUri = yield call(getNodeUri, posting.receiverName);
        return `${nodeUri}/post/${posting.receiverPostingId}`;
    }
}

function* postingCopyLinkSaga(action) {
    const {id} = action.payload;
    try {
        const href = yield call(postingGetLink, id);
        yield call(clipboardCopy, href);
        if (Browser.userAgentOs !== "android") {
            yield put(flashBox("Link copied to the clipboard"));
        }
    } catch (e) {
        yield put(errorThrown(e));
    }
}

function* postingCommentsSubscribeSaga(action) {
    const {id} = action.payload;
    const {posting, ownerName, homeOwnerFullName} = yield select(state => ({
        posting: getPosting(state, id),
        ownerName: getOwnerName(state),
        homeOwnerFullName: getHomeOwnerFullName(state)
    }));
    const nodeName = posting.receiverName ?? ownerName;
    const postingId = posting.receiverPostingId ?? id;
    try {
        const whoAmI = yield call(Node.getWhoAmI, nodeName);
        const subscriber = yield call(Node.postPostingCommentsSubscriber, nodeName, postingId, homeOwnerFullName);
        yield call(Node.postPostingCommentsSubscription, ":", subscriber.id, nodeName, whoAmI.fullName, postingId);
        yield put(postingCommentsSubscribed(id, subscriber.id));
    } catch (e) {
        yield put(postingCommentsSubscribeFailed(id));
        yield put(errorThrown(e));
    }
}

function* postingCommentsUnsubscribeSaga(action) {
    const {id} = action.payload;
    const {posting, ownerName} = yield select(state => ({
        posting: getPosting(state, id),
        ownerName: getOwnerName(state)
    }));
    const nodeName = posting.receiverName ?? ownerName;
    try {
        yield call(Node.deleteSubscriber, nodeName, posting.subscriptions.comments);
        yield call(Node.deleteSubscription, ":", posting.subscriptions.comments, nodeName);
        yield put(postingCommentsUnsubscribed(id));
    } catch (e) {
        yield put(postingCommentsUnsubscribeFailed(id));
        yield put(errorThrown(e));
    }
}
