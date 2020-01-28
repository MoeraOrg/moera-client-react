import immutable from 'object-path-immutable';
import selectn from 'selectn';

import { TIMELINE_FUTURE_SLICE_SET, TIMELINE_PAST_SLICE_SET } from "state/timeline/actions";
import {
    POSTING_DELETE,
    POSTING_DELETED,
    POSTING_REACT,
    POSTING_REACTION_DELETE,
    POSTING_REACTION_SET,
    POSTING_SET,
    POSTING_VERIFY,
    POSTING_VERIFY_FAILED
} from "state/postings/actions";
import { EVENT_HOME_REMOTE_POSTING_VERIFICATION_FAILED, EVENT_HOME_REMOTE_POSTING_VERIFIED } from "api/events/actions";
import { safeHtml, safePreviewHtml } from "util/html";

const initialState = {
};

function safeguard(posting) {
    if (!posting.bodyPreview.text) {
        posting = immutable.set(posting, "body.previewText", safePreviewHtml(posting.body.text));
    }
    return immutable(posting)
        .update("bodyPreview.text", text => safePreviewHtml(text))
        .update("body.text", text => safeHtml(text))
        .value();
}

export default (state = initialState, action) => {
    switch (action.type) {
        case TIMELINE_PAST_SLICE_SET:
        case TIMELINE_FUTURE_SLICE_SET:
            let istate = immutable(state);
            action.payload.postings.forEach(p => istate
                .set([p.id, "posting"], safeguard(p))
                .set([p.id, "deleting"], false)
                .set([p.id, "verificationStatus"], "none"));
            return istate.value();

        case POSTING_SET:
            const posting = action.payload.posting;
            return immutable(state)
                .set([posting.id, "posting"], safeguard(posting))
                .set([posting.id, "deleting"], false)
                .set([posting.id, "verificationStatus"], "none")
                .value();

        case POSTING_DELETE:
            return immutable.set(state, [action.payload.id, "deleting"], true);

        case POSTING_DELETED:
            return immutable.del(state, [action.payload.id]);

        case POSTING_VERIFY:
            return immutable.set(state, [action.payload.id, "verificationStatus"], "running");

        case POSTING_VERIFY_FAILED:
            return immutable.set(state, [action.payload.id, "verificationStatus"], "none");

        case EVENT_HOME_REMOTE_POSTING_VERIFIED: {
            const posting = selectn([action.payload.postingId, "posting"], state);
            if (posting && posting.receiverName === action.payload.receiverName
                && (!action.payload.revisionId || posting.revisionId === action.payload.revisionId)) {

                const status = action.payload.correct ? "correct" : "incorrect";
                return immutable.set(state, [action.payload.postingId, "verificationStatus"], status);
            }
            return state;
        }

        case EVENT_HOME_REMOTE_POSTING_VERIFICATION_FAILED: {
            const posting = selectn([action.payload.postingId, "posting"], state);
            if (posting && posting.receiverName === action.payload.receiverName
                && (!action.payload.revisionId && posting.revisionId === action.payload.revisionId)) {

                return immutable.set(state, [action.payload.postingId, "verificationStatus"], "none");
            }
            return state;
        }

        case POSTING_REACT: {
            const {id, negative, emoji} = action.payload;
            if (state[id]) {
                return immutable.set(state, [id, "posting", "clientReaction"], {negative, emoji});
            }
            return state;
        }

        case POSTING_REACTION_DELETE:
            if (state[action.payload.id]) {
                return immutable.del(state, [action.payload.id, "posting", "clientReaction"]);
            }
            return state;

        case POSTING_REACTION_SET: {
            const {id, reaction, totals} = action.payload;
            if (state[id]) {
                return immutable(state)
                    .set([id, "posting", "clientReaction"], reaction)
                    .set([id, "posting", "reactions"], totals)
                    .value();
            }
            return state;
        }

        default:
            return state;
    }
}
