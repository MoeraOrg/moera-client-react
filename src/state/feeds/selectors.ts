import { getUnixTime } from 'date-fns';

import { ClientState } from "state/state";
import { FeedState } from "state/feeds/state";
import { emptyFeed } from "state/feeds/empty";
import { getRelNodeNameContext } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { isSheriffMarked } from "util/sheriff";
import { absoluteNodeName, REL_HOME, RelNodeName } from "util/rel-node-name";

const MAX_MOMENT = 25337597040000; // January 1, 9999

interface NodeAndFeed {
    nodeName: string;
    feedName: string;
}

export function getAllFeeds(state: ClientState): NodeAndFeed[] {
    const all: NodeAndFeed[] = [];
    for (let [nodeName, nodeFeeds] of Object.entries(state.feeds)) {
        if (nodeFeeds != null) {
            Object.keys(nodeFeeds).map(feedName => ({nodeName, feedName})).forEach(v => all.push(v));
        }
    }
    return all;
}

export function getFeedState(state: ClientState, nodeName: RelNodeName | string, feedName: string): FeedState {
    nodeName = absoluteNodeName(nodeName, getRelNodeNameContext(state));
    return state.feeds[nodeName]?.[feedName] ?? emptyFeed;
}

export function isFeedGeneralToBeLoaded(state: ClientState, nodeName: RelNodeName | string, feedName: string): boolean {
    const feed = getFeedState(state, nodeName, feedName);
    return !feed.loadedGeneral && !feed.loadingGeneral;
}

export function isFeedGeneralReady(state: ClientState, nodeName: RelNodeName | string, feedName: string): boolean {
    const feed = getFeedState(state, nodeName, feedName);
    return feed.loadedGeneral && !feed.loadingGeneral;
}

export function isFeedGeneralLoading(state: ClientState, nodeName: RelNodeName | string, feedName: string): boolean {
    return getFeedState(state, nodeName, feedName).loadingGeneral;
}

export function isFeedSheriff(
    state: ClientState, nodeName: RelNodeName | string, feedName: string, sheriffName: string | null
): boolean {
    if (sheriffName == null) {
        return false;
    }
    const feed = getFeedState(state, nodeName, feedName);
    if (!feed.loadedGeneral || feed.sheriffs == null) {
        return false;
    }
    return feed.sheriffs.includes(sheriffName);
}

export function isFeedSheriffMarked(
    state: ClientState, nodeName: RelNodeName | string, feedName: string, sheriffName: string | null
): boolean {
    const feed = getFeedState(state, nodeName, feedName);
    if (!feed.loadedGeneral) {
        return false;
    }
    return isSheriffMarked(feed, sheriffName);
}

export function isFeedSheriffProhibited(
    state: ClientState, nodeName: RelNodeName | string, feedName: string, sheriffName: string | null
): boolean {
    return !isFeedSheriff(state, nodeName, feedName, sheriffName)
        || isFeedSheriffMarked(state, nodeName, feedName, sheriffName);
}

export function isFeedStatusToBeLoaded(state: ClientState, nodeName: RelNodeName | string, feedName: string): boolean {
    const feed = getFeedState(state, nodeName, feedName);
    return !feed.loadedStatus && !feed.loadingStatus;
}

export function getFeedNotViewed(state: ClientState, nodeName: RelNodeName | string, feedName: string): number | null {
    return getFeedState(state, nodeName, feedName).status.notViewed ?? null;
}

export function getFeedNotViewedMoment(
    state: ClientState, nodeName: RelNodeName | string, feedName: string
): number | null {
    return getFeedState(state, nodeName, feedName).status.notViewedMoment ?? null;
}

export function getFeedAt(state: ClientState, nodeName: RelNodeName | string, feedName: string): number {
    return getFeedState(state, nodeName, feedName).at;
}

export function getFeedAtTimestamp(state: ClientState, nodeName: RelNodeName | string, feedName: string): number {
    const at = getFeedAt(state, nodeName, feedName);
    return at < MAX_MOMENT ? Math.floor(at / 1000) : getUnixTime(new Date());
}

export function getInstantCount(state: ClientState): number {
    const feed = getFeedState(state, REL_HOME, "instant");
    const mode = getSetting(state, "instants.number.mode") as string;
    return (mode === "not-viewed" ? feed.status.notViewed : feed.status.notRead) ?? 0;
}

export function getInstantBorder(state: ClientState): number {
    const feed = getFeedState(state, REL_HOME, "instant");
    const mode = getSetting(state, "instants.number.mode") as string;
    return (mode === "not-viewed" ? feed.status.notViewedMoment : feed.status.notReadMoment) ?? Number.MAX_SAFE_INTEGER;
}

export function isFeedToBeLoaded(state: ClientState, nodeName: RelNodeName | string, feedName: string): boolean {
    const feed = getFeedState(state, nodeName, feedName);
    return feed.stories.length === 0 && !feed.loadingFuture && !feed.loadingPast
        && (feed.after > Number.MIN_SAFE_INTEGER || feed.before < Number.MAX_SAFE_INTEGER);
}

export function isFeedPastToBeLoaded(state: ClientState, nodeName: RelNodeName | string, feedName: string): boolean {
    const feed = getFeedState(state, nodeName, feedName);
    return feed.stories.length === 0 && !feed.loadingPast && feed.after > Number.MIN_SAFE_INTEGER;
}

export function isFeedFutureToBeLoaded(state: ClientState, nodeName: RelNodeName | string, feedName: string): boolean {
    const feed = getFeedState(state, nodeName, feedName);
    return feed.stories.length === 0 && !feed.loadingFuture && feed.before < Number.MAX_SAFE_INTEGER;
}
