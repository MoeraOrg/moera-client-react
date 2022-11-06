import * as immutable from 'object-path-immutable';

import { PostingInfo, SubscriptionInfo, SubscriptionType } from "api/node/api-types";
import { PostingsState } from "state/postings/state";

export function fillSubscriptionId(posting: PostingInfo, subscription: SubscriptionInfo): void {
    switch (subscription.type) {
        case "posting-comments":
            if (posting.subscriptions == null) {
                posting.subscriptions = {comments: null};
            }
            posting.subscriptions.comments = subscription.id;
            break;
        default:
    }
}

export function immutableSetSubscriptionId(state: PostingsState, nodeName: string, id: string, type: SubscriptionType,
                                           subscriptionId: string | null) {
    switch (type) {
        case "posting-comments":
            return immutable.set(state, [nodeName, id, "posting", "subscriptions", "comments"], subscriptionId);
        default:
            return state;
    }
}
