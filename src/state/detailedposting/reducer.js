import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { GO_TO_PAGE } from "state/navigation/actions";
import { PAGE_DETAILED_POSTING } from "state/navigation/pages";
import {
    COMMENT_POSTED,
    COMMENT_SET,
    COMMENTS_FUTURE_SLICE_LOAD,
    COMMENTS_FUTURE_SLICE_LOAD_FAILED,
    COMMENTS_FUTURE_SLICE_SET,
    COMMENTS_PAST_SLICE_LOAD,
    COMMENTS_PAST_SLICE_LOAD_FAILED,
    COMMENTS_PAST_SLICE_SET,
    COMMENTS_RECEIVER_SWITCHED,
    COMMENTS_SCROLL_TO_ANCHOR,
    COMMENTS_SCROLLED_TO_ANCHOR,
    DETAILED_POSTING_LOAD,
    DETAILED_POSTING_LOAD_FAILED,
    DETAILED_POSTING_LOADED
} from "state/detailedposting/actions";
import { safeHtml, safePreviewHtml } from "util/html";

const emptyComments = {
    receiverName: null,
    receiverPostingId: null,
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
        formId: 0,
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

        case COMMENTS_RECEIVER_SWITCHED:
            return immutable.assign(state, "comments", {
                ...cloneDeep(emptyComments),
                receiverName: action.payload.nodeName,
                receiverPostingId: action.payload.postingId
            });

        case COMMENTS_PAST_SLICE_LOAD:
            return immutable.set(state, "comments.loadingPast", true);

        case COMMENTS_PAST_SLICE_LOAD_FAILED:
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            return immutable.set(state, "comments.loadingPast", false);

        case COMMENTS_FUTURE_SLICE_LOAD:
            return immutable.set(state, "comments.loadingFuture", true);

        case COMMENTS_FUTURE_SLICE_LOAD_FAILED:
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            return immutable.set(state, "comments.loadingFuture", false);

        case COMMENTS_PAST_SLICE_SET: {
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
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
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
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

        case COMMENT_POSTED:
            if (action.payload.nodeName !== state.comments.receiverName
                || action.payload.postingId !== state.comments.receiverPostingId) {
                return state;
            }
            return immutable.set(state, "compose.formId", state.compose.formId + 1);

        case COMMENT_SET: {
            const {nodeName, comment} = action.payload;
            if (nodeName === state.comments.receiverName
                && comment.postingId === state.comments.receiverPostingId
                && comment.moment <= state.comments.before
                && comment.moment > state.comments.after) {

                const comments = state.comments.comments.filter(c => c.id !== comment.id);
                comments.push(extractComment(comment));
                comments.sort((a, b) => a.moment - b.moment);
                return immutable.set(state, "comments.comments", comments);
            }
            return state;
        }

        default:
            return state;
    }
}
