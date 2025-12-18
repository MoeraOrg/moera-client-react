import * as immutable from 'object-path-immutable';

import { BlockedEntryOperation, FeedReference, PostingInfo, StoryInfo, SubscriptionType } from "api";
import { WithContext } from "state/action-types";
import { ClientAction } from "state/action";
import { findPostingIdsByRemote } from "state/postings/selectors";
import { ExtPostingInfo, NodePostingsState, PostingsState } from "state/postings/state";
import { htmlEntities, replaceEmojis, safeHtml, safePreviewHtml } from "util/html";
import { ellipsize } from "util/text";
import { absoluteNodeName } from "util/rel-node-name";
import { notNull } from "util/misc";

const MAX_SHORT_TITLE = 120;

const initialState: PostingsState = {
};

function safeguard(posting: PostingInfo): ExtPostingInfo {
    const iposting = immutable.wrap(posting);
    if (posting.bodyPreview == null || !posting.bodyPreview.text) {
        iposting.set("body.previewText", safePreviewHtml(posting.body.text, posting.media));
    }
    const subjectPreview = posting.bodyPreview?.subject || posting.body.subject;
    if (subjectPreview) {
        iposting.set("bodyPreview.subjectHtml", replaceEmojis(htmlEntities(ellipsize(subjectPreview, MAX_SHORT_TITLE))));
    }
    if (posting.body.subject) {
        iposting.set("body.subjectHtml", replaceEmojis(htmlEntities(posting.body.subject)));
    }
    return iposting
        .update("bodyPreview.text", text => safePreviewHtml(text, posting.media))
        .update("body.text", text => safeHtml(text, posting.media))
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

    if (posting.feedReferences == null || posting.feedReferences.length === 0) {
        posting.feedReferences = [toFeedReference(story)];
    }

    return posting;
}

function mergeFeedReferences(
    fr1: FeedReference[] | null | undefined, fr2: FeedReference[] | null | undefined
): FeedReference[] {
    const merged = [...(fr1 ?? []), ...(fr2 ?? [])];
    return merged.filter((ref, index) => merged.findIndex(r => r.storyId === ref.storyId) === index);
}

function mergePreviousFeedReferences(posting: PostingInfo, state: NodePostingsState | undefined): PostingInfo {
    posting.feedReferences = mergeFeedReferences(posting.feedReferences, state?.[posting.id]?.posting.feedReferences);
    return posting;
}

function immutableSetSubscriptionId(
    state: PostingsState, nodeName: string, id: string, type: SubscriptionType, subscriptionId: string | null
) {
    switch (type) {
        case "posting-comments":
            return immutable.set(state, [nodeName, id, "subscriptions", "comments"], subscriptionId);
        default:
            return state;
    }
}

export default (state: PostingsState = initialState, action: WithContext<ClientAction>): PostingsState => {
    switch (action.type) {
        case "INIT_FROM_LOCATION": {
            const istate = immutable.wrap(state);
            Object.keys(state)
                .filter(name => name !== action.payload.nodeName && name !== action.context.homeOwnerNameOrUrl)
                .forEach(name => istate.del([name]));
            return istate.value();
        }

        case "FEED_PAST_SLICE_SET":
        case "FEED_FUTURE_SLICE_SET":
        case "FEED_SLICE_UPDATE": {
            const istate = immutable.wrap(state);
            const nodeName = action.context.ownerNameOrUrl;
            action.payload.stories
                .map(s => outsideIn(s))
                .filter(notNull)
                .map(p => mergePreviousFeedReferences(p, state[nodeName]))
                .forEach(p => istate.assign([nodeName, p.id], {
                    posting: safeguard(p),
                    deleting: false,
                    verificationStatus: "none",
                    subscriptions: {
                        comments: null
                    }
                }));
            return istate.value();
        }

        case "POSTINGS_SET": {
            const istate = immutable.wrap(state);
            const nodeName = action.context.ownerNameOrUrl;
            action.payload.postings
                .forEach(p => istate.assign([nodeName, p.id], {
                    posting: safeguard(p),
                    deleting: false,
                    verificationStatus: "none",
                    subscriptions: {
                        comments: null
                    }
                }));
            return istate.value();
        }

        case "STORY_ADDED":
        case "STORY_UPDATED": {
            const {id, posting} = action.payload.story;
            const nodeName = action.context.ownerNameOrUrl;
            if (posting) {
                const postingState = state[nodeName]?.[posting.id];
                if (postingState != null) {
                    const refs = (postingState.posting.feedReferences ?? []).filter(r => r.storyId !== id);
                    refs.push(toFeedReference(action.payload.story));
                    return immutable.set(state, [nodeName, posting.id, "posting", "feedReferences"], refs);
                }
            }
            return state;
        }

        case "STORY_DELETED": {
            const {id, posting} = action.payload.story;
            const nodeName = action.context.ownerNameOrUrl;
            if (posting) {
                const postingState = state[nodeName]?.[posting.id];
                if (postingState != null) {
                    const refs = (postingState.posting.feedReferences ?? []).filter(r => r.storyId !== id);
                    return immutable.set(state, [nodeName, posting.id, "posting", "feedReferences"], refs);
                }
            }
            return state;
        }

        case "POSTING_SET": {
            let {posting, nodeName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            return immutable.wrap(state).assign([nodeName, posting.id], {
                posting: safeguard(posting),
                deleting: false,
                verificationStatus: "none",
                subscriptions: {
                    comments: null
                }
            }).value();
        }

        case "POSTING_DELETE":
            return immutable.set(
                state,
                [absoluteNodeName(action.payload.nodeName, action.context), action.payload.id, "deleting"],
                true
            );

        case "POSTING_DELETED":
            return immutable.del(
                state,
                [absoluteNodeName(action.payload.nodeName, action.context), action.payload.id]
            );

        case "POSTING_VERIFY":
            return immutable.set(
                state,
                [absoluteNodeName(action.payload.nodeName, action.context), action.payload.id, "verificationStatus"],
                "running"
            );

        case "POSTING_VERIFY_FAILED":
            return immutable.set(
                state,
                [absoluteNodeName(action.payload.nodeName, action.context), action.payload.id, "verificationStatus"],
                "none"
            );

        case "POSTING_OPERATIONS_UPDATED": {
            let {id, nodeName, operations} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            return immutable.set(state, [nodeName, id, "posting", "operations"], operations);
        }

        case "EVENT_HOME_REMOTE_POSTING_VERIFIED": {
            const {nodeName, postingId, revisionId, correct} = action.payload;
            const posting = state[nodeName]?.[postingId]?.posting;
            if (posting && (!revisionId || posting.revisionId === revisionId)) {
                const status = correct ? "correct" : "incorrect";
                return immutable.set(state, [nodeName, postingId, "verificationStatus"], status);
            }
            return state;
        }

        case "EVENT_HOME_REMOTE_POSTING_VERIFICATION_FAILED": {
            const {nodeName, postingId, revisionId} = action.payload;
            const posting = state[nodeName]?.[postingId]?.posting;
            if (posting && (!revisionId || posting.revisionId === revisionId)) {
                return immutable.set(state, [nodeName, postingId, "verificationStatus"], "none");
            }
            return state;
        }

        case "POSTING_REACT": {
            let {id, negative, emoji, nodeName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            if (state[nodeName]?.[id]) {
                return immutable.set(state, [nodeName, id, "posting", "clientReaction"], {negative, emoji});
            }
            return state;
        }

        case "POSTING_REACTION_DELETE": {
            let {id, nodeName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            if (state[nodeName]?.[id]) {
                return immutable.del(state, [nodeName, id, "posting", "clientReaction"]);
            }
            return state;
        }

        case "POSTING_REACTION_SET": {
            let {id, reaction, totals, nodeName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
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

        case "POSTINGS_REACTION_SET": {
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

        case "POSTING_COMMENTS_SET": {
            let {id, total, nodeName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            if (state[nodeName]?.[id]) {
                return immutable.set(state, [nodeName, id, "posting", "totalComments"], total);
            }
            return state;
        }

        case "POSTING_COMMENT_COUNT_UPDATE": {
            const {id, nodeName, delta} = action.payload;
            const istate = immutable.wrap(state);
            for (const postingNode of Object.keys(state)) {
                for (const postingId of Object.keys(state[postingNode] ?? {})) {
                    const posting = state[postingNode]![postingId]!.posting;
                    if ((postingNode === nodeName && postingId === id)
                        || (posting.receiverName === nodeName && posting.receiverPostingId === id)
                    ) {
                        istate.update([postingNode, postingId, "posting", "totalComments"], total => total + delta);
                    }
                }
            }
            return istate.value();
        }

        case "EVENT_HOME_REMOTE_REACTION_ADDED": {
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

        case "EVENT_HOME_REMOTE_REACTION_DELETED": {
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

        case "POSTING_COMMENTS_SUBSCRIBED": {
            let {id, subscriptionId, nodeName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            if (state[nodeName]?.[id]) {
                return immutable.set(state, [nodeName, id, "subscriptions", "comments"], subscriptionId);
            }
            return state;
        }

        case "POSTING_COMMENTS_UNSUBSCRIBED": {
            let {id, nodeName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            if (state[nodeName]?.[id]) {
                return immutable.set(state, [nodeName, id, "subscriptions", "comments"], null);
            }
            return state;
        }

        case "POSTING_COMMENT_ADDED_BLOCKED": {
            let {id, blockedInstantId, nodeName} = action.payload;

            nodeName = absoluteNodeName(nodeName, action.context);
            const postingState = state[nodeName]?.[id];
            if (postingState != null) {
                const blockedInstants = [
                    ...(postingState.posting.blockedInstants ?? []),
                    {id: blockedInstantId, storyType: "comment-added" as const}
                ];
                return immutable.set(state, [nodeName, id, "posting", "blockedInstants"], blockedInstants);
            }
            return state;
        }

        case "POSTING_COMMENT_ADDED_UNBLOCKED": {
            let {id, nodeName} = action.payload;

            nodeName = absoluteNodeName(nodeName, action.context);
            const postingState = state[nodeName]?.[id];
            if (postingState?.posting.blockedInstants != null) {
                const blockedInstants = postingState.posting.blockedInstants
                    .filter(bi => bi.storyType !== "comment-added");
                return immutable.set(state, [nodeName, id, "posting", "blockedInstants"], blockedInstants);
            }
            return state;
        }

        case "EVENT_HOME_BLOCKED_INSTANT_ADDED": {
            const {blockedInstant: {id, storyType, entryId}} = action.payload;
            const {homeOwnerName: nodeName} = action.context;

            if (nodeName == null || entryId == null) {
                return state;
            }

            const postingState = state[nodeName]?.[entryId];
            if (postingState != null) {
                const blockedInstants = [...(postingState.posting.blockedInstants ?? []), {id, storyType}];
                return immutable.set(state, [nodeName, entryId, "posting", "blockedInstants"], blockedInstants);
            }
            return state;
        }

        case "EVENT_HOME_BLOCKED_INSTANT_DELETED": {
            const {blockedInstant: {id, entryId}} = action.payload;
            const {homeOwnerName: nodeName} = action.context;

            if (nodeName == null || entryId == null) {
                return state;
            }

            const postingState = state[nodeName]?.[entryId];
            if (postingState?.posting.blockedInstants != null) {
                const blockedInstants = postingState.posting.blockedInstants.filter(bi => bi.id !== id);
                return immutable.set(state, [nodeName, entryId, "posting", "blockedInstants"], blockedInstants);
            }
            return state;
        }

        case "EVENT_HOME_BLOCKED_BY_USER_ADDED": {
            const {blockedByUser} = action.payload;

            const nodeName = blockedByUser.nodeName;
            if (nodeName == null) {
                return state;
            }

            const istate = immutable.wrap(state);
            const nodeState = state[nodeName] ?? {};
            const postingIds = blockedByUser.postingId != null ? [blockedByUser.postingId] : Object.keys(nodeState);
            for (const postingId of postingIds) {
                switch (blockedByUser.blockedOperation) {
                    case "comment":
                        istate.push([nodeName, postingId, "posting", "blockedOperations"], "addComment");
                        break;
                    case "reaction":
                        istate.push([nodeName, postingId, "posting", "blockedOperations"], "addReaction");
                        istate.push([nodeName, postingId, "posting", "blockedCommentOperations"], "addReaction");
                        break;
                }
            }
            return istate.value();
        }

        case "EVENT_HOME_BLOCKED_BY_USER_DELETED": {
            const {blockedByUser} = action.payload;

            const nodeName = blockedByUser.nodeName;
            if (nodeName == null) {
                return state;
            }

            const istate = immutable.wrap(state);
            const nodeState = state[nodeName] ?? {};
            const postingIds = blockedByUser.postingId != null ? [blockedByUser.postingId] : Object.keys(nodeState);
            for (const postingId of postingIds) {
                switch (blockedByUser.blockedOperation) {
                    case "comment":
                        istate.update([nodeName, postingId, "posting", "blockedOperations"],
                            (ops: BlockedEntryOperation[]) => ops.filter(op => op !== "addComment"));
                        break;
                    case "reaction":
                        istate.update([nodeName, postingId, "posting", "blockedOperations"],
                            (ops: BlockedEntryOperation[]) => ops.filter(op => op !== "addReaction"));
                        istate.update([nodeName, postingId, "posting", "blockedCommentOperations"],
                            (ops: BlockedEntryOperation[]) => ops.filter(op => op !== "addReaction"));
                        break;
                }
            }
            return istate.value();
        }

        case "POSTING_SUBSCRIPTION_SET": {
            let {id, type, subscriptionId, nodeName} = action.payload;
            nodeName = absoluteNodeName(nodeName, action.context);
            if (state[nodeName]?.[id]) {
                return immutableSetSubscriptionId(state, nodeName, id, type, subscriptionId);
            }
            return state;
        }

        case "REMOTE_POSTING_SUBSCRIPTION_SET": {
            const {remoteNodeName, remotePostingId, type, subscriptionId} = action.payload;
            const ids = findPostingIdsByRemote(state, remoteNodeName, remotePostingId);
            let nstate = state;
            for (const {nodeName, postingId} of ids) {
                nstate = immutableSetSubscriptionId(nstate, nodeName, postingId, type, subscriptionId);
            }
            return nstate;
        }

        case "COMMENTS_PAST_SLICE_SET":
        case "COMMENTS_FUTURE_SLICE_SET": {
            const {nodeName, postingId, total} = action.payload;
            if (total == null) {
                return state;
            }
            const postingState = state[nodeName]?.[postingId];
            const ids = postingState && postingState.posting.ownerName === nodeName
                ? [{nodeName, postingId}]
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
