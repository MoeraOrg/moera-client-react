import * as immutable from 'object-path-immutable';
import selectn from 'selectn';

import { FEED_FUTURE_SLICE_SET, FEED_PAST_SLICE_SET } from "state/feeds/actions";
import {
    POSTING_COMMENTS_SET,
    POSTING_DELETE,
    POSTING_DELETED,
    POSTING_REACT,
    POSTING_REACTION_DELETE,
    POSTING_REACTION_SET,
    POSTING_SET,
    POSTING_VERIFY,
    POSTING_VERIFY_FAILED
} from "state/postings/actions";
import {
    EVENT_HOME_REMOTE_POSTING_VERIFICATION_FAILED,
    EVENT_HOME_REMOTE_POSTING_VERIFIED,
    EVENT_HOME_REMOTE_REACTION_ADDED,
    EVENT_HOME_REMOTE_REACTION_DELETED
} from "api/events/actions";
import { STORY_ADDED, STORY_DELETED, STORY_UPDATED } from "state/stories/actions";
import { safeHtml, safePreviewHtml } from "util/html";
import { findPostingIdByRemote } from "state/postings/selectors";

const initialState = {
};

function safeguard(posting) {
    if (!posting.bodyPreview.text) {
        posting = immutable.set(posting, "body.previewText", safePreviewHtml(posting.body.text));
    }
    return immutable.wrap(posting)
        .update("bodyPreview.text", text => safePreviewHtml(text))
        .update("body.text", text => safeHtml(text))
        .value();
}

function toFeedReference(story) {
    const ref = {...story};
    ref.storyId = story.id;
    delete ref.id;
    delete ref.posting;
    return ref;
}

function outsideIn(story) {
    const posting = story.posting;
    if (posting == null || posting.body == null) {
        return null;
    }
    posting.feedReferences = [toFeedReference(story)];
    return posting;
}

export default (state = initialState, action) => {
    switch (action.type) {
        case FEED_PAST_SLICE_SET:
        case FEED_FUTURE_SLICE_SET: {
            const istate = immutable.wrap(state);
            action.payload.stories
                .map(s => outsideIn(s))
                .filter(p => p != null)
                .forEach(
                    p => istate
                        .set([p.id, "posting"], safeguard(p))
                        .set([p.id, "deleting"], false)
                        .set([p.id, "verificationStatus"], "none")
                );
            return istate.value();
        }

        case STORY_ADDED:
        case STORY_UPDATED: {
            const {id, posting} = action.payload.story;
            if (posting && state[posting.id]) {
                const refs = (state[posting.id].posting.feedReferences ?? []).filter(r => r.storyId !== id);
                refs.push(toFeedReference(action.payload.story));
                return immutable.set(state, [posting.id, "posting", "feedReferences"], refs);
            }
            return state;
        }

        case STORY_DELETED: {
            const {id, posting} = action.payload.story;
            if (state[posting.id]) {
                const refs = (state[posting.id].posting.feedReferences ?? []).filter(r => r.storyId !== id);
                return immutable.set(state, [posting.id, "posting", "feedReferences"], refs);
            }
            return state;
        }

        case POSTING_SET:
            const posting = action.payload.posting;
            return immutable.wrap(state)
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
            if (posting && (!action.payload.revisionId || posting.revisionId === action.payload.revisionId)) {
                const status = action.payload.correct ? "correct" : "incorrect";
                return immutable.set(state, [action.payload.postingId, "verificationStatus"], status);
            }
            return state;
        }

        case EVENT_HOME_REMOTE_POSTING_VERIFICATION_FAILED: {
            const posting = selectn([action.payload.postingId, "posting"], state);
            if (posting && (!action.payload.revisionId || posting.revisionId === action.payload.revisionId)) {
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
                let istate = immutable.wrap(state)
                                .set([id, "posting", "reactions"], totals);
                if (state[id].posting.receiverName == null) {
                    istate = istate.set([id, "posting", "clientReaction"], reaction)
                }
                return istate.value();
            }
            return state;
        }

        case POSTING_COMMENTS_SET: {
            const {id, total} = action.payload;
            if (state[id]) {
                return immutable.set(state, [id, "posting", "totalComments"], total);
            }
            return state;
        }

        case EVENT_HOME_REMOTE_REACTION_ADDED: {
            const {remoteNodeName, remotePostingId, negative, emoji} = action.payload;
            const id = findPostingIdByRemote(state, remoteNodeName, remotePostingId);
            if (id != null) {
                return immutable.set(state, [id, "posting", "clientReaction"], {negative, emoji});
            }
            return state;
        }

        case EVENT_HOME_REMOTE_REACTION_DELETED: {
            const {remoteNodeName, remotePostingId} = action.payload;
            const id = findPostingIdByRemote(state, remoteNodeName, remotePostingId);
            if (id != null) {
                return immutable.del(state, [id, "posting", "clientReaction"]);
            }
            return state;
        }

        default:
            return state;
    }
}
