import i18n from 'i18next';

import { Node, NodeApiError, PrincipalValue, StoryInfo } from "api";
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
    feedUnsubscribeFailed,
    RecommendationDontAction
} from "state/feeds/actions";
import { errorThrown } from "state/error/actions";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { homeIntroduced } from "state/init-barriers";
import { executor } from "state/executor";
import { getSettingNode } from "state/settings/selectors";
import { StoryAddedAction, storySatisfy, StoryUpdatedAction } from "state/stories/actions";
import { getAllFeeds, getFeedState } from "state/feeds/selectors";
import { fillActivityReactionsInStories } from "state/activityreactions/sagas";
import { fillBlockedOperationsInStories } from "state/blockedoperations/sagas";
import { fillSubscriptions } from "state/subscriptions/sagas";
import { flashBox } from "state/flashbox/actions";
import { getInstantTypeDetails } from "ui/instant/instant-types";
import { absoluteNodeName, REL_HOME } from "util/rel-node-name";
import { delay } from "util/misc";

export default [
    executor(
        "FEED_GENERAL_LOAD",
        (payload, context) => `${context?.homeOwnerName}:${payload.nodeName}:${payload.feedName}`,
        feedGeneralLoadSaga
    ),
    executor("FEED_SUBSCRIBE", payload => `${payload.nodeName}:${payload.feedName}`, feedSubscribeSaga),
    executor("FEED_UNSUBSCRIBE", payload => `${payload.nodeName}:${payload.feedName}`, feedUnsubscribeSaga),
    executor("FEED_SUBSCRIBER_SET_VISIBILITY", payload => payload.subscriberId, feedSubscriberSetVisibilitySaga),
    executor("FEED_SUBSCRIPTION_SET_VISIBILITY", payload => payload.subscriptionId, feedSubscriptionSetVisibilitySaga),
    executor("FEED_STATUS_LOAD", payload => `${payload.nodeName}:${payload.feedName}`, feedStatusLoadSaga),
    executor("FEED_STATUS_UPDATE", payload => `${payload.nodeName}:${payload.feedName}`, feedStatusUpdateSaga),
    executor("FEED_PAST_SLICE_LOAD", null, feedPastSliceLoadSaga),
    executor("FEED_FUTURE_SLICE_LOAD", null, feedFutureSliceLoadSaga),
    executor("FEED_STATUS_SET", payload => `${payload.nodeName}:${payload.feedName}`, feedStatusSetSaga),
    executor("FEEDS_UPDATE", "", feedsUpdateSaga),
    executor("FEED_PAST_SLICE_SET", null, feedExecuteSliceButtonsActions),
    executor("FEED_FUTURE_SLICE_SET", null, feedExecuteSliceButtonsActions),
    executor("FEED_SLICE_UPDATE", null, feedExecuteSliceButtonsActions),
    executor("STORY_ADDED", null, feedExecuteButtonsActions),
    executor("STORY_UPDATED", null, feedExecuteButtonsActions),
    executor("RECOMMENDATION_DONT", null, recommendationDontSaga)
];

async function feedGeneralLoadSaga(action: WithContext<FeedGeneralLoadAction>): Promise<void> {
    await homeIntroduced();
    let {nodeName, feedName} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);
    try {
        const info = await Node.getFeedGeneral(action, nodeName, feedName);
        dispatch(feedGeneralSet(nodeName, feedName, info).causedBy(action));
    } catch (e) {
        dispatch(feedGeneralLoadFailed(nodeName, feedName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function feedSubscribeSaga(action: WithContext<FeedSubscribeAction>): Promise<void> {
    await homeIntroduced();
    const {nodeName, feedName, storyId} = action.payload;
    try {
        const subscription = await Node.createSubscription(
            action, REL_HOME,
            {type: "feed" as const, feedName: "news", remoteNodeName: nodeName, remoteFeedName: feedName}
        );
        dispatch(flashBox(i18n.t("you-subscribed")).causedBy(action));
        dispatch(feedSubscribed(nodeName, subscription).causedBy(action));
        if (storyId != null) {
            dispatch(storySatisfy(REL_HOME, "instant", storyId).causedBy(action));
        }
    } catch (e) {
        dispatch(feedSubscribeFailed(nodeName, feedName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function feedUnsubscribeSaga(action: WithContext<FeedUnsubscribeAction>): Promise<void> {
    await homeIntroduced();
    const {nodeName, feedName, subscriptionId} = action.payload;
    try {
        const contact = await Node.deleteSubscription(action, REL_HOME, subscriptionId);
        dispatch(flashBox(i18n.t("you-no-longer-subscribed")).causedBy(action));
        dispatch(feedUnsubscribed(nodeName, feedName, contact).causedBy(action));
    } catch (e) {
        dispatch(feedUnsubscribeFailed(nodeName, feedName).causedBy(action));
        dispatch(errorThrown(e));
    }
}

export async function nodeFeedSubscriberSetVisibility(
    action: WithContext<ClientAction>, subscriberId: string, visible: boolean
): Promise<void> {
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) { // Should not be called in any case
        return;
    }

    const view: PrincipalValue = visible ? "unset" : "private";
    const subscriber = await Node.updateSubscriber(action, REL_HOME, subscriberId, {adminOperations: {view}});
    dispatch(feedSubscriberUpdated(homeOwnerName, subscriber).causedBy(action));

    if (subscriber.feedName == null) {
        return;
    }

    const subscriptions = await Node.searchSubscriptions(
        action, REL_HOME,
        {type: "feed" as const, feeds: [{nodeName: subscriber.nodeName, feedName: subscriber.feedName}]}
    );
    if (subscriptions.length > 0) {
        const subscription = await Node.updateSubscription(
            action, subscriber.nodeName, subscriptions[0].id, {operations: {view}}
        );
        dispatch(feedSubscriptionUpdated(subscriber.nodeName, subscription).causedBy(action));
    }
}

async function feedSubscriberSetVisibilitySaga(action: WithContext<FeedSubscriberSetVisibilityAction>): Promise<void> {
    await homeIntroduced();
    const {subscriberId, visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    try {
        await nodeFeedSubscriberSetVisibility(action, subscriberId, visible);
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

export async function nodeFeedSubscriptionSetVisibility(
    action: WithContext<ClientAction>, subscriptionId: string, visible: boolean
): Promise<void> {
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) { // Should not be called in any case
        return;
    }

    const view: PrincipalValue = visible ? "public" : "private";
    const subscription = await Node.updateSubscription(action, REL_HOME, subscriptionId, {operations: {view}});
    dispatch(feedSubscriptionUpdated(homeOwnerName, subscription).causedBy(action));
}

async function feedSubscriptionSetVisibilitySaga(
    action: WithContext<FeedSubscriptionSetVisibilityAction>
): Promise<void> {
    await homeIntroduced();
    const {subscriptionId, visible} = action.payload;
    const {homeOwnerName} = action.context;

    if (homeOwnerName == null) {
        return;
    }

    try {
        await nodeFeedSubscriptionSetVisibility(action, subscriptionId, visible);
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function feedStatusLoadSaga(action: WithContext<FeedStatusLoadAction>): Promise<void> {
    await homeIntroduced();
    let {nodeName, feedName} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);
    try {
        const status = await Node.getFeedStatus(
            action, nodeName, feedName, ["feed.not-found", "authentication.required"]
        );
        dispatch(feedStatusSet(nodeName, feedName, status).causedBy(action));
    } catch (e) {
        dispatch(feedStatusLoadFailed(nodeName, feedName).causedBy(action));
        if (!(e instanceof NodeApiError)) {
            dispatch(errorThrown(e));
        }
    }
}

async function feedStatusUpdateSaga(action: WithContext<FeedStatusUpdateAction>): Promise<void> {
    let {nodeName, feedName, viewed, read, before} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);

    dispatch(feedStatusUpdated(nodeName, feedName, viewed, read, before).causedBy(action));
    if (nodeName === action.context.homeOwnerName) {
        try {
            const status = await Node.updateFeedStatus(action, nodeName, feedName, {viewed, read, before});
            dispatch(feedStatusSet(nodeName, feedName, status).causedBy(action));
        } catch (e) {
            dispatch(feedStatusUpdateFailed(nodeName, feedName).causedBy(action));
        }
    }
}

async function feedPastSliceLoadSaga(action: WithContext<FeedPastSliceLoadAction>): Promise<void> {
    await homeIntroduced();
    let {nodeName, feedName} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);
    try {
        const before = (select(state => getFeedState(state, nodeName, feedName))).after;
        const slice = await Node.getFeedSlice(action, nodeName, feedName, null, before, 20, ["feed.not-found"]);
        await fillActivityReactionsInStories(action, slice.stories);
        await fillBlockedOperationsInStories(action, slice.stories);
        dispatch(feedPastSliceSet(
            nodeName, feedName, slice.stories, slice.before, slice.after, slice.totalInPast, slice.totalInFuture
        ).causedBy(action));
        await fillSubscriptions(action, slice.stories);
    } catch (e) {
        if (e instanceof NodeApiError) {
            dispatch(feedPastSliceSet(
                nodeName, feedName, [], Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, 0, 0
            ).causedBy(action));
        } else {
            dispatch(feedPastSliceLoadFailed(nodeName, feedName).causedBy(action));
            dispatch(errorThrown(e));
        }
    }
}

async function feedFutureSliceLoadSaga(action: WithContext<FeedFutureSliceLoadAction>): Promise<void> {
    await homeIntroduced();
    let {nodeName, feedName} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);
    try {
        const after = (select(state => getFeedState(state, nodeName, feedName))).before;
        const slice = await Node.getFeedSlice(action, nodeName, feedName, after, null, 20, ["feed.not-found"]);
        await fillActivityReactionsInStories(action, slice.stories);
        await fillBlockedOperationsInStories(action, slice.stories);
        dispatch(feedFutureSliceSet(
            nodeName, feedName, slice.stories, slice.before, slice.after, slice.totalInPast, slice.totalInFuture
        ).causedBy(action));
        await fillSubscriptions(action, slice.stories);
    } catch (e) {
        if (e instanceof NodeApiError) {
            dispatch(feedPastSliceSet(
                nodeName, feedName, [], Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, 0, 0
            ).causedBy(action));
        } else {
            dispatch(feedFutureSliceLoadFailed(nodeName, feedName).causedBy(action));
            dispatch(errorThrown(e));
        }
    }
}

async function feedStatusSetSaga(action: WithContext<FeedStatusSetAction>): Promise<void> {
    await homeIntroduced();
    let {nodeName, feedName} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);
    await delay(5000); // Wait for events to make updates, so re-fetching may not be needed
    const feedState = select(state => getFeedState(state, nodeName, feedName));
    if (feedState.status.lastMoment != null && feedState.before >= Number.MAX_SAFE_INTEGER
        && feedState.stories.length > 0 && feedState.status.lastMoment > feedState.stories[0].moment
    ) {
        await feedUpdateSlice(action, nodeName, feedName, Number.MAX_SAFE_INTEGER, feedState.stories[0].moment);
    }
}

async function feedsUpdateSaga(action: WithContext<FeedsUpdateAction>): Promise<void> {
    await homeIntroduced();
    const feeds = select(getAllFeeds);
    for (const {nodeName, feedName} of feeds) {
        try {
            const status = await Node.getFeedStatus(action, nodeName, feedName);
            dispatch(feedStatusSet(nodeName, feedName, status).causedBy(action));
        } catch (e) {
            dispatch(errorThrown(e));
        }
        let {before, after} = select(state => getFeedState(state, nodeName, feedName));
        await feedUpdateSlice(action, nodeName, feedName, before, after);
    }
}

async function feedUpdateSlice(
    action: WithContext<ClientAction>, nodeName: string, feedName: string, before: number, after: number
): Promise<void> {
    try {
        while (before > after && after < Number.MAX_SAFE_INTEGER) {
            const slice = await Node.getFeedSlice(action, nodeName, feedName, after, null, 20);
            await fillActivityReactionsInStories(action, slice.stories);
            dispatch(feedSliceUpdate(
                nodeName, feedName, slice.stories, slice.before, slice.after, slice.totalInPast, slice.totalInFuture
            ).causedBy(action));
            await fillSubscriptions(action, slice.stories);
            if (after === slice.before) {
                break;
            }
            after = slice.before;
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

function feedExecuteSliceButtonsActions(
    action: WithContext<FeedPastSliceSetAction | FeedFutureSliceSetAction | FeedSliceUpdateAction>
): void {
    for (const story of action.payload.stories) {
        executeStoryButtonsActions(story, action);
    }
}

function feedExecuteButtonsActions(action: WithContext<StoryAddedAction | StoryUpdatedAction>): void {
    const {story} = action.payload;
    executeStoryButtonsActions(story, action);
}

function executeStoryButtonsActions(story: StoryInfo, cause: WithContext<ClientAction>): void {
    const details = getInstantTypeDetails(story.storyType);
    if (details?.buttonsAction != null) {
        const storyActions = details.buttonsAction(story, cause.context);
        if (storyActions != null) {
            if (Array.isArray(storyActions)) {
                for (const storyAction of storyActions) {
                    dispatch(storyAction.causedBy(cause));
                }
            } else {
                dispatch(storyActions.causedBy(cause));
            }
        }
    }
}

async function recommendationDontSaga(action: WithContext<RecommendationDontAction>): Promise<void> {
    await homeIntroduced();
    const {receiverName, deleteAll} = action.payload;

    const sourceName = select(state => getSettingNode(state, "recommendations.source") as string);
    try {
        await Node.excludeNodeFromRecommendations(action, sourceName, receiverName);
        dispatch(flashBox(i18n.t("recommendation-settings-updated")).causedBy(action));
        if (deleteAll) {
            Node.deleteFeedStories(action, REL_HOME, "news", "posting-added", receiverName, true);
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}
