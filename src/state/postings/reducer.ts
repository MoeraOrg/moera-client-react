import * as immutable from 'object-path-immutable';

import { FeedReference, PostingInfo, StoryInfo } from "api/node/api-types";
import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { FEED_FUTURE_SLICE_SET, FEED_PAST_SLICE_SET, FEED_SLICE_UPDATE } from "state/feeds/actions";
import {
    POSTING_COMMENTS_SET,
    POSTING_COMMENTS_SUBSCRIBED,
    POSTING_COMMENTS_UNSUBSCRIBED,
    POSTING_DELETE,
    POSTING_DELETED,
    POSTING_OPERATIONS_UPDATED,
    POSTING_REACT,
    POSTING_REACTION_DELETE,
    POSTING_REACTION_SET,
    POSTING_SET,
    POSTING_SUBSCRIPTION_SET,
    POSTING_VERIFY,
    POSTING_VERIFY_FAILED,
    POSTINGS_REACTION_SET,
    POSTINGS_SET,
    REMOTE_POSTING_SUBSCRIPTION_SET
} from "state/postings/actions";
import {
    EVENT_HOME_REMOTE_POSTING_VERIFICATION_FAILED,
    EVENT_HOME_REMOTE_POSTING_VERIFIED,
    EVENT_HOME_REMOTE_REACTION_ADDED,
    EVENT_HOME_REMOTE_REACTION_DELETED
} from "api/events/actions";
import { STORY_ADDED, STORY_DELETED, STORY_UPDATED } from "state/stories/actions";
import { findPostingIdsByRemote } from "state/postings/selectors";
import { immutableSetSubscriptionId } from "state/subscriptions/util";
import { INIT_FROM_LOCATION } from "state/navigation/actions";
import { COMMENTS_FUTURE_SLICE_SET, COMMENTS_PAST_SLICE_SET } from "state/detailedposting/actions";
import { ExtPostingInfo, PostingsState } from "state/postings/state";
import { htmlEntities, replaceEmojis, safeHtml, safePreviewHtml } from "util/html";
import { ellipsize } from "util/text";

const MAX_SHORT_TITLE = 120;

const initialState = {
};

function safeguard(posting: PostingInfo): ExtPostingInfo {
    const iposting = immutable.wrap(posting);
    if (posting.bodyPreview == null || !posting.bodyPreview.text) {
        iposting.set("body.previewText", safePreviewHtml(posting.body.text));
    }
    const subjectPreview = posting.bodyPreview?.subject || posting.body.subject;
    if (subjectPreview) {
        iposting.set("bodyPreview.subjectHtml", replaceEmojis(htmlEntities(ellipsize(subjectPreview, MAX_SHORT_TITLE))));
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

export default (state: PostingsState = initialState, action: WithContext<ClientAction>): PostingsState => {
    switch (action.type) {
        case INIT_FROM_LOCATION:
            return {};

        case FEED_PAST_SLICE_SET:
        case FEED_FUTURE_SLICE_SET:
        case FEED_SLICE_UPDATE: {
            const istate = immutable.wrap(state);
            action.payload.stories
                .map(s => outsideIn(s))
                .filter((p): p is PostingInfo => p != null)
                .forEach(p => istate.assign(["", p.id], {
                    posting: safeguard(p),
                    deleting: false,
                    verificationStatus: "none"
                }));
            return istate.value();
        }

        case POSTINGS_SET: {
            const istate = immutable.wrap(state);
            action.payload.postings
                .forEach(p => istate.assign(["", p.id], {
                    posting: safeguard(p),
                    deleting: false,
                    verificationStatus: "none"
                }));
            return istate.value();
        }

        case STORY_ADDED:
        case STORY_UPDATED: {
            const {id, posting} = action.payload.story;
            if (posting) {
                const postingState = state[""]?.[posting.id];
                if (postingState != null) {
                    const refs = (postingState.posting.feedReferences ?? []).filter(r => r.storyId !== id);
                    refs.push(toFeedReference(action.payload.story));
                    return immutable.set(state, ["", posting.id, "posting", "feedReferences"], refs);
                }
            }
            return state;
        }

        case STORY_DELETED: {
            const {id, posting} = action.payload.story;
            if (posting) {
                const postingState = state[""]?.[posting.id];
                if (postingState != null) {
                    const refs = (postingState.posting.feedReferences ?? []).filter(r => r.storyId !== id);
                    return immutable.set(state, ["", posting.id, "posting", "feedReferences"], refs);
                }
            }
            return state;
        }

        case POSTING_SET: {
            const {posting, nodeName} = action.payload;
            return immutable.wrap(state).assign([nodeName, posting.id], {
                posting: safeguard(posting),
                deleting: false,
                verificationStatus: "none"
            }).value();
        }

        case POSTING_DELETE:
            return immutable.set(state, [action.payload.nodeName, action.payload.id, "deleting"], true);

        case POSTING_DELETED:
            return immutable.del(state, [action.payload.nodeName, action.payload.id]);

        case POSTING_VERIFY:
            return immutable.set(state, [action.payload.nodeName, action.payload.id, "verificationStatus"], "running");

        case POSTING_VERIFY_FAILED:
            return immutable.set(state, [action.payload.nodeName, action.payload.id, "verificationStatus"], "none");

        case POSTING_OPERATIONS_UPDATED: {
            const {id, nodeName, operations} = action.payload;
            return immutable.set(state, [nodeName, id, "posting", "operations"], operations);
        }

        case EVENT_HOME_REMOTE_POSTING_VERIFIED: {
            const nodeName = action.payload.nodeName === action.context.ownerName ? "" : action.payload.nodeName;
            const posting = state[nodeName]?.[action.payload.postingId]?.posting;
            if (posting && (!action.payload.revisionId || posting.revisionId === action.payload.revisionId)) {
                const status = action.payload.correct ? "correct" : "incorrect";
                return immutable.set(state, [nodeName, action.payload.postingId, "verificationStatus"], status);
            }
            return state;
        }

        case EVENT_HOME_REMOTE_POSTING_VERIFICATION_FAILED: {
            const nodeName = action.payload.nodeName === action.context.ownerName ? "" : action.payload.nodeName;
            const posting = state[nodeName]?.[action.payload.postingId]?.posting;
            if (posting && (!action.payload.revisionId || posting.revisionId === action.payload.revisionId)) {
                return immutable.set(state, [nodeName, action.payload.postingId, "verificationStatus"], "none");
            }
            return state;
        }

        case POSTING_REACT: {
            const {id, negative, emoji, nodeName} = action.payload;
            if (state[nodeName]?.[id]) {
                return immutable.set(state, [nodeName, id, "posting", "clientReaction"], {negative, emoji});
            }
            return state;
        }

        case POSTING_REACTION_DELETE: {
            const {id, nodeName} = action.payload;
            if (state[nodeName]?.[id]) {
                return immutable.del(state, [nodeName, id, "posting", "clientReaction"]);
            }
            return state;
        }

        case POSTING_REACTION_SET: {
            const {id, reaction, totals, nodeName} = action.payload;
            const postingState = state[nodeName]?.[id];
            if (postingState) {
                const istate = immutable.wrap(state).set([nodeName, id, "posting", "reactions"], totals);
                if (postingState.posting.receiverName == null) {
                    istate.set([nodeName, id, "posting", "clientReaction"], reaction);
                }
                return istate.value();
            }
            return state;
        }

        case POSTINGS_REACTION_SET: {
            const {reactions, totals, nodeName} = action.payload;
            const nodeState = state[nodeName];
            if (nodeState) {
                const istate = immutable.wrap(state);
                totals
                    .filter(ts => nodeState[ts.entryId] != null)
                    .forEach(ts => istate.set([nodeName, ts.entryId, "posting", "reactions"], ts));
                reactions
                    .filter(r => nodeState[r.entryId] != null)
                    .filter(r => nodeState[r.entryId]?.posting.receiverName == null)
                    .forEach(r => istate.set([nodeName, r.entryId, "posting", "clientReaction"], r));
                return istate.value();
            }
            return state;
        }

        case POSTING_COMMENTS_SET: {
            const {id, total, nodeName} = action.payload;
            if (state[nodeName]?.[id]) {
                return immutable.set(state, [nodeName, id, "posting", "totalComments"], total);
            }
            return state;
        }

        case EVENT_HOME_REMOTE_REACTION_ADDED: {
            const {remoteNodeName, remotePostingId, negative, emoji} = action.payload;
            const ids = findPostingIdsByRemote(state, remoteNodeName, remotePostingId);
            if (ids.length > 0) {
                const istate = immutable.wrap(state);
                for (const {nodeName, postingId} of ids) {
                    istate.set([nodeName, postingId, "posting", "clientReaction"], {negative, emoji});
                }
                return istate.value();
            }
            return state;
        }

        case EVENT_HOME_REMOTE_REACTION_DELETED: {
            const {remoteNodeName, remotePostingId} = action.payload;
            const ids = findPostingIdsByRemote(state, remoteNodeName, remotePostingId);
            if (ids.length > 0) {
                const istate = immutable.wrap(state);
                for (const {nodeName, postingId} of ids) {
                    istate.del([nodeName, postingId, "posting", "clientReaction"]);
                }
                return istate.value();
            }
            return state;
        }

        case POSTING_COMMENTS_SUBSCRIBED: {
            const {id, subscriberId, nodeName} = action.payload;
            if (state[nodeName]?.[id]) {
                return immutable.set(state, [nodeName, id, "posting", "subscriptions", "comments"], subscriberId);
            }
            return state;
        }

        case POSTING_COMMENTS_UNSUBSCRIBED: {
            const {id, nodeName} = action.payload;
            if (state[nodeName]?.[id]) {
                return immutable.set(state, [nodeName, id, "posting", "subscriptions", "comments"], null);
            }
            return state;
        }

        case POSTING_SUBSCRIPTION_SET: {
            const {id, type, subscriberId, nodeName} = action.payload;
            if (state[nodeName]?.[id]) {
                return immutableSetSubscriptionId(state, nodeName, id, type, subscriberId);
            }
            return state;
        }

        case REMOTE_POSTING_SUBSCRIPTION_SET: {
            const {remoteNodeName, remotePostingId, type, subscriberId} = action.payload;
            const ids = findPostingIdsByRemote(state, remoteNodeName, remotePostingId);
            let nstate = state;
            for (const {nodeName, postingId} of ids) {
                nstate = immutableSetSubscriptionId(nstate, nodeName, postingId, type, subscriberId);
            }
            return nstate;
        }

        case COMMENTS_PAST_SLICE_SET:
        case COMMENTS_FUTURE_SLICE_SET: {
            const {nodeName, postingId, total} = action.payload;
            if (total == null) {
                return state;
            }
            const postingState = state[""]?.[postingId];
            const ids = postingState && postingState.posting.ownerName === nodeName
                ? [{nodeName: "", postingId}]
                : findPostingIdsByRemote(state, nodeName, postingId);
            if (ids.length > 0) {
                const istate = immutable.wrap(state);
                for (const {nodeName, postingId} of ids) {
                    istate.set([nodeName, postingId, "posting", "totalComments"], total);
                }
                return istate.value();
            }
            return state;
        }

        default:
            return state;
    }
}
