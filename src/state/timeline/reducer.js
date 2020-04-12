import {
    TIMELINE_FUTURE_SLICE_LOAD,
    TIMELINE_FUTURE_SLICE_LOAD_FAILED,
    TIMELINE_FUTURE_SLICE_SET,
    TIMELINE_GENERAL_LOAD,
    TIMELINE_GENERAL_LOAD_FAILED,
    TIMELINE_GENERAL_SET,
    TIMELINE_PAST_SLICE_LOAD,
    TIMELINE_PAST_SLICE_LOAD_FAILED,
    TIMELINE_PAST_SLICE_SET,
    TIMELINE_SCROLLED,
    TIMELINE_SCROLLED_TO_ANCHOR,
    TIMELINE_STORY_ADDED,
    TIMELINE_STORY_DELETED,
    TIMELINE_STORY_UPDATED,
    TIMELINE_UNSET
} from "state/timeline/actions";
import { GO_TO_PAGE } from "state/navigation/actions";
import { PAGE_TIMELINE } from "state/navigation/pages";

const emptyInfo = {
    operations: {
        add: []
    }
};

const initialState = {
    loadingGeneral: false,
    loadedGeneral: false,
    ...emptyInfo,
    loadingFuture: false,
    loadingPast: false,
    before: Number.MAX_SAFE_INTEGER,
    after: Number.MAX_SAFE_INTEGER,
    stories: [],
    anchor: null,
    scrollingActive: false,
    at: Number.MAX_SAFE_INTEGER
};

const goToPageTimeline = (state, action) => {
    const anchor = action.payload.details.at;
    if (anchor != null) {
        if (anchor <= state.before && anchor > state.after) {
            return {
                ...state,
                anchor,
                scrollingActive: true
            }
        } else {
            return {
                ...state,
                before: anchor,
                after: anchor,
                stories: [],
                anchor,
                scrollingActive: true,
                at: anchor
            }
        }
    } else {
        return {
            ...state,
            scrollingActive: true
        }
    }
};

const goToPageOther = (state, action) => {
    if (state.scrollingActive) {
        return {
            ...state,
            anchor: state.at,
            scrollingActive: false
        }
    } else {
        return state;
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GO_TO_PAGE:
            if (action.payload.page === PAGE_TIMELINE) {
                return goToPageTimeline(state, action);
            } else {
                return goToPageOther(state, action);
            }

        case TIMELINE_GENERAL_LOAD:
            return {
                ...state,
                loadingGeneral: true
            };

        case TIMELINE_GENERAL_LOAD_FAILED:
            return {
                ...state,
                loadingGeneral: false
            };

        case TIMELINE_GENERAL_SET:
            return {
                ...state,
                ...emptyInfo,
                ...action.payload.info,
                loadingGeneral: false,
                loadedGeneral: true
            };

        case TIMELINE_PAST_SLICE_LOAD:
            return {
                ...state,
                loadingPast: true
            };

        case TIMELINE_PAST_SLICE_LOAD_FAILED:
            return {
                ...state,
                loadingPast: false
            };

        case TIMELINE_FUTURE_SLICE_LOAD:
            return {
                ...state,
                loadingFuture: true
            };

        case TIMELINE_FUTURE_SLICE_LOAD_FAILED:
            return {
                ...state,
                loadingFuture: false
            };

        case TIMELINE_PAST_SLICE_SET:
            if (action.payload.before >= state.after && action.payload.after < state.after) {
                let stories = state.stories.slice();
                action.payload.stories
                    .filter(s => s.moment <= state.after)
                    .forEach(s => stories.push({
                        id: s.id,
                        publishedAt: s.publishedAt,
                        moment: s.moment,
                        postingId: s.posting.id
                    }));
                stories.sort((a, b) => b.moment - a.moment);
                return {
                    ...state,
                    loadingPast: false,
                    after: action.payload.after,
                    stories
                }
            } else {
                return {
                    ...state,
                    loadingPast: false
                }
            }

        case TIMELINE_FUTURE_SLICE_SET:
            if (action.payload.before > state.before && action.payload.after <= state.before) {
                let stories = state.stories.slice();
                action.payload.stories
                    .filter(s => s.moment > state.before)
                    .forEach(s => stories.push({
                        id: s.id,
                        publishedAt: s.publishedAt,
                        moment: s.moment,
                        postingId: s.posting.id
                    }));
                stories.sort((a, b) => b.moment - a.moment);
                return {
                    ...state,
                    loadingFuture: false,
                    before: action.payload.before,
                    stories
                }
            } else {
                return {
                    ...state,
                    loadingFuture: false
                }
            }

        case TIMELINE_UNSET:
            return {
                ...state,
                before: state.at,
                after: state.at,
                stories: [],
                anchor: state.at
            };

        case TIMELINE_STORY_ADDED: {
            const {id, publishedAt, moment, postingId} = action.payload;
            if (moment != null && moment <= state.before && moment > state.after) {
                if (!state.stories.some(p => p.moment === moment)) {
                    const stories = state.stories.filter(p => p.postingId !== postingId);
                    stories.push({id, publishedAt, moment, postingId});
                    stories.sort((a, b) => b.moment - a.moment);
                    return {
                        ...state,
                        stories
                    }
                }
            }
            return state;
        }

        case TIMELINE_STORY_DELETED: {
            const {moment, id} = action.payload;
            if (moment <= state.before && moment > state.after) {
                const index = state.stories.findIndex(p => p.id === id);
                if (index >= 0) {
                    const stories = state.stories.slice();
                    stories.splice(index, 1);
                    return {
                        ...state,
                        stories
                    }
                }
            }
            return state;
        }

        case TIMELINE_STORY_UPDATED: {
            const {id, publishedAt, moment, postingId} = action.payload;
            const index = state.stories.findIndex(p => p.id === id);
            if (index < 0) {
                return state;
            }
            const stories = state.stories.slice();
            stories.splice(index, 1);
            if (moment != null && moment <= state.before && moment > state.after) {
                stories.push({id, publishedAt, moment, postingId});
                stories.sort((a, b) => b.moment - a.moment);
            }
            return {
                ...state,
                stories
            }
        }

        case TIMELINE_SCROLLED:
            if (state.scrollingActive) {
                return {
                    ...state,
                    at: action.payload.at
                }
            } else {
                return state;
            }

        case TIMELINE_SCROLLED_TO_ANCHOR:
            return {
                ...state,
                anchor: null
            };

        default:
            return state;
    }
}
