import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

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
    FEED_SUBSCRIBE,
    FEED_SUBSCRIBE_FAILED,
    FEED_SUBSCRIBED,
    FEED_UNSUBSCRIBE,
    FEED_UNSUBSCRIBE_FAILED,
    FEED_UNSUBSCRIBED,
    FEEDS_UNSET
} from "state/feeds/actions";
import { GO_TO_PAGE, INIT_FROM_LOCATION } from "state/navigation/actions";
import { STORY_ADDED, STORY_DELETED, STORY_READING_UPDATE, STORY_UPDATED } from "state/stories/actions";
import { emptyFeed, emptyInfo } from "state/feeds/empty";
import { PAGE_NEWS, PAGE_TIMELINE } from "state/navigation/pages";
import { replaceEmojis } from "util/html";

const initialState = {
};

function getFeed(state, feedName) {
    const istate = immutable.wrap(state);
    let feed = state[feedName];
    if (feed == null) {
        feed = cloneDeep(emptyFeed);
        istate.set([feedName], feed);
    }
    return {istate, feed};
}

const PAGE_FEEDS = new Map([
    [PAGE_TIMELINE, "timeline"],
    [PAGE_NEWS, "news"]
]);

function extractStory(story) {
    const t = {...story};
    delete t.feedName;
    delete t.posting;
    if (story.posting) {
        t.postingId = story.posting.id;
    }
    delete t.comment;
    if (story.comment) {
        t.commentId = story.comment.id;
    }
    t.summary = replaceEmojis(story.summary);
    return t;
}

function updateScrollingOnActive(istate, feedName, feed, anchor) {
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

function updateScrollingOnInactive(istate, feedName, feed) {
    if (feed.scrollingActive) {
        istate.assign([feedName], {
            anchor: feed.at,
            scrollingActive: false
        });
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case INIT_FROM_LOCATION: {
            const istate = immutable.wrap(state);
            Object.getOwnPropertyNames(state)
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
                if (fn === feedName) {
                    updateScrollingOnActive(istate, fn, feed, action.payload.details.at);
                } else {
                    updateScrollingOnInactive(istate, fn, feed);
                }
            }
            return istate.value();
        }

        case FEED_GENERAL_LOAD: {
            const {feedName} = action.payload;
            return getFeed(state, feedName).istate
                .set([feedName, "loadingGeneral"], true)
                .value();
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

        case FEED_SUBSCRIBE: {
            const {nodeName, feedName} = action.payload;
            if (nodeName === "") {
                return getFeed(state, feedName).istate
                    .set([feedName, "subscribing"], true)
                    .value();
            }
            return state;
        }

        case FEED_SUBSCRIBED: {
            const {nodeName, feedName, subscriberId} = action.payload;
            if (nodeName === "") {
                return getFeed(state, feedName).istate
                    .assign([feedName], {
                        subscribing: false,
                        subscriberId
                    })
                    .value();
            }
            return state;
        }

        case FEED_SUBSCRIBE_FAILED: {
            const {nodeName, feedName} = action.payload;
            if (nodeName === "") {
                return getFeed(state, feedName).istate
                    .set([feedName, "subscribing"], false)
                    .value();
            }
            return state;
        }

        case FEED_UNSUBSCRIBE: {
            const {nodeName, feedName} = action.payload;
            if (nodeName === "") {
                return getFeed(state, feedName).istate
                    .set([feedName, "unsubscribing"], true)
                    .value();
            }
            return state;
        }

        case FEED_UNSUBSCRIBED: {
            const {nodeName, feedName} = action.payload;
            if (nodeName === "") {
                return getFeed(state, feedName).istate
                    .assign([feedName], {
                        unsubscribing: false,
                        subscriberId: null
                    })
                    .value();
            }
            return state;
        }

        case FEED_UNSUBSCRIBE_FAILED: {
            const {nodeName, feedName} = action.payload;
            if (nodeName === "") {
                return getFeed(state, feedName).istate
                    .set([feedName, "unsubscribing"], false)
                    .value();
            }
            return state;
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
                    ...status,
                    loadingStatus: false,
                    loadedStatus: true
                })
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
                    .forEach(t => stories.push(extractStory(t)));
                stories.sort((a, b) => b.moment - a.moment);
                return istate.assign([feedName], {
                    loadingPast: false,
                    after: action.payload.after,
                    stories
                }).value();
            } else {
                return istate.set([feedName, "loadingPast"], false).value();
            }
        }

        case FEED_FUTURE_SLICE_SET: {
            const {feedName} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            if (action.payload.before > feed.before && action.payload.after <= feed.before) {
                const stories = feed.stories.slice();
                action.payload.stories
                    .filter(t => t.moment > feed.before)
                    .forEach(t => stories.push(extractStory(t)));
                stories.sort((a, b) => b.moment - a.moment);
                return istate.assign([feedName], {
                    loadingFuture: false,
                    before: action.payload.before,
                    stories
                }).value();
            } else {
                return istate.set([feedName, "loadingFuture"], false).value();
            }
        }

        case FEED_SLICE_UPDATE: {
            const {feedName} = action.payload;
            const {istate, feed} = getFeed(state, feedName);
            const stories = feed.stories.slice()
                .filter(t => t.moment > action.payload.before || t.moment <= action.payload.after);
            action.payload.stories
                .filter(t => t.moment <= feed.before && t.moment > feed.after)
                .forEach(t => stories.push(extractStory(t)));
            stories.sort((a, b) => b.moment - a.moment);
            return istate.assign([feedName], {stories}).value();
        }

        case FEEDS_UNSET: {
            const istate = immutable.wrap(state);
            for (let [feedName, feed] of Object.entries(state)) {
                istate.assign([feedName], {
                    before: feed.at,
                    after: feed.at,
                    stories: [],
                    anchor: feed.at
                })
            }
            return istate.value();
        }

        case STORY_ADDED: {
            const {feedName, moment, posting} = action.payload.story;
            const {istate, feed} = getFeed(state, feedName);
            if (moment != null && moment <= feed.before && moment > feed.after) {
                if (!feed.stories.some(p => p.moment === moment)) {
                    const postingId = posting != null ? posting.id : null;
                    const stories = feed.stories.filter(p => p.postingId !== postingId);
                    stories.push(extractStory(action.payload.story));
                    stories.sort((a, b) => b.moment - a.moment);
                    return istate.set([feedName, "stories"], stories).value();
                }
            }
            return istate.value();
        }

        case STORY_DELETED: {
            const {feedName, moment, id} = action.payload.story;
            const {istate, feed} = getFeed(state, feedName);
            if (moment <= feed.before && moment > feed.after) {
                const index = feed.stories.findIndex(p => p.id === id);
                if (index >= 0) {
                    const stories = feed.stories.slice();
                    stories.splice(index, 1);
                    return istate.set([feedName, "stories"], stories).value();
                }
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
                const story = extractStory(action.payload.story);
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

        default:
            return state;
    }
}
