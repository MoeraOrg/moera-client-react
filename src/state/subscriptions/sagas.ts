import { call, put, select } from 'typed-redux-saga';

import { Node, PostingInfo, StoryInfo } from "api";
import { getHomeOwnerName, isConnectedToHome } from "state/home/selectors";
import { postingSubscriptionSet } from "state/postings/actions";

export function* fillSubscriptions(stories: StoryInfo[]) {
    const {connectedToHome, homeOwnerName} = yield* select(state => ({
        connectedToHome: isConnectedToHome(state),
        homeOwnerName: getHomeOwnerName(state)
    }));

    if (!connectedToHome) {
        return;
    }

    const postings = stories
        .map(t => t.posting)
        .filter((p): p is PostingInfo => p != null)
        .map(posting => ({
            id: posting.id,
            nodeName: posting.receiverName ?? posting.ownerName,
            postingId: posting.receiverPostingId ?? posting.id
        }))
        .filter(t => t.nodeName != null && t.nodeName !== homeOwnerName && t.postingId != null);

    if (postings.length === 0) {
        return;
    }

    const remotePostings = postings.map(t => ({nodeName: t.nodeName!, postingId: t.postingId!}));
    const subscriptions = yield* call(Node.searchSubscriptions, ":",
        {type: "posting-comments" as const, postings: remotePostings});
    const subscriptionMap = new Map(subscriptions.map(sr => [`${sr.remoteNodeName} ${sr.remotePostingId}`, sr]));

    for (const t of postings) {
        const key = `${t.nodeName} ${t.postingId}`;
        const subscription = subscriptionMap.get(key);
        if (subscription != null) {
            yield* put(postingSubscriptionSet(t.id, "posting-comments", subscription.id, ""))
        }
    }
}

export function* fillSubscription(posting: PostingInfo) {
    const {connectedToHome, homeOwnerName} = yield* select(state => ({
        connectedToHome: isConnectedToHome(state),
        homeOwnerName: getHomeOwnerName(state)
    }));
    if (!connectedToHome) {
        return;
    }
    const nodeName = posting.receiverName ?? posting.ownerName;
    const postingId = posting.receiverPostingId ?? posting.id;
    if (nodeName == null || nodeName === homeOwnerName || postingId == null) {
        return;
    }
    const remotePostings = [{nodeName, postingId}];
    const subscriptions = yield* call(Node.searchSubscriptions, ":",
        {type: "posting-comments" as const, postings: remotePostings});
    for (const subscription of subscriptions) {
        yield* put(postingSubscriptionSet(posting.id, "posting-comments", subscription.id, ""))
    }
}
