import { getUnixTime } from 'date-fns';

import { AvatarImage, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { FeedState } from "state/feeds/state";
import { emptyFeed } from "state/feeds/empty";
import { getSetting } from "state/settings/selectors";

const MAX_MOMENT = 25337597040000; // January 1, 9999

export function subscriberToSubscription(subscriber: SubscriberInfo, feedName: string, remoteNodeName: string,
                                         remoteFullName: string | null,
                                         remoteAvatar: AvatarImage | null): SubscriptionInfo;
export function subscriberToSubscription(subscriber: null, feedName: string, remoteNodeName: string,
                                         remoteFullName: string | null,
                                         remoteAvatar: AvatarImage | null): null;
export function subscriberToSubscription(subscriber: SubscriberInfo | null, feedName: string, remoteNodeName: string,
                                         remoteFullName: string | null,
                                         remoteAvatar: AvatarImage | null): SubscriptionInfo | null {
    if (subscriber == null) {
        return null;
    }
    return {
        id: "",
        type: subscriber.type,
        feedName,
        remoteSubscriberId: subscriber.id,
        remoteNodeName,
        remoteFullName,
        remoteAvatar,
        remoteFeedName: subscriber.feedName,
        remotePostingId: subscriber.postingId,
        createdAt: subscriber.createdAt
    }
}

export function subscriptionToSubscriber(subscription: SubscriptionInfo, nodeName: string, fullName: string | null,
                                         avatar: AvatarImage | null): SubscriberInfo;
export function subscriptionToSubscriber(subscription: null, nodeName: string, fullName: string | null,
                                         avatar: AvatarImage | null): null;
export function subscriptionToSubscriber(subscription: SubscriptionInfo | null, nodeName: string,
                                         fullName: string | null, avatar: AvatarImage | null): SubscriberInfo | null {
    if (subscription == null) {
        return null;
    }
    return {
        id: subscription.remoteSubscriberId,
        type: subscription.type,
        feedName: subscription.remoteFeedName,
        postingId: subscription.remotePostingId,
        nodeName,
        fullName,
        avatar,
        createdAt: subscription.createdAt
    }
}

export function getAllFeeds(state: ClientState): string[] {
    return Object.getOwnPropertyNames(state.feeds);
}

export function getFeedState(state: ClientState, feedName: string): FeedState {
    return state.feeds[feedName] ?? emptyFeed;
}

export function isFeedGeneralToBeLoaded(state: ClientState, feedName: string): boolean {
    const feed = getFeedState(state, feedName);
    return !feed.loadedGeneral && !feed.loadingGeneral;
}

export function isFeedGeneralReady(state: ClientState, feedName: string): boolean {
    const feed = getFeedState(state, feedName);
    return feed.loadedGeneral && !feed.loadingGeneral;
}

export function isFeedGeneralLoading(state: ClientState, feedName: string): boolean {
    return getFeedState(state, feedName).loadingGeneral;
}

export function isFeedStatusToBeLoaded(state: ClientState, feedName: string): boolean {
    const feed = getFeedState(state, feedName);
    return !feed.loadedStatus && !feed.loadingStatus;
}

export function getFeedNotViewed(state: ClientState, feedName: string): number | null {
    return getFeedState(state, feedName).status.notViewed ?? null;
}

export function getFeedNotViewedMoment(state: ClientState, feedName: string): number | null {
    return getFeedState(state, feedName).status.notViewedMoment ?? null;
}

export function getFeedAt(state: ClientState, feedName: string): number {
    return getFeedState(state, feedName).at;
}

export function getFeedAtTimestamp(state: ClientState, feedName: string): number {
    const at = getFeedAt(state, feedName);
    return at < MAX_MOMENT ? Math.floor(at / 1000) : getUnixTime(new Date());
}

export function isFeedAtBeginning(state: ClientState, feedName: string): boolean {
    return getFeedAt(state, feedName) >= MAX_MOMENT;
}

export function getInstantCount(state: ClientState): number {
    const feed = getFeedState(state, ":instant");
    const mode = getSetting(state, "instants.number.mode") as string;
    return (mode === "not-viewed" ? feed.status.notViewed : feed.status.notRead) ?? 0;
}

export function getInstantBorder(state: ClientState): number {
    const feed = getFeedState(state, ":instant");
    const mode = getSetting(state, "instants.number.mode") as string;
    return (mode === "not-viewed" ? feed.status.notViewedMoment : feed.status.notReadMoment) ?? Number.MAX_SAFE_INTEGER;
}

export function isFeedToBeLoaded(state: ClientState, feedName: string): boolean {
    const feed = getFeedState(state, feedName);
    return feed.stories.length === 0 && !feed.loadingFuture && !feed.loadingPast
        && (feed.after > Number.MIN_SAFE_INTEGER || feed.before < Number.MAX_SAFE_INTEGER);
}
