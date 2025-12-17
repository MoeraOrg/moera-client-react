import { addDays, getUnixTime, isFuture } from 'date-fns';

import { executor } from "state/executor";
import { CLIENT_SETTINGS_PREFIX, Node, RecommendedPostingInfo } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { homeIntroduced } from "state/init-barriers";
import { nodeCardsPreload } from "state/nodecards/actions";
import {
    ActivePeopleLoadAction,
    activePeopleLoaded,
    activePeopleLoadFailed,
    DiscussionsLoadAction,
    discussionsLoaded,
    discussionsLoadFailed,
    DiscussionsVisitedAction,
    TrendingLoadAction,
    trendingLoaded,
    trendingLoadFailed
} from "state/explore/actions";
import { getSetting } from "state/settings/selectors";
import { getSafeSearchDefault } from "state/search/selectors";
import { REL_HOME, REL_SEARCH } from "util/rel-node-name";
import { getHomeOwnerName, isConnectedToHome } from "state/home/selectors";
import { settingsUpdate } from "state/settings/actions";

export default [
    executor("ACTIVE_PEOPLE_LOAD", "", activePeopleLoadSaga),
    executor("TRENDING_LOAD", "", trendingLoadSaga),
    executor("DISCUSSIONS_LOAD", "", discussionsLoadSaga),
    executor("DISCUSSIONS_VISITED", "", discussionsVisitedSaga),
];

function getSheriffName(): string | undefined {
    const sheriffNameDefault = select(state => getSetting(state, "search.sheriff-name") as string);
    const safeSearchDefault = select(getSafeSearchDefault);
    return safeSearchDefault && sheriffNameDefault ? sheriffNameDefault : undefined;
}

async function activePeopleLoadSaga(action: WithContext<ActivePeopleLoadAction>): Promise<void> {
    try {
        const info = await Node.getRecommendedNodesByActivity(action, REL_SEARCH, getSheriffName(), 50);
        dispatch(activePeopleLoaded(info).causedBy(action));
        dispatch(nodeCardsPreload(info.map(n => n.nodeName)).causedBy(action));
    } catch (e) {
        dispatch(activePeopleLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function trendingLoadSaga(action: WithContext<TrendingLoadAction>): Promise<void> {
    try {
        const info = await Node.getRecommendedPostingsForReading(action, REL_SEARCH, getSheriffName(), 15);
        dispatch(trendingLoaded(info).causedBy(action));
    } catch (e) {
        dispatch(trendingLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function discussionsLoadSaga(action: WithContext<DiscussionsLoadAction>): Promise<void> {
    try {
        const info = await Node.getRecommendedPostingsForCommenting(action, REL_SEARCH, getSheriffName(), 15);
        dispatch(discussionsLoaded(info).causedBy(action));
        checkForNewDiscussions(action, info);
    } catch (e) {
        dispatch(discussionsLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function checkForNewDiscussions(
    action: WithContext<DiscussionsLoadAction>, info: RecommendedPostingInfo[]
): Promise<void> {
    await homeIntroduced();
    if (!select(isConnectedToHome)) {
        return;
    }

    const notify = select(state => getSetting(state, "explore.discussions.notify") as boolean);
    if (!notify) {
        return;
    }
    const visitedAt = select(state => getSetting(state, "explore.discussions.visited-at") as Date);
    if (isFuture(addDays(visitedAt, 1))) {
        return;
    }

    const homeOwnerName = select(getHomeOwnerName);
    const interesting = info
        .filter(p => p.ownerName !== homeOwnerName)
        .filter(p => p.lastDayComments > 0);
    if (interesting.length === 0) {
        return;
    }
    const subscriptions = await Node.searchSubscriptions(
        action,
        REL_HOME,
        {
            type: "posting-comments" as const,
            postings: interesting.map(p => ({nodeName: p.nodeName, postingId: p.postingId}))
        }
    );
    const ringing = interesting.some(p =>
        subscriptions.every(s => s.remoteNodeName !== p.nodeName || s.remoteNodeName !== p.postingId)
    );
    dispatch(settingsUpdate(
        [{name: CLIENT_SETTINGS_PREFIX + "explore.discussions.ringing", value: ringing.toString()}]
    ).causedBy(action));
}

async function discussionsVisitedSaga(action: WithContext<DiscussionsVisitedAction>): Promise<void> {
    dispatch(settingsUpdate(
        [
            {name: CLIENT_SETTINGS_PREFIX + "explore.discussions.visited-at", value: getUnixTime(new Date()).toString()},
            {name: CLIENT_SETTINGS_PREFIX + "explore.discussions.ringing", value: "false"}
        ]
    ).causedBy(action));
}
