import { call, select } from 'redux-saga/effects';

import { isAtHomeNode } from "state/node/selectors";
import { Node } from "api/node";

export function* fillActivityReactions(stories) {
    const postings = stories
        .map(t => t.posting)
        .filter(p => p != null)
        .filter(p => p.receiverName != null);
    if (postings.length === 0) {
        return;
    }
    const atHome = yield select(isAtHomeNode);
    if (atHome) {
        return;
    }
    const remotePostings = postings.map(p => ({nodeName: p.receiverName, postingId: p.receiverPostingId}));
    const reactions = yield call(Node.postActivityReactionsSearch, ":", remotePostings);
    const reactionMap = new Map(reactions.map(r => [`${r.remoteNodeName} ${r.remotePostingId}`, r]));
    postings.forEach(p => {
        const key = `${p.receiverName} ${p.receiverPostingId}`;
        const reaction = reactionMap.get(key);
        if (reaction != null) {
            p.clientReaction = {
                negative: reaction.negative,
                emoji: reaction.emoji,
                createdAt: reaction.createdAt
            }
        }
    })
}

export function* fillActivityReaction(posting) {
    if (posting.receiverName == null) {
        return;
    }
    const remotePostings = [{nodeName: posting.receiverName, postingId: posting.receiverPostingId}];
    const reactions = yield call(Node.postActivityReactionsSearch, ":", remotePostings);
    if (reactions.length > 0) {
        posting.clientReaction = {
            negative: reactions[0].negative,
            emoji: reactions[0].emoji,
            createdAt: reactions[0].createdAt
        }
    }
}
