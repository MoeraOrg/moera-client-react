import { getUnixTime } from 'date-fns';

import { isPermitted } from "state/node/selectors";
import { isHomeOwnerNameSet } from "state/home/selectors";
import { emptyFeed } from "state/feeds/empty";
import { getSetting } from "state/settings/selectors";

const MAX_MOMENT = 25337597040000; // January 1, 9999

export function getAllFeeds(state) {
    return Object.getOwnPropertyNames(state.feeds);
}

export function getFeedState(state, feedName) {
    return state.feeds[feedName] != null ? state.feeds[feedName] : emptyFeed;
}

export function isFeedGeneralToBeLoaded(state, feedName) {
    const feed = getFeedState(state, feedName);
    return !feed.loadedGeneral && !feed.loadingGeneral;
}

export function isFeedGeneralReady(state, feedName) {
    const feed = getFeedState(state, feedName);
    return feed.loadedGeneral && !feed.loadingGeneral;
}

export function isFeedGeneralLoading(state, feedName) {
    return getFeedState(state, feedName).loadingGeneral;
}

export function getFeedSubscriberId(state, feedName) {
    return getFeedState(state, feedName).subscriberId;
}

export function getFeedNotViewed(state, feedName) {
    return getFeedState(state, feedName).notViewed;
}

export function isSubscribedToFeed(state, feedName) {
    return !!getFeedSubscriberId(state, feedName);
}

export function isSubscribingToFeed(state, feedName) {
    return getFeedState(state, feedName).subscribing;
}

export function isUnsubscribingFromFeed(state, feedName) {
    return getFeedState(state, feedName).unsubscribing;
}

export function isFeedAddable(state, feedName) {
    const feed = getFeedState(state, feedName);
    return isFeedGeneralReady(state, feedName) && isPermitted("add", feed, state)
        && isHomeOwnerNameSet(state);
}

export function getFeedAt(state, feedName) {
    return getFeedState(state, feedName).at;
}

export function getFeedAtTimestamp(state, feedName) {
    const at = getFeedAt(state, feedName);
    return at < MAX_MOMENT ? Math.floor(at / 1000) : getUnixTime(new Date());
}

export function getInstantCount(state) {
    const feed = getFeedState(state, ":instant");
    const mode = getSetting(state, "instants.number.mode")
    return mode === "not-viewed" ? feed.notViewed : feed.notRead;
}

export function isFeedToBeLoaded(state, feedName) {
    const feed = getFeedState(state, feedName);
    return feed.stories.length === 0 && !feed.loadingFuture && !feed.loadingPast
        && (feed.after > Number.MIN_SAFE_INTEGER || feed.before < Number.MAX_SAFE_INTEGER);
}
