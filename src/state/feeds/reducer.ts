import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { StoryInfo } from "api/node/api-types";
import { EVENT_NODE_FEED_SHERIFF_DATA_UPDATED } from "api/events/actions";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import {
    FEED_FUTURE_SLICE_LOAD,
    FEED_FUTURE_SLICE_LOAD_FAILED,
    FEED_FUTURE_SLICE_SET,
    FEED_GENERAL_LOAD,
    FEED_GENERAL_LOAD_FAILED,
    FEED_GENERAL_SET,
    FEED_GENERAL_UNSET,
    FEED_PAST_SLICE_LOAD,
    FEED_PAST_SLICE_LOAD_FAILED,
    FEED_PAST_SLICE_SET,
    FEED_SCROLL_TO_ANCHOR,
    FEED_SCROLLED,
    FEED_SCROLLED_TO_ANCHOR,
    FEED_SLICE_UPDATE,
    FEED_STATUS_LOAD,
    FEED_STATUS_LOAD_FAILED,
    FEED_STATUS_SET,
    FEED_STATUS_UPDATED,
    FEEDS_UNSET
} from "state/feeds/actions";
import { emptyFeed, emptyInfo } from "state/feeds/empty";
import { ExtStoryInfo, FeedsState, FeedState } from "state/feeds/state";
import { GO_TO_PAGE, INIT_FROM_LOCATION } from "state/navigation/actions";
import { Page, PAGE_NEWS, PAGE_TIMELINE } from "state/navigation/pages";
import { SETTINGS_LANGUAGE_CHANGED } from "state/settings/actions";
import { STORY_ADDED, STORY_DELETED, STORY_READING_UPDATE, STORY_SATISFY, STORY_UPDATED } from "state/stories/actions";
import { getInstantSummary, getInstantTypeDetails } from "ui/instant/instant-types";
import { replaceEmojis } from "util/html";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { isSheriffGoverned, isSheriffMarked } from "util/sheriff";

const initialState = {
};

function getFeed(state: FeedsState, feedName: string): {istate: WrappedObject<FeedsState>, feed: FeedState} {
    const istate = immutable.wrap(state);
    let feed = state[feedName];
    if (feed == null) {
        feed = cloneDeep(emptyFeed);
        istate.set([feedName], feed);
    }
    return {istate, feed};
}

const PAGE_FEEDS = new Map<Page, string>([
    [PAGE_TIMELINE, "timeline"],
    [PAGE_NEWS, "news"]
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
                if (!isSheriffGoverned(data.posting, SHERIFF_GOOGLE_PLAY_TIMELINE)
                    || isSheriffMarked(data.posting, SHERIFF_GOOGLE_PLAY_TIMELINE)) {

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

function updateScrollingOnActive(istate: WrappedObject<FeedsState>, feedName: string, feed: FeedState,
                                 anchor: number | null): void {
    if (anchor != null) {
        if (anchor <= feed.before && anchor > feed.after) {
            istate.assign([feedName], {
                anchor,
                scrollingActive: true
            });
        } else {
            istate.assign([feedName], {
                before: anchor,
                after: anchor,
                stories: [],
                anchor,
                scrollingActive: true,
                at: anchor
            });
        }
    } else {
        istate.set([feedName, "scrollingActive"], true);
    }
}

function updateScrollingOnInactive(istate: WrappedObject<FeedsState>, feedName: string, feed: FeedState): void {
    if (feed.scrollingActive) {
        istate.assign([feedName], {
            anchor: feed.at,
            scrollingActive: false
        });
    }
}

export default (state: FeedsState = initialState, action: WithContext<ClientAction>): FeedsState => {
    switch (action.type) {
        case INIT_FROM_LOCATION: {
            const istate = immutable.wrap(state);
            Object.keys(state)
                .filter(name => !name.startsWith(":"))
                .forEach(name => istate.del([name]));
            return istate.value();
        }

        case GO_TO_PAGE: {
            const istate = immutable.wrap(state);
            const feedName = PAGE_FEEDS.get(action.payload.page);
            if (feedName != null && state[feedName] == null) {
                istate.set([feedName], cloneDeep(emptyFeed));
                updateScrollingOnActive(istate, feedName, emptyFeed, action.payload.details.at);
            }
            for (let [fn, feed] of Object.entries(state)) {
                if (feed != null) {
                    if (fn === feedName) {
                        updateScrollingOnActive(istate, fn, feed, action.payload.details.at);
                    } else {
                        updateScrollingOnInactive(istate, fn, feed);
                    }
                }
            }
            return istate.value();
        }

        case FEED_GENERAL_LOAD: {
            const {feedName} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            if (!feed.loadedGeneral) {
                istate.set([feedName, "loadingGeneral"], true);
            }
            return istate.value();
        }

        case FEED_GENERAL_LOAD_FAILED: {
            const {feedName} = action.payload;
            return getFeed(state, feedName).istate
                .set([feedName, "loadingGeneral"], false)
                .value();
        }

        case FEED_GENERAL_SET: {
            const {feedName, info} = action.payload;
            return getFeed(state, feedName).istate
                .assign([feedName], {
                    ...emptyInfo,
                    ...info,
                    loadingGeneral: false,
                    loadedGeneral: true
                })
                .value();
        }

        case FEED_GENERAL_UNSET: {
            const {feedName} = action.payload;
            return getFeed(state, feedName).istate
                .assign([feedName], {
                    ...emptyInfo,
                    loadingGeneral: false,
                    loadedGeneral: false
                })
                .value();
        }

        case FEED_STATUS_LOAD: {
            const {feedName} = action.payload;
            return getFeed(state, feedName).istate
                .set([feedName, "loadingStatus"], true)
                .value();
        }

        case FEED_STATUS_LOAD_FAILED: {
            const {feedName} = action.payload;
            return getFeed(state, feedName).istate
                .set([feedName, "loadingStatus"], false)
                .value();
        }

        case FEED_STATUS_SET: {
            const {feedName, status} = action.payload;
            return getFeed(state, feedName).istate
                .assign([feedName], {
                    loadingStatus: false,
                    loadedStatus: true
                })
                .update([feedName, "status"], prevStatus => ({
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

        case FEED_STATUS_UPDATED: {
            const {feedName, viewed, read, before} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            for (let i = 0; i < feed.stories.length; i++) {
                if (feed.stories[i].moment <= before) {
                    if (viewed != null) {
                        istate.set([feedName, "stories", i, "viewed"], viewed);
                    }
                    if (read != null) {
                        istate.set([feedName, "stories", i, "read"], read);
                    }
                }
            }
            return istate.value();
        }

        case FEED_PAST_SLICE_LOAD: {
            const {feedName} = action.payload;
            return getFeed(state, feedName).istate
                .set([feedName, "loadingPast"], true)
                .value();
        }

        case FEED_PAST_SLICE_LOAD_FAILED: {
            const {feedName} = action.payload;
            return getFeed(state, feedName).istate
                .set([feedName, "loadingPast"], false)
                .value();
        }

        case FEED_FUTURE_SLICE_LOAD: {
            const {feedName} = action.payload;
            return getFeed(state, feedName).istate
                .set([feedName, "loadingFuture"], true)
                .value();
        }

        case FEED_FUTURE_SLICE_LOAD_FAILED: {
            const {feedName} = action.payload;
            return getFeed(state, feedName).istate
                .set([feedName, "loadingFuture"], false)
                .value();
        }

        case FEED_PAST_SLICE_SET: {
            const {feedName} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            if (action.payload.before >= feed.after && action.payload.after < feed.after) {
                const stories = feed.stories.slice();
                action.payload.stories
                    .filter(t => t.moment <= feed.after)
                    .forEach(t => stories.push(extractStory(t, action.context.homeOwnerName)));
                stories.sort((a, b) => b.moment - a.moment);
                istate.assign([feedName], {
                    loadingPast: false,
                    after: action.payload.after,
                    stories
                });
            } else {
                istate.set([feedName, "loadingPast"], false);
            }
            if (action.payload.after <= feed.after) {
                istate.set([feedName, "totalInPast"], action.payload.totalInPast);
            }
            if (action.payload.before >= feed.before) {
                istate.set([feedName, "totalInFuture"], action.payload.totalInFuture);
            }
            return istate.value();
        }

        case FEED_FUTURE_SLICE_SET: {
            const {feedName} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            if (action.payload.before > feed.before && action.payload.after <= feed.before) {
                const stories = feed.stories.slice();
                action.payload.stories
                    .filter(t => t.moment > feed.before)
                    .forEach(t => stories.push(extractStory(t, action.context.homeOwnerName)));
                stories.sort((a, b) => b.moment - a.moment);
                istate.assign([feedName], {
                    loadingFuture: false,
                    before: action.payload.before,
                    stories,
                    totalInFuture: action.payload.totalInFuture
                });
            } else {
                istate.set([feedName, "loadingFuture"], false);
            }
            if (action.payload.after <= feed.after) {
                istate.set([feedName, "totalInPast"], action.payload.totalInPast);
            }
            if (action.payload.before >= feed.before) {
                istate.set([feedName, "totalInFuture"], action.payload.totalInFuture);
            }
            return istate.value();
        }

        case FEED_SLICE_UPDATE: {
            const {feedName} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            const stories = feed.stories.slice()
                .filter(t => t.moment > action.payload.before || t.moment <= action.payload.after);
            action.payload.stories
                .forEach(t => stories.push(extractStory(t, action.context.homeOwnerName)));
            stories.sort((a, b) => b.moment - a.moment);
            istate.set([feedName, "stories"], stories);
            if (action.payload.after <= feed.after) {
                istate.assign([feedName], {
                    after: action.payload.after,
                    totalInPast: action.payload.totalInPast
                });
            }
            if (action.payload.before >= feed.before) {
                istate.assign([feedName], {
                    before: action.payload.before,
                    totalInFuture: action.payload.totalInFuture
                });
            }
            return istate.value();
        }

        case FEEDS_UNSET: {
            const istate = immutable.wrap(state);
            for (let [feedName, feed] of Object.entries(state)) {
                if (feed != null) {
                    istate.assign([feedName], {
                        before: feed.at,
                        after: feed.at,
                        stories: [],
                        anchor: feed.at,
                        loadedStatus: false
                    });
                    istate.assign([feedName, "status"], {
                        notViewed: 0,
                        notRead: 0,
                        notViewedMoment: null,
                        notReadMoment: null
                    });
                }
            }
            return istate.value();
        }

        case STORY_ADDED: {
            const {feedName, moment, posting} = action.payload.story;
            const {istate, feed} = getFeed(state, feedName);
            if (moment != null) {
                if (moment <= feed.before && moment > feed.after) {
                    if (!feed.stories.some(p => p.moment === moment)) {
                        const postingId = posting != null ? posting.id : null;
                        const count = feed.stories.length;
                        const stories = feed.stories.filter(p => p.postingId !== postingId);
                        stories.push(extractStory(action.payload.story, action.context.homeOwnerName));
                        stories.sort((a, b) => b.moment - a.moment);
                        istate.set([feedName, "stories"], stories);
                        istate.set([feedName, "status", "total"], feed.status.total + (stories.length - count));
                    }
                } else if (moment > feed.before) {
                    istate.set([feedName, "status", "total"], feed.status.total + 1);
                    istate.set([feedName, "totalInFuture"], feed.totalInFuture + 1);
                } else {
                    istate.set([feedName, "status", "total"], feed.status.total + 1);
                    istate.set([feedName, "totalInPast"], feed.totalInPast + 1);
                }
            }
            return istate.value();
        }

        case STORY_DELETED: {
            const {feedName, moment, id} = action.payload.story;
            const {istate, feed} = getFeed(state, feedName);
            istate.set([feedName, "status", "total"], feed.status.total - 1);
            if (moment <= feed.before && moment > feed.after) {
                const index = feed.stories.findIndex(p => p.id === id);
                if (index >= 0) {
                    const stories = feed.stories.slice();
                    stories.splice(index, 1);
                    istate.set([feedName, "stories"], stories);
                }
            } else if (moment > feed.before) {
                istate.set([feedName, "totalInFuture"], feed.totalInFuture - 1);
            } else {
                istate.set([feedName, "totalInPast"], feed.totalInPast - 1);
            }
            return istate.value();
        }

        case STORY_UPDATED: {
            const {id, feedName, moment} = action.payload.story;
            const {istate, feed} = getFeed(state, feedName);
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
            return stories != null ? istate.set([feedName, "stories"], stories).value() : istate.value();
        }

        case FEED_SCROLLED: {
            const {feedName, at} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            if (feed.scrollingActive) {
                return istate.set([feedName, "at"], at).value();
            } else {
                return istate.value();
            }
        }

        case FEED_SCROLL_TO_ANCHOR: {
            const {feedName, at} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            if (feed.scrollingActive) {
                updateScrollingOnActive(istate, feedName, feed, at);
            }
            return istate.value();
        }

        case FEED_SCROLLED_TO_ANCHOR: {
            const {feedName} = action.payload;
            return getFeed(state, feedName).istate
                .set([feedName, "anchor"], null)
                .value();
        }

        case STORY_READING_UPDATE: {
            const {feedName, id, read} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            const index = feed.stories.findIndex(t => t.id === id);
            if (index >= 0) {
                istate.set([feedName, "stories", index, "read"], read);
            }
            return istate.value();
        }

        case STORY_SATISFY: {
            const {feedName, id} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            const index = feed.stories.findIndex(t => t.id === id);
            if (index >= 0) {
                istate.set([feedName, "stories", index, "satisfied"], true);
            }
            return istate.value();
        }

        case SETTINGS_LANGUAGE_CHANGED: {
            const {homeOwnerName} = action.context;
            const istate = immutable.wrap(state);
            for (let [fn, feed] of Object.entries(state)) {
                if (feed != null) {
                    istate.set([fn, "stories"], feed.stories.map(story => ({
                        ...story,
                        summary: replaceEmojis(getInstantSummary(story, homeOwnerName))
                    })));
                }
            }
            return istate.value();
        }

        case EVENT_NODE_FEED_SHERIFF_DATA_UPDATED: {
            const {feedName, sheriffs, sheriffMarks} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            if (!feed.loadedGeneral) {
                return state;
            }
            return istate.assign([feedName], {sheriffs, sheriffMarks}).value();
        }

        default:
            return state;
    }
}
