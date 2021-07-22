import * as immutable from 'object-path-immutable';
import selectn from 'selectn';

import { FEED_FUTURE_SLICE_SET, FEED_PAST_SLICE_SET, FEED_SLICE_UPDATE } from "state/feeds/actions";
import {
    POSTING_COMMENTS_SET,
    POSTING_COMMENTS_SUBSCRIBED,
    POSTING_COMMENTS_UNSUBSCRIBED,
    POSTING_DELETE,
    POSTING_DELETED,
    POSTING_REACT,
    POSTING_REACTION_DELETE,
    POSTING_REACTION_SET,
    POSTING_SET,
    POSTING_SUBSCRIPTION_SET,
    POSTING_VERIFY,
    POSTING_VERIFY_FAILED,
    REMOTE_POSTING_SUBSCRIPTION_SET
} from "state/postings/actions";
import {
    EVENT_HOME_REMOTE_POSTING_VERIFICATION_FAILED,
    EVENT_HOME_REMOTE_POSTING_VERIFIED,
    EVENT_HOME_REMOTE_REACTION_ADDED,
    EVENT_HOME_REMOTE_REACTION_DELETED
} from "api/events/actions";
import { STORY_ADDED, STORY_DELETED, STORY_UPDATED } from "state/stories/actions";
import { findPostingIdByRemote } from "state/postings/selectors";
import { immutableSetSubscriptionId } from "state/subscriptions/util";
import { htmlEntities, replaceEmojis, safeHtml, safePreviewHtml } from "util/html";
import { INIT_FROM_LOCATION } from "state/navigation/actions";
import { COMMENTS_FUTURE_SLICE_SET, COMMENTS_PAST_SLICE_SET } from "state/detailedposting/actions";
import { ExtPostingInfo, PostingsState } from "state/postings/state";
import { ClientAction } from "state/action";
import { FeedReference, PostingInfo, StoryInfo } from "api/node/api-types";

const initialState = {
};

function safeguard(posting: PostingInfo): ExtPostingInfo {
    const iposting = immutable.wrap(posting);
    if (posting.bodyPreview == null || !posting.bodyPreview.text) {
        iposting.set("body.previewText", safePreviewHtml(posting.body.text));
    }
    if (posting.bodyPreview != null && posting.bodyPreview.subject) {
        iposting.set("bodyPreview.subjectHtml", replaceEmojis(htmlEntities(posting.bodyPreview.subject)));
    }
    if (posting.body.subject) {
        iposting.set("body.subjectHtml", replaceEmojis(htmlEntities(posting.body.subject)));
    }
    return iposting
        .update("bodyPreview.text", text => safePreviewHtml(text))
        .update("body.text", text => safeHtml(text))
        .value();
}

function toFeedReference(story: StoryInfo): FeedReference {
    const ref: FeedReference & {id?: any, posting?: any} = {
        ...story,
        storyId: story.id
    };
    delete ref.id;
    delete ref.posting;
    return ref;
}

function outsideIn(story: StoryInfo): PostingInfo | null {
    const posting = story.posting as PostingInfo; // Assertion
    if (posting == null || posting.body == null) {
        return null;
    }
    posting.feedReferences = [toFeedReference(story)];
    return posting;
}

export default (state: PostingsState = initialState, action: ClientAction): PostingsState => {
    switch (action.type) {
        case INIT_FROM_LOCATION:
            return {};

        case FEED_PAST_SLICE_SET:
        case FEED_FUTURE_SLICE_SET:
        case FEED_SLICE_UPDATE: {
            const istate = immutable.wrap(state);
            action.payload.stories
                .map(s => outsideIn(s))
                .filter(p => p != null)
                .forEach(
                    p => istate
                        .set([p!.id, "posting"], safeguard(p!))
                        .set([p!.id, "deleting"], false)
                        .set([p!.id, "verificationStatus"], "none")
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
            if (posting && state[posting.id]) {
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
                const istate = immutable.wrap(state).set([id, "posting", "reactions"], totals);
                if (state[id].posting.receiverName == null) {
                    istate.set([id, "posting", "clientReaction"], reaction);
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

        case POSTING_COMMENTS_SUBSCRIBED: {
            const {id, subscriberId} = action.payload;
            if (state[id]) {
                return immutable.set(state, [id, "posting", "subscriptions", "comments"], subscriberId);
            }
            return state;
        }

        case POSTING_COMMENTS_UNSUBSCRIBED: {
            const {id} = action.payload;
            if (state[id]) {
                return immutable.set(state, [id, "posting", "subscriptions", "comments"], null);
            }
            return state;
        }

        case POSTING_SUBSCRIPTION_SET: {
            const {id, type, subscriberId} = action.payload;
            if (state[id]) {
                return immutableSetSubscriptionId(state, id, type, subscriberId);
            }
            return state;
        }

        case REMOTE_POSTING_SUBSCRIPTION_SET: {
            const {remoteNodeName, remotePostingId, type, subscriberId} = action.payload;
            const id = findPostingIdByRemote(state, remoteNodeName, remotePostingId);
            if (id != null) {
                return immutableSetSubscriptionId(state, id, type, subscriberId);
            }
            return state;
        }

        case COMMENTS_PAST_SLICE_SET:
        case COMMENTS_FUTURE_SLICE_SET: {
            const {nodeName, postingId, total} = action.payload;
            if (total == null) {
                return state;
            }
            const id = state[postingId] && state[postingId].posting.ownerName === nodeName
                ? postingId
                : findPostingIdByRemote(state, nodeName, postingId);
            if (id != null) {
                return immutable.set(state, [id, "posting", "totalComments"], total);
            }
            return state;
        }

        default:
            return state;
    }
}
