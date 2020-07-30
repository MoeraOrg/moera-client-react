import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { GO_TO_PAGE } from "state/navigation/actions";
import { PAGE_DETAILED_POSTING } from "state/navigation/pages";
import {
    COMMENTS_FUTURE_SLICE_LOAD,
    COMMENTS_FUTURE_SLICE_LOAD_FAILED,
    COMMENTS_FUTURE_SLICE_SET,
    COMMENTS_PAST_SLICE_LOAD,
    COMMENTS_PAST_SLICE_LOAD_FAILED,
    COMMENTS_PAST_SLICE_SET,
    COMMENTS_SCROLL_TO_ANCHOR,
    COMMENTS_SCROLLED_TO_ANCHOR,
    COMMENTS_UNSET,
    DETAILED_POSTING_LOAD,
    DETAILED_POSTING_LOAD_FAILED,
    DETAILED_POSTING_LOADED
} from "state/detailedposting/actions";
import { safeHtml, safePreviewHtml } from "util/html";

const emptyComments = {
    loadingFuture: false,
    loadingPast: false,
    before: Number.MAX_SAFE_INTEGER,
    after: Number.MAX_SAFE_INTEGER,
    comments: [],
    anchor: null
};

const initialState = {
    id: null,
    loading: false,
    comments: cloneDeep(emptyComments),
    compose: {
        beingPosted: false
    }
};

function extractComment(comment) {
    if (!comment.bodyPreview.text) {
        comment = immutable.set(comment, "body.previewText", safePreviewHtml(comment.body.text));
    }
    return immutable.wrap(comment)
        .update("bodyPreview.text", text => safePreviewHtml(text))
        .update("body.text", text => safeHtml(text))
        .value();
}

export default (state = initialState, action) => {
    switch (action.type) {
        case GO_TO_PAGE:
            if (action.payload.page === PAGE_DETAILED_POSTING && state.id !== action.payload.details.id) {
                return {
                    ...state,
                    id: action.payload.details.id,
                    loading: false,
                    comments: cloneDeep(emptyComments)
                }
            }
            return state;

        case DETAILED_POSTING_LOAD:
            return {
                ...state,
                loading: true
            };

        case DETAILED_POSTING_LOADED:
        case DETAILED_POSTING_LOAD_FAILED:
            return {
                ...state,
                loading: false
            };

        case COMMENTS_PAST_SLICE_LOAD:
            return immutable.set(state, "comments.loadingPast", true);

        case COMMENTS_PAST_SLICE_LOAD_FAILED:
            if (action.payload.postingId !== state.id) {
                return state;
            }
            return immutable.set(state, "comments.loadingPast", false);

        case COMMENTS_FUTURE_SLICE_LOAD:
            return immutable.set(state, "comments.loadingFuture", true);

        case COMMENTS_FUTURE_SLICE_LOAD_FAILED:
            if (action.payload.postingId !== state.id) {
                return state;
            }
            return immutable.set(state, "comments.loadingFuture", false);

        case COMMENTS_PAST_SLICE_SET: {
            if (action.payload.postingId !== state.id) {
                return state;
            }
            const istate = immutable.wrap(state);
            if (action.payload.before >= state.comments.after && action.payload.after < state.comments.after) {
                const comments = state.comments.comments.slice();
                action.payload.comments
                    .filter(c => c.moment <= state.comments.after)
                    .forEach(c => comments.push(extractComment(c)));
                comments.sort((a, b) => a.moment - b.moment);
                return istate.assign("comments", {
                    loadingPast: false,
                    after: action.payload.after,
                    comments
                }).value();
            } else {
                return istate.set("comments.loadingPast", false).value();
            }
        }

        case COMMENTS_FUTURE_SLICE_SET: {
            if (action.payload.postingId !== state.id) {
                return state;
            }
            const istate = immutable.wrap(state);
            if (action.payload.before > state.comments.before && action.payload.after <= state.comments.before) {
                const comments = state.comments.comments.slice();
                action.payload.comments
                    .filter(c => c.moment > state.comments.before)
                    .forEach(c => comments.push(extractComment(c)));
                comments.sort((a, b) => a.moment - b.moment);
                return istate.assign("comments", {
                    loadingFuture: false,
                    before: action.payload.before,
                    comments
                }).value();
            } else {
                return istate.set("comments.loadingFuture", false).value();
            }
        }

        case COMMENTS_UNSET: {
            const anchor = state.anchor;
            return immutable.wrap(state)
                .assign("comments", {
                    loadingFuture: false,
                    loadingPast: false,
                    before: anchor,
                    after: anchor,
                    comments: [],
                    anchor
                })
                .value();
        }

        case COMMENTS_SCROLL_TO_ANCHOR: {
            const {anchor} = action.payload;
            const istate = immutable.wrap(state);
            if (anchor != null) {
                if (anchor <= state.comments.before && anchor > state.comments.after) {
                    istate.set("comments.anchor", anchor);
                } else {
                    istate.assign("comments", {
                        before: anchor,
                        after: anchor,
                        comments: [],
                        anchor
                    });
                }
            }
            return istate.value();
        }

        case COMMENTS_SCROLLED_TO_ANCHOR:
            return immutable.set(state, "comments.anchor", null);

        default:
            return state;
    }
}
