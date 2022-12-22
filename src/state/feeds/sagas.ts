import { call, delay, put, select } from 'typed-redux-saga';

import { Node } from "api";
import { PrincipalValue } from "api/node/api-types";
import {
    FEED_FUTURE_SLICE_LOAD,
    FEED_FUTURE_SLICE_SET,
    FEED_GENERAL_LOAD,
    FEED_PAST_SLICE_LOAD,
    FEED_PAST_SLICE_SET,
    FEED_SLICE_UPDATE,
    FEED_STATUS_LOAD,
    FEED_STATUS_SET,
    FEED_STATUS_UPDATE,
    FEED_SUBSCRIBE,
    FEED_SUBSCRIBER_SET_VISIBILITY,
    FEED_SUBSCRIPTION_SET_VISIBILITY,
    FEED_UNSUBSCRIBE,
    FeedFutureSliceLoadAction,
    feedFutureSliceLoadFailed,
    feedFutureSliceSet,
    FeedFutureSliceSetAction,
    FeedGeneralLoadAction,
    feedGeneralLoadFailed,
    feedGeneralSet,
    FeedPastSliceLoadAction,
    feedPastSliceLoadFailed,
    feedPastSliceSet,
    FeedPastSliceSetAction,
    FEEDS_UPDATE,
    feedSliceUpdate,
    FeedSliceUpdateAction,
    FeedStatusLoadAction,
    feedStatusLoadFailed,
    feedStatusSet,
    FeedStatusSetAction,
    FeedStatusUpdateAction,
    feedStatusUpdated,
    feedStatusUpdateFailed,
    FeedSubscribeAction,
    feedSubscribed,
    feedSubscribeFailed,
    FeedSubscriberSetVisibilityAction,
    feedSubscriberUpdated,
    FeedSubscriptionSetVisibilityAction,
    feedSubscriptionUpdated,
    FeedUnsubscribeAction,
    feedUnsubscribed,
    feedUnsubscribeFailed
} from "state/feeds/actions";
import { errorThrown } from "state/error/actions";
import { WithContext } from "state/action-types";
import { introduced } from "state/init-selectors";
import { executor } from "state/executor";
import { STORY_ADDED, STORY_UPDATED, StoryAddedAction, storySatisfy, StoryUpdatedAction } from "state/stories/actions";
import { getAllFeeds, getFeedState } from "state/feeds/selectors";
import { fillActivityReactionsInStories } from "state/activityreactions/sagas";
import { fillSubscriptions } from "state/subscriptions/sagas";
import { getInstantTypeDetails } from "ui/instant/instant-types";

export default [
    executor(
        FEED_GENERAL_LOAD,
        (payload, context) => `${context?.homeOwnerName}:${context?.ownerName}:${payload.feedName}`,
        feedGeneralLoadSaga,
        introduced
    ),
    executor(FEED_SUBSCRIBE, payload => `${payload.nodeName}:${payload.feedName}`, feedSubscribeSaga, introduced),
    executor(FEED_UNSUBSCRIBE, payload => `${payload.nodeName}:${payload.feedName}`, feedUnsubscribeSaga, introduced),
    executor(
        FEED_SUBSCRIBER_SET_VISIBILITY,
        payload => payload.subscriberId,
        feedSubscriberSetVisibilitySaga,
        introduced
    ),
    executor(
        FEED_SUBSCRIPTION_SET_VISIBILITY,
        payload => payload.subscriptionId,
        feedSubscriptionSetVisibilitySaga,
        introduced
    ),
    executor(FEED_STATUS_LOAD, payload => payload.feedName, feedStatusLoadSaga, introduced),
    executor(FEED_STATUS_UPDATE, payload => payload.feedName, feedStatusUpdateSaga),
    executor(FEED_PAST_SLICE_LOAD, payload => payload.feedName, feedPastSliceLoadSaga, introduced),
    executor(FEED_FUTURE_SLICE_LOAD, payload => payload.feedName, feedFutureSliceLoadSaga, introduced),
    executor(FEED_STATUS_SET, payload => payload.feedName, feedStatusSetSaga, introduced),
    executor(FEEDS_UPDATE, "", feedsUpdateSaga, introduced),
    executor(FEED_PAST_SLICE_SET, null, feedExecuteSliceButtonsActions),
    executor(FEED_FUTURE_SLICE_SET, null, feedExecuteSliceButtonsActions),
    executor(FEED_SLICE_UPDATE, null, feedExecuteSliceButtonsActions),
    executor(STORY_ADDED, null, feedExecuteButtonsActions),
    executor(STORY_UPDATED, null, feedExecuteButtonsActions)
];

function* feedGeneralLoadSaga(action: WithContext<FeedGeneralLoadAction>) {
    const {feedName} = action.payload;
    try {
        const info = yield* call(Node.getFeedGeneral, "", feedName);
        yield* put(feedGeneralSet(feedName, info));
    } catch (e) {
        yield* put(feedGeneralLoadFailed(feedName));
        yield* put(errorThrown(e));
    }
}

function* feedSubscribeSaga(action: WithContext<FeedSubscribeAction>) {
    const {nodeName, feedName, storyId} = action.payload;
    try {
        const subscription = yield* call(Node.postFeedSubscription, ":", nodeName, feedName);
        yield* put(feedSubscribed(nodeName, subscription));
        if (storyId != null) {
            yield* put(storySatisfy(":instant", storyId));
        }
    } catch (e) {
        yield* put(feedSubscribeFailed(nodeName, feedName));
        yield* put(errorThrown(e));
    }
}

function* feedUnsubscribeSaga(action: FeedUnsubscribeAction) {
    const {nodeName, feedName, subscriptionId} = action.payload;
    try {
        const contact = yield* call(Node.deleteSubscription, ":", subscriptionId);
        yield* put(feedUnsubscribed(nodeName, feedName, contact));
    } catch (e) {
        yield* put(feedUnsubscribeFailed(nodeName, feedName));
        yield* put(errorThrown(e));
    }
}

function* feedSubscriberSetVisibilitySaga(action: WithContext<FeedSubscriberSetVisibilityAction>) {
    const {subscriberId, feedName, visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    try {
        const view: PrincipalValue = visible ? "unset" : "private";
        const subscriber = yield* call(Node.putSubscriber, ":", subscriberId, null, {view});
        yield* put(feedSubscriberUpdated(homeOwnerName, subscriber));
        const subscriptions = yield* call(Node.searchSubscriptions, ":", "feed",
            [{nodeName: subscriber.nodeName, feedName}], null);
        if (subscriptions.length > 0) {
            const subscription = yield* call(Node.putSubscription, subscriber.nodeName, subscriptions[0].id, {view});
            yield* put(feedSubscriptionUpdated(subscriber.nodeName, subscription));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* feedSubscriptionSetVisibilitySaga(action: WithContext<FeedSubscriptionSetVisibilityAction>) {
    const {subscriptionId, visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    try {
        const view: PrincipalValue = visible ? "public" : "private";
        const subscription = yield* call(Node.putSubscription, ":", subscriptionId, {view});
        yield* put(feedSubscriptionUpdated(homeOwnerName, subscription));
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* feedStatusLoadSaga(action: FeedStatusLoadAction) {
    const {feedName} = action.payload;
    try {
        const data = feedName.startsWith(":")
            ? yield* call(Node.getFeedStatus, ":", feedName.substring(1))
            : yield* call(Node.getFeedStatus, "", feedName);
        yield* put(feedStatusSet(feedName, data));
    } catch (e) {
        yield* put(feedStatusLoadFailed(feedName));
        yield* put(errorThrown(e));
    }
}

function* feedStatusUpdateSaga(action: WithContext<FeedStatusUpdateAction>) {
    const {feedName, viewed, read, before} = action.payload;
    try {
        yield* put(feedStatusUpdated(feedName, viewed, read, before));
        // feedName must start with ":"
        if (action.context.ownerName === action.context.homeOwnerName) {
            yield* put(feedStatusUpdated(feedName.substring(1), viewed, read, before));
        }
        const data = yield* call(Node.putFeedStatus, ":", feedName.substring(1), viewed, read, before);
        yield* put(feedStatusSet(feedName, data));
        if (action.context.ownerName === action.context.homeOwnerName) {
            yield* put(feedStatusSet(feedName.substring(1), data));
        }
    } catch (e) {
        yield* put(feedStatusUpdateFailed(feedName));
    }
}

function* feedPastSliceLoadSaga(action: FeedPastSliceLoadAction) {
    const {feedName} = action.payload;
    try {
        const before = (yield* select(state => getFeedState(state, feedName))).after;
        const data = feedName.startsWith(":")
            ? yield* call(Node.getFeedSlice, ":", feedName.substring(1), null, before, 20)
            : yield* call(Node.getFeedSlice, "", feedName, null, before, 20);
        yield* call(fillActivityReactionsInStories, data.stories);
        yield* put(feedPastSliceSet(feedName, data.stories, data.before, data.after,
            data.totalInPast, data.totalInFuture));
        yield* call(fillSubscriptions, data.stories);
    } catch (e) {
        yield* put(feedPastSliceLoadFailed(feedName));
        yield* put(errorThrown(e));
    }
}

function* feedFutureSliceLoadSaga(action: FeedFutureSliceLoadAction) {
    const {feedName} = action.payload;
    try {
        const after = (yield* select(state => getFeedState(state, feedName))).before;
        const data = feedName.startsWith(":")
            ? yield* call(Node.getFeedSlice, ":", feedName.substring(1), after, null, 20)
            : yield* call(Node.getFeedSlice, "", feedName, after, null, 20);
        yield* call(fillActivityReactionsInStories, data.stories);
        yield* put(feedFutureSliceSet(feedName, data.stories, data.before, data.after,
            data.totalInPast, data.totalInFuture));
        yield* call(fillSubscriptions, data.stories);
    } catch (e) {
        yield* put(feedFutureSliceLoadFailed(feedName));
        yield* put(errorThrown(e));
    }
}

function* feedStatusSetSaga(action: FeedStatusSetAction) {
    const {feedName} = action.payload;
    yield* delay(5000); // Wait for events to make updates, so re-fetching may not be needed
    const feedState = yield* select(state => getFeedState(state, feedName));
    if (feedState.status.lastMoment != null && feedState.before >= Number.MAX_SAFE_INTEGER
        && feedState.stories.length > 0 && feedState.status.lastMoment > feedState.stories[0].moment
    ) {
        yield* call(feedUpdateSlice, feedName, Number.MAX_SAFE_INTEGER, feedState.stories[0].moment);
    }
}

function* feedsUpdateSaga() {
    const feedNames = yield* select(getAllFeeds);
    for (const feedName of feedNames) {
        if (feedName.startsWith(":")) {
            try {
                const data = yield* call(Node.getFeedStatus, ":", feedName.substring(1));
                yield* put(feedStatusSet(feedName, data));
            } catch (e) {
                yield* put(errorThrown(e));
            }
        }
        let {before, after} = yield* select(state => getFeedState(state, feedName));
        yield* call(feedUpdateSlice, feedName, before, after);
    }
}

function* feedUpdateSlice(feedName: string, before: number, after: number) {
    try {
        while (before > after && after < Number.MAX_SAFE_INTEGER) {
            const data = feedName.startsWith(":")
                ? yield* call(Node.getFeedSlice, ":", feedName.substring(1), after, null, 20)
                : yield* call(Node.getFeedSlice, "", feedName, after, null, 20);
            yield* call(fillActivityReactionsInStories, data.stories);
            yield* put(feedSliceUpdate(
                feedName, data.stories, data.before, data.after, data.totalInPast, data.totalInFuture));
            yield* call(fillSubscriptions, data.stories);
            if (after === data.before) {
                break;
            }
            after = data.before;
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* feedExecuteSliceButtonsActions(
    action: FeedPastSliceSetAction | FeedFutureSliceSetAction | FeedSliceUpdateAction
) {
    for (const story of action.payload.stories) {
        const details = getInstantTypeDetails(story.storyType);
        if (details?.buttonsAction != null) {
            const action = details.buttonsAction(story);
            if (action != null) {
                yield* put(action);
            }
        }
    }
}

function* feedExecuteButtonsActions(action: StoryAddedAction | StoryUpdatedAction) {
    const {story} = action.payload;
    const details = getInstantTypeDetails(story.storyType);
    if (details?.buttonsAction != null) {
        const action = details.buttonsAction(story);
        if (action != null) {
            yield* put(action);
        }
    }
}
