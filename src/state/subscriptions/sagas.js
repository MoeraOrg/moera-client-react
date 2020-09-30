import { call, select } from 'redux-saga/effects';

import { isAtHomeNode } from "state/node/selectors";
import { Node } from "api/node";
import { fillSubscriptionId } from "state/subscriptions/util";

export function* fillSubscriptions(stories) {
    const postings = stories
        .map(t => t.posting)
        .filter(p => p != null)
        .filter(p => p.receiverName != null);
    if (postings.length === 0) {
        return;
    }
    const atHome = yield select(isAtHomeNode);
    if (atHome) {
        return;
    }
    const remotePostings = postings.map(p => ({nodeName: p.receiverName, postingId: p.receiverPostingId}));
    const subscriptions = yield call(Node.postSubscriptionsSearch, ":", remotePostings);
    const subscriptionMap = new Map(subscriptions.map(r => [`${r.remoteNodeName} ${r.remotePostingId}`, r]));
    postings.forEach(p => {
        const key = `${p.receiverName} ${p.receiverPostingId}`;
        const subscription = subscriptionMap.get(key);
        if (subscription != null) {
            fillSubscriptionId(p, subscription);
        }
    })
}

export function* fillSubscription(posting) {
    if (posting.receiverName == null) {
        return;
    }
    const remotePostings = [{nodeName: posting.receiverName, postingId: posting.receiverPostingId}];
    const subscriptions = yield call(Node.postSubscriptionsSearch, ":", remotePostings);
    subscriptions.forEach(sr => fillSubscriptionId(posting, sr));
}
