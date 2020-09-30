import * as immutable from 'object-path-immutable';

export function fillSubscriptionId(posting, subscription) {
    switch (subscription.type) {
        case "posting-comments":
            posting.subscriptions.comments = subscription.remoteSubscriberId;
            break;
    }
}

export function immutableSetSubscriptionId(state, id, type, subscriberId) {
    switch (type) {
        case "posting-comments":
            return immutable.set(state, [id, "posting", "subscriptions", "comments"], subscriberId);
        default:
            return state;
    }
}
