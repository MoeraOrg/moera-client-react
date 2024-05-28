import { call, delay, put, select } from 'typed-redux-saga';
import i18n from 'i18next';

import { Node, PrincipalValue, StoryInfo } from "api";
import { ClientAction } from "state/action";
import {
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
    FeedsUpdateAction,
    FeedUnsubscribeAction,
    feedUnsubscribed,
    feedUnsubscribeFailed
} from "state/feeds/actions";
import { errorThrown } from "state/error/actions";
import { WithContext } from "state/action-types";
import { homeIntroduced } from "state/init-selectors";
import { executor } from "state/executor";
import { StoryAddedAction, storySatisfy, StoryUpdatedAction } from "state/stories/actions";
import { getAllFeeds, getFeedState } from "state/feeds/selectors";
import { fillActivityReactionsInStories } from "state/activityreactions/sagas";
import { fillBlockedOperationsInStories } from "state/blockedoperations/sagas";
import { fillSubscriptions } from "state/subscriptions/sagas";
import { flashBox } from "state/flashbox/actions";
import { getInstantTypeDetails } from "ui/instant/instant-types";
import { absoluteNodeName, REL_HOME } from "util/rel-node-name";

export default [
    executor(
        "FEED_GENERAL_LOAD",
        (payload, context) => `${context?.homeOwnerName}:${payload.nodeName}:${payload.feedName}`,
        feedGeneralLoadSaga,
        homeIntroduced
    ),
    executor(
        "FEED_SUBSCRIBE",
        payload => `${payload.nodeName}:${payload.feedName}`,
        feedSubscribeSaga,
        homeIntroduced
    ),
    executor(
        "FEED_UNSUBSCRIBE",
        payload => `${payload.nodeName}:${payload.feedName}`,
        feedUnsubscribeSaga,
        homeIntroduced
    ),
    executor(
        "FEED_SUBSCRIBER_SET_VISIBILITY",
        payload => payload.subscriberId,
        feedSubscriberSetVisibilitySaga,
        homeIntroduced
    ),
    executor(
        "FEED_SUBSCRIPTION_SET_VISIBILITY",
        payload => payload.subscriptionId,
        feedSubscriptionSetVisibilitySaga,
        homeIntroduced
    ),
    executor(
        "FEED_STATUS_LOAD",
        payload => `${payload.nodeName}:${payload.feedName}`,
        feedStatusLoadSaga,
        homeIntroduced
    ),
    executor("FEED_STATUS_UPDATE", payload => `${payload.nodeName}:${payload.feedName}`, feedStatusUpdateSaga),
    executor("FEED_PAST_SLICE_LOAD", null, feedPastSliceLoadSaga, homeIntroduced),
    executor("FEED_FUTURE_SLICE_LOAD", null, feedFutureSliceLoadSaga, homeIntroduced),
    executor(
        "FEED_STATUS_SET",
        payload => `${payload.nodeName}:${payload.feedName}`,
        feedStatusSetSaga,
        homeIntroduced
    ),
    executor("FEEDS_UPDATE", "", feedsUpdateSaga, homeIntroduced),
    executor("FEED_PAST_SLICE_SET", null, feedExecuteSliceButtonsActions),
    executor("FEED_FUTURE_SLICE_SET", null, feedExecuteSliceButtonsActions),
    executor("FEED_SLICE_UPDATE", null, feedExecuteSliceButtonsActions),
    executor("STORY_ADDED", null, feedExecuteButtonsActions),
    executor("STORY_UPDATED", null, feedExecuteButtonsActions)
];

function* feedGeneralLoadSaga(action: WithContext<FeedGeneralLoadAction>) {
    let {nodeName, feedName} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);
    try {
        const info = yield* call(Node.getFeedGeneral, action, nodeName, feedName);
        yield* put(feedGeneralSet(nodeName, feedName, info).causedBy(action));
    } catch (e) {
        yield* put(feedGeneralLoadFailed(nodeName, feedName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* feedSubscribeSaga(action: WithContext<FeedSubscribeAction>) {
    const {nodeName, feedName, storyId} = action.payload;
    try {
        const subscription = yield* call(Node.createSubscription, action, REL_HOME,
            {type: "feed" as const, feedName: "news", remoteNodeName: nodeName, remoteFeedName: feedName});
        yield* put(flashBox(i18n.t("you-subscribed")).causedBy(action));
        yield* put(feedSubscribed(nodeName, subscription).causedBy(action));
        if (storyId != null) {
            yield* put(storySatisfy(REL_HOME, "instant", storyId).causedBy(action));
        }
    } catch (e) {
        yield* put(feedSubscribeFailed(nodeName, feedName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* feedUnsubscribeSaga(action: WithContext<FeedUnsubscribeAction>) {
    const {nodeName, feedName, subscriptionId} = action.payload;
    try {
        const contact = yield* call(Node.deleteSubscription, action, REL_HOME, subscriptionId);
        yield* put(flashBox(i18n.t("you-no-longer-subscribed")).causedBy(action));
        yield* put(feedUnsubscribed(nodeName, feedName, contact).causedBy(action));
    } catch (e) {
        yield* put(feedUnsubscribeFailed(nodeName, feedName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

export function* nodeFeedSubscriberSetVisibility(
    action: WithContext<ClientAction>, subscriberId: string, visible: boolean
) {
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) { // Should not be called in any case
        return;
    }

    const view: PrincipalValue = visible ? "unset" : "private";
    const subscriber = yield* call(Node.updateSubscriber, action, REL_HOME, subscriberId, {adminOperations: {view}});
    yield* put(feedSubscriberUpdated(homeOwnerName, subscriber).causedBy(action));

    if (subscriber.feedName == null) {
        return;
    }

    const subscriptions = yield* call(Node.searchSubscriptions, action, REL_HOME,
        {type: "feed" as const, feeds: [{nodeName: subscriber.nodeName, feedName: subscriber.feedName}]});
    if (subscriptions.length > 0) {
        const subscription = yield* call(Node.updateSubscription, action, subscriber.nodeName, subscriptions[0].id,
            {operations: {view}});
        yield* put(feedSubscriptionUpdated(subscriber.nodeName, subscription).causedBy(action));
    }
}

function* feedSubscriberSetVisibilitySaga(action: WithContext<FeedSubscriberSetVisibilityAction>) {
    const {subscriberId, visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    try {
        yield* call(nodeFeedSubscriberSetVisibility, action, subscriberId, visible);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

export function* nodeFeedSubscriptionSetVisibility(
    action: WithContext<ClientAction>, subscriptionId: string, visible: boolean
) {
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) { // Should not be called in any case
        return;
    }

    const view: PrincipalValue = visible ? "public" : "private";
    const subscription = yield* call(Node.updateSubscription, action, REL_HOME, subscriptionId, {operations: {view}});
    yield* put(feedSubscriptionUpdated(homeOwnerName, subscription).causedBy(action));
}

function* feedSubscriptionSetVisibilitySaga(action: WithContext<FeedSubscriptionSetVisibilityAction>) {
    const {subscriptionId, visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    try {
        yield* call(nodeFeedSubscriptionSetVisibility, action, subscriptionId, visible);
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* feedStatusLoadSaga(action: WithContext<FeedStatusLoadAction>) {
    let {nodeName, feedName} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);
    try {
        const status = yield* call(Node.getFeedStatus, action, nodeName, feedName);
        yield* put(feedStatusSet(nodeName, feedName, status).causedBy(action));
    } catch (e) {
        yield* put(feedStatusLoadFailed(nodeName, feedName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* feedStatusUpdateSaga(action: WithContext<FeedStatusUpdateAction>) {
    let {nodeName, feedName, viewed, read, before} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);

    yield* put(feedStatusUpdated(nodeName, feedName, viewed, read, before).causedBy(action));
    if (nodeName === action.context.homeOwnerName) {
        try {
            const status = yield* call(Node.updateFeedStatus, action, nodeName, feedName, {viewed, read, before});
            yield* put(feedStatusSet(nodeName, feedName, status).causedBy(action));
        } catch (e) {
            yield* put(feedStatusUpdateFailed(nodeName, feedName).causedBy(action));
        }
    }
}

function* feedPastSliceLoadSaga(action: WithContext<FeedPastSliceLoadAction>) {
    let {nodeName, feedName} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);
    try {
        const before = (yield* select(state => getFeedState(state, nodeName, feedName))).after;
        const slice = yield* call(Node.getFeedSlice, action, nodeName, feedName, null, before, 20);
        yield* call(fillActivityReactionsInStories, action, slice.stories);
        yield* call(fillBlockedOperationsInStories, action, slice.stories);
        yield* put(feedPastSliceSet(
            nodeName, feedName, slice.stories, slice.before, slice.after, slice.totalInPast, slice.totalInFuture
        ).causedBy(action));
        yield* call(fillSubscriptions, action, slice.stories);
    } catch (e) {
        yield* put(feedPastSliceLoadFailed(nodeName, feedName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* feedFutureSliceLoadSaga(action: WithContext<FeedFutureSliceLoadAction>) {
    let {nodeName, feedName} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);
    try {
        const after = (yield* select(state => getFeedState(state, nodeName, feedName))).before;
        const slice = yield* call(Node.getFeedSlice, action, nodeName, feedName, after, null, 20);
        yield* call(fillActivityReactionsInStories, action, slice.stories);
        yield* call(fillBlockedOperationsInStories, action, slice.stories);
        yield* put(feedFutureSliceSet(
            nodeName, feedName, slice.stories, slice.before, slice.after, slice.totalInPast, slice.totalInFuture
        ).causedBy(action));
        yield* call(fillSubscriptions, action, slice.stories);
    } catch (e) {
        yield* put(feedFutureSliceLoadFailed(nodeName, feedName).causedBy(action));
        yield* put(errorThrown(e));
    }
}

function* feedStatusSetSaga(action: WithContext<FeedStatusSetAction>) {
    let {nodeName, feedName} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);
    yield* delay(5000); // Wait for events to make updates, so re-fetching may not be needed
    const feedState = yield* select(state => getFeedState(state, nodeName, feedName));
    if (feedState.status.lastMoment != null && feedState.before >= Number.MAX_SAFE_INTEGER
        && feedState.stories.length > 0 && feedState.status.lastMoment > feedState.stories[0].moment
    ) {
        yield* call(feedUpdateSlice, action, nodeName, feedName, Number.MAX_SAFE_INTEGER, feedState.stories[0].moment);
    }
}

function* feedsUpdateSaga(action: WithContext<FeedsUpdateAction>) {
    const feeds = yield* select(getAllFeeds);
    for (const {nodeName, feedName} of feeds) {
        window.Android?.log(`Updating feed "${feedName}" on node "${nodeName}"`); // FIXME temporary
        try {
            const status = yield* call(Node.getFeedStatus, action, nodeName, feedName);
            yield* put(feedStatusSet(nodeName, feedName, status).causedBy(action));
        } catch (e) {
            yield* put(errorThrown(e));
        }
        let {before, after} = yield* select(state => getFeedState(state, nodeName, feedName));
        yield* call(feedUpdateSlice, action, nodeName, feedName, before, after);
    }
}

function* feedUpdateSlice(
    action: WithContext<ClientAction>, nodeName: string, feedName: string, before: number, after: number
) {
    try {
        while (before > after && after < Number.MAX_SAFE_INTEGER) {
            const slice = yield* call(Node.getFeedSlice, action, nodeName, feedName, after, null, 20);
            yield* call(fillActivityReactionsInStories, action, slice.stories);
            yield* put(feedSliceUpdate(
                nodeName, feedName, slice.stories, slice.before, slice.after, slice.totalInPast, slice.totalInFuture
            ).causedBy(action));
            yield* call(fillSubscriptions, action, slice.stories);
            if (after === slice.before) {
                break;
            }
            after = slice.before;
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* feedExecuteSliceButtonsActions(
    action: WithContext<FeedPastSliceSetAction | FeedFutureSliceSetAction | FeedSliceUpdateAction>
) {
    for (const story of action.payload.stories) {
        yield* executeStoryButtonsActions(story, action);
    }
}

function* feedExecuteButtonsActions(action: WithContext<StoryAddedAction | StoryUpdatedAction>) {
    const {story} = action.payload;
    yield* executeStoryButtonsActions(story, action);
}

function* executeStoryButtonsActions(story: StoryInfo, cause: WithContext<ClientAction>) {
    const details = getInstantTypeDetails(story.storyType);
    if (details?.buttonsAction != null) {
        const storyActions = details.buttonsAction(story, cause.context);
        if (storyActions != null) {
            if (Array.isArray(storyActions)) {
                for (const storyAction of storyActions) {
                    yield* put(storyAction.causedBy(cause));
                }
            } else {
                yield* put(storyActions.causedBy(cause));
            }
        }
    }
}
