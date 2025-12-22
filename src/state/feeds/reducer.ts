import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { StoryInfo } from "api";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { emptyFeed, emptyInfo } from "state/feeds/empty";
import { ExtStoryInfo, FeedSlice, FeedsState, FeedState } from "state/feeds/state";
import { Page } from "state/navigation/pages";
import { getInstantSummary, getInstantTypeDetails } from "ui/instant/instant-types";
import { replaceEmojis } from "util/html";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { isSheriffGoverned, isSheriffMarked } from "util/sheriff";
import { absoluteNodeName } from "util/rel-node-name";

const initialState: FeedsState = {
};

function getFeed(
    state: FeedsState, nodeName: string, feedName: string
): {
    istate: WrappedObject<FeedsState>, feed: FeedState
} {
    const istate = immutable.wrap(state);
    let nodeFeeds = state[nodeName];
    if (nodeFeeds == null) {
        nodeFeeds = {};
        istate.set([nodeName], {});
    }
    let feed = nodeFeeds[feedName];
    if (feed == null) {
        feed = cloneDeep(emptyFeed);
        istate.set([nodeName, feedName], feed);
    }
    return {istate, feed};
}

const PAGE_FEEDS = new Map<Page, string>([
    ["timeline", "timeline"],
    ["news", "news"],
    ["explore", "explore"],
]);

function extractStory(story: StoryInfo, homeOwnerName: string | null): ExtStoryInfo {
    const t: any = {...story};
    delete t.feedName;
    delete t.posting;
    if (story.posting) {
        t.postingId = story.posting.id;
    }
    delete t.comment;
    if (story.comment) {
        t.commentId = story.comment.id;
    }
    sheriffMarkStory(t);
    if (story.summary == null) {
        story.summary = getInstantSummary(story, homeOwnerName);
    }
    t.summary = replaceEmojis(story.summary);
    return t;
}

function sheriffMarkStory(story: ExtStoryInfo): void {
    const fields = getInstantTypeDetails(story.storyType)?.sheriffFields;
    if (fields == null || fields.length === 0 || story.summaryData == null) {
        return;
    }
    story.hideSheriffMarked = false;
    const data = story.summaryData;
    for (const field of fields) {
        switch (field) {
            case "posting":
                if (
                    !isSheriffGoverned(data.posting, SHERIFF_GOOGLE_PLAY_TIMELINE)
                    || isSheriffMarked(data.posting, SHERIFF_GOOGLE_PLAY_TIMELINE)
                ) {
                    story.hideSheriffMarked = true;
                    return;
                }
                break;
            case "comment":
                if (isSheriffMarked(data.comment, SHERIFF_GOOGLE_PLAY_TIMELINE)) {
                    story.hideSheriffMarked = true;
                    return;
                }
                break;
            case "comments": {
                const comments = data.comments?.filter(c => !isSheriffMarked(c, SHERIFF_GOOGLE_PLAY_TIMELINE));
                if (comments?.length === 0) {
                    story.hideSheriffMarked = true;
                    return;
                } else {
                    data.comments = comments;
                }
                break;
            }
        }
    }
}

function updateScrollingOnActive(
    istate: WrappedObject<FeedsState>, nodeName: string, feedName: string, feed: FeedState, anchor: number | null
): void {
    if (anchor != null) {
        if (anchor <= feed.before && anchor > feed.after) {
            istate.assign([nodeName, feedName], {
                anchor,
                scrollingActive: true
            });
        } else {
            istate.assign([nodeName, feedName], {
                before: anchor,
                after: anchor,
                stories: [],
                anchor,
                scrollingActive: true,
                at: anchor
            });
        }
    } else {
        istate.set([nodeName, feedName, "scrollingActive"], true);
    }
}

function updateScrollingOnInactive(
    istate: WrappedObject<FeedsState>, nodeName: string, feedName: string, feed: FeedState
): void {
    if (feed.scrollingActive) {
        istate.assign([nodeName, feedName], {
            anchor: feed.at,
            scrollingActive: false
        });
    }
}

export default (state: FeedsState = initialState, action: WithContext<ClientAction>): FeedsState => {
    switch (action.type) {
        case "OWNER_SWITCH": {
            const istate = immutable.wrap(state);
            Object.keys(state)
                .filter(name => name !== action.payload.nodeName && name !== action.context.homeOwnerNameOrUrl)
                .forEach(name => istate.del([name]));
            return istate.value();
        }

        case "GO_TO_PAGE": {
            const istate = immutable.wrap(state);
            const nodeName = action.context.ownerNameOrUrl;
            const feedName = PAGE_FEEDS.get(action.payload.page);

            let nodeFeeds = state[nodeName];
            if (nodeFeeds == null) {
                nodeFeeds = {};
                istate.set([nodeName], {});
            }
            if (feedName != null && nodeFeeds[feedName] == null) {
                istate.set([nodeName, feedName], cloneDeep(emptyFeed));
                updateScrollingOnActive(istate, nodeName, feedName, emptyFeed, action.payload.details.at);
            }

            for (let [name, feeds] of Object.entries(state)) {
                if (feeds == null) {
                    continue;
                }
                for (let [fn, feed] of Object.entries(feeds)) {
                    if (feed != null) {
                        if (name === nodeName && fn === feedName) {
                            updateScrollingOnActive(istate, name, fn, feed, action.payload.details.at);
                        } else {
                            updateScrollingOnInactive(istate, name, fn, feed);
                        }
                    }
                }
            }

            return istate.value();
        }

        case "FEED_GENERAL_LOAD": {
            let {nodeName, feedName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            const {istate, feed} = getFeed(state, nodeName, feedName);
            if (!feed.loadedGeneral) {
                istate.set([nodeName, feedName, "loadingGeneral"], true);
            }
            return istate.value();
        }

        case "FEED_GENERAL_LOAD_FAILED": {
            const {nodeName, feedName} = action.payload;
            return getFeed(state, nodeName, feedName).istate
                .set([nodeName, feedName, "loadingGeneral"], false)
                .value();
        }

        case "FEED_GENERAL_SET": {
            const {nodeName, feedName, info} = action.payload;
            return getFeed(state, nodeName, feedName).istate
                .assign([nodeName, feedName], {
                    ...emptyInfo,
                    ...info,
                    loadingGeneral: false,
                    loadedGeneral: true
                })
                .value();
        }

        case "FEED_STATUS_LOAD": {
            let {nodeName, feedName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            return getFeed(state, nodeName, feedName).istate
                .set([nodeName, feedName, "loadingStatus"], true)
                .value();
        }

        case "FEED_STATUS_LOAD_FAILED": {
            const {nodeName, feedName} = action.payload;
            return getFeed(state, nodeName, feedName).istate
                .set([nodeName, feedName, "loadingStatus"], false)
                .value();
        }

        case "FEED_STATUS_SET": {
            let {nodeName, feedName, status} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            return getFeed(state, nodeName, feedName).istate
                .assign([nodeName, feedName], {
                    loadingStatus: false,
                    loadedStatus: true
                })
                .update([nodeName, feedName, "status"], prevStatus => ({
                    total: status.total,
                    totalPinned: status.totalPinned,
                    lastMoment: status.lastMoment ?? prevStatus.lastMoment,
                    notViewed: status.notViewed ?? prevStatus.notViewed,
                    notRead: status.notRead ?? prevStatus.notRead,
                    notViewedMoment: status.notViewedMoment ?? prevStatus.notViewedMoment,
                    notReadMoment: status.notReadMoment ?? prevStatus.notReadMoment
                }))
                .value();
        }

        case "FEED_STATUS_UPDATED": {
            let {nodeName, feedName, viewed, read, before} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            const {istate, feed} = getFeed(state, nodeName, feedName);
            for (let i = 0; i < feed.stories.length; i++) {
                if (feed.stories[i].moment <= before) {
                    if (viewed != null) {
                        istate.set([nodeName, feedName, "stories", i, "viewed"], viewed);
                    }
                    if (read != null) {
                        istate.set([nodeName, feedName, "stories", i, "read"], read);
                    }
                }
            }
            return istate.value();
        }

        case "FEED_PAST_SLICE_LOAD": {
            let {nodeName, feedName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            return getFeed(state, nodeName, feedName).istate
                .set([nodeName, feedName, "loadingPast"], true)
                .value();
        }

        case "FEED_PAST_SLICE_LOAD_FAILED": {
            const {nodeName, feedName} = action.payload;
            return getFeed(state, nodeName, feedName).istate
                .set([nodeName, feedName, "loadingPast"], false)
                .value();
        }

        case "FEED_FUTURE_SLICE_LOAD": {
            let {nodeName, feedName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            return getFeed(state, nodeName, feedName).istate
                .set([nodeName, feedName, "loadingFuture"], true)
                .value();
        }

        case "FEED_FUTURE_SLICE_LOAD_FAILED": {
            const {nodeName, feedName} = action.payload;
            return getFeed(state, nodeName, feedName).istate
                .set([nodeName, feedName, "loadingFuture"], false)
                .value();
        }

        case "FEED_PAST_SLICE_SET":
        case "FEED_FUTURE_SLICE_SET": {
            const {nodeName, feedName, ...loadedSlice} = action.payload;
            const {istate, feed} = getFeed(state, nodeName, feedName);

            if (action.type === "FEED_PAST_SLICE_SET") {
                istate.set([nodeName, feedName, "loadingPast"], false);
            }
            if (action.type === "FEED_FUTURE_SLICE_SET") {
                istate.set([nodeName, feedName, "loadingFuture"], false);
            }

            let {pending, before, after} = feed;
            pending.push(loadedSlice);
            const stories = feed.stories.slice();

            let changed = true;
            while (changed) {
                changed = false;
                const posponed: FeedSlice[] = [];
                for (const slice of pending) {
                    const prevBefore = before;
                    const prevAfter = after;
                    if (slice.before >= prevAfter && slice.after < prevAfter) {
                        slice.stories
                            .filter(t => t.moment <= prevAfter)
                            .forEach(t => stories.push(extractStory(t, action.context.homeOwnerName)));
                        after = slice.after;
                    } else if (slice.before > prevBefore && slice.after <= prevBefore) {
                        slice.stories
                            .filter(t => t.moment > prevBefore)
                            .forEach(t => stories.push(extractStory(t, action.context.homeOwnerName)));
                        before = slice.before;
                    } else {
                        posponed.push(slice);
                        continue;
                    }

                    if (slice.after <= prevAfter) {
                        istate.set([nodeName, feedName, "totalInPast"], slice.totalInPast);
                    }
                    if (slice.before >= prevBefore) {
                        istate.set([nodeName, feedName, "totalInFuture"], slice.totalInFuture);
                    }
                    changed = true;
                }
                pending = posponed;
            }

            stories.sort((a, b) => b.moment - a.moment);
            istate.assign([nodeName, feedName], {before, after, stories, pending});
            return istate.value();
        }

        case "FEED_SLICE_UPDATE": {
            const {nodeName, feedName} = action.payload;
            const {istate, feed} = getFeed(state, nodeName, feedName);
            const stories = feed.stories.slice()
                .filter(t => t.moment > action.payload.before || t.moment <= action.payload.after);
            action.payload.stories
                .forEach(t => stories.push(extractStory(t, action.context.homeOwnerName)));
            stories.sort((a, b) => b.moment - a.moment);
            istate.set([nodeName, feedName, "stories"], stories);
            if (action.payload.after <= feed.after) {
                istate.assign([nodeName, feedName], {
                    after: action.payload.after,
                    totalInPast: action.payload.totalInPast
                });
            }
            if (action.payload.before >= feed.before) {
                istate.assign([nodeName, feedName], {
                    before: action.payload.before,
                    totalInFuture: action.payload.totalInFuture
                });
            }
            return istate.value();
        }

        case "STORY_ADDED": {
            let {nodeName, story: {feedName, moment, posting}} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            const {istate, feed} = getFeed(state, nodeName, feedName);
            if (moment != null) {
                if (moment <= feed.before && moment > feed.after) {
                    if (!feed.stories.some(p => p.moment === moment)) {
                        const postingId = posting != null ? posting.id : null;
                        const count = feed.stories.length;
                        const stories = feed.stories.filter(p => p.postingId !== postingId);
                        stories.push(extractStory(action.payload.story, action.context.homeOwnerName));
                        stories.sort((a, b) => b.moment - a.moment);
                        istate.set([nodeName, feedName, "stories"], stories);
                        istate.set(
                            [nodeName, feedName, "status", "total"],
                            feed.status.total + (stories.length - count)
                        );
                    }
                } else if (moment > feed.before) {
                    istate.set([nodeName, feedName, "status", "total"], feed.status.total + 1);
                    istate.set([nodeName, feedName, "totalInFuture"], feed.totalInFuture + 1);
                } else {
                    istate.set([nodeName, feedName, "status", "total"], feed.status.total + 1);
                    istate.set([nodeName, feedName, "totalInPast"], feed.totalInPast + 1);
                }
            }
            return istate.value();
        }

        case "STORY_DELETED": {
            let {nodeName, story: {feedName, moment, id}} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            const {istate, feed} = getFeed(state, nodeName, feedName);
            istate.set([nodeName, feedName, "status", "total"], feed.status.total - 1);
            if (moment <= feed.before && moment > feed.after) {
                const index = feed.stories.findIndex(p => p.id === id);
                if (index >= 0) {
                    const stories = feed.stories.slice();
                    stories.splice(index, 1);
                    istate.set([nodeName, feedName, "stories"], stories);
                }
            } else if (moment > feed.before) {
                istate.set([nodeName, feedName, "totalInFuture"], feed.totalInFuture - 1);
            } else {
                istate.set([nodeName, feedName, "totalInPast"], feed.totalInPast - 1);
            }
            return istate.value();
        }

        case "STORY_UPDATED": {
            let {nodeName, story: {id, feedName, moment}} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            const {istate, feed} = getFeed(state, nodeName, feedName);
            let stories = null;
            const index = feed.stories.findIndex(p => p.id === id);
            if (index >= 0) {
                stories = feed.stories.slice();
                stories.splice(index, 1);
            }
            if (moment != null && moment <= feed.before && moment > feed.after) {
                const story = extractStory(action.payload.story, action.context.homeOwnerName);
                if (stories == null) {
                    stories = feed.stories.slice();
                }
                stories.push(story);
                stories.sort((a, b) => b.moment - a.moment);
            }
            return stories != null ? istate.set([nodeName, feedName, "stories"], stories).value() : istate.value();
        }

        case "FEED_SCROLLED": {
            let {nodeName, feedName, at} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            const {istate, feed} = getFeed(state, nodeName, feedName);
            if (feed.scrollingActive) {
                return istate.set([nodeName, feedName, "at"], at).value();
            } else {
                return istate.value();
            }
        }

        case "FEED_SCROLL_TO_ANCHOR": {
            let {nodeName, feedName, at} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            const {istate, feed} = getFeed(state, nodeName, feedName);
            if (feed.scrollingActive) {
                updateScrollingOnActive(istate, nodeName, feedName, feed, at);
            }
            return istate.value();
        }

        case "FEED_SCROLLED_TO_ANCHOR": {
            let {nodeName, feedName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            return getFeed(state, nodeName, feedName).istate
                .set([nodeName, feedName, "anchor"], null)
                .value();
        }

        case "STORY_READING_UPDATE": {
            let {nodeName, feedName, id, read} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            const {istate, feed} = getFeed(state, nodeName, feedName);
            const index = feed.stories.findIndex(t => t.id === id);
            if (index >= 0) {
                istate.set([nodeName, feedName, "stories", index, "read"], read);
            }
            return istate.value();
        }

        case "STORY_SATISFY": {
            let {nodeName, feedName, id} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            const {istate, feed} = getFeed(state, nodeName, feedName);
            const index = feed.stories.findIndex(t => t.id === id);
            if (index >= 0) {
                istate.set([nodeName, feedName, "stories", index, "satisfied"], true);
            }
            return istate.value();
        }

        case "SETTINGS_LANGUAGE_CHANGED": {
            const {homeOwnerName} = action.context;
            const istate = immutable.wrap(state);
            for (let [nodeName, nodeFeeds] of Object.entries(state)) {
                if (nodeFeeds == null) {
                    continue;
                }
                for (let [fn, feed] of Object.entries(nodeFeeds)) {
                    if (feed != null) {
                        istate.set([nodeName, fn, "stories"], feed.stories.map(story => ({
                            ...story,
                            summary: replaceEmojis(getInstantSummary(story, homeOwnerName))
                        })));
                    }
                }
            }
            return istate.value();
        }

        case "EVENT_NODE_FEED_SHERIFF_DATA_UPDATED": {
            const {feedName, sheriffs, sheriffMarks} = action.payload;
            const nodeName = action.context.ownerNameOrUrl;
            const {istate, feed} = getFeed(state, nodeName, feedName);
            if (!feed.loadedGeneral) {
                return state;
            }
            return istate.assign([nodeName, feedName], {sheriffs, sheriffMarks}).value();
        }

        default:
            return state;
    }
}
