import * as immutable from 'object-path-immutable';

import { PostingInfo, SubscriptionInfo, SubscriptionType } from "api/node/api-types";
import { ClientState } from "state/state";

export function fillSubscriptionId(posting: PostingInfo, subscription: SubscriptionInfo): void {
    switch (subscription.type) {
        case "posting-comments":
            if (posting.subscriptions == null) {
                posting.subscriptions = {comments: null};
            }
            posting.subscriptions.comments = subscription.remoteSubscriberId;
            break;
        default:
    }
}

export function immutableSetSubscriptionId(state: ClientState, id: string, type: SubscriptionType,
                                           subscriberId: string | null) {
    switch (type) {
        case "posting-comments":
            return immutable.set(state, [id, "posting", "subscriptions", "comments"], subscriberId);
        default:
            return state;
    }
}
