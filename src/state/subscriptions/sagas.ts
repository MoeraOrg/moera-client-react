import { call, select } from 'typed-redux-saga';

import { Node } from "api/node";
import { PostingInfo, StoryInfo } from "api/node/api-types";
import { isAtHomeNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { fillSubscriptionId } from "state/subscriptions/util";

export function* fillSubscriptions(stories: StoryInfo[]) {
    const postings = stories
        .map(t => t.posting)
        .filter((p): p is PostingInfo => p != null)
        .filter(p => p.receiverName != null && p.receiverPostingId != null);
    if (postings.length === 0) {
        return;
    }
    const toBeFilled = yield* select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const remotePostings = postings.map(p => ({nodeName: p.receiverName!, postingId: p.receiverPostingId!}));
    const subscriptions = yield* call(Node.searchSubscriptions, ":", "posting-comments", null, remotePostings);
    const subscriptionMap = new Map(subscriptions.map(r => [`${r.remoteNodeName} ${r.remotePostingId}`, r]));
    postings.forEach(p => {
        const key = `${p.receiverName} ${p.receiverPostingId}`;
        const subscription = subscriptionMap.get(key);
        if (subscription != null) {
            fillSubscriptionId(p, subscription);
        }
    })
}

export function* fillSubscription(posting: PostingInfo) {
    if (posting.receiverName == null || posting.receiverPostingId == null) {
        return;
    }
    const toBeFilled = yield* select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const remotePostings = [{nodeName: posting.receiverName, postingId: posting.receiverPostingId}];
    const subscriptions = yield* call(Node.searchSubscriptions, ":", "posting-comments", null, remotePostings);
    subscriptions.forEach(sr => fillSubscriptionId(posting, sr));
}
