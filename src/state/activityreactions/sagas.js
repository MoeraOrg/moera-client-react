import { call, select } from 'redux-saga/effects';

import { isAtHomeNode } from "state/node/selectors";
import { Node } from "api/node";
import { isConnectedToHome } from "state/home/selectors";

export function* fillActivityReactions(stories) {
    const postings = stories
        .map(t => t.posting)
        .filter(p => p != null)
        .filter(p => p.receiverName != null);
    if (postings.length === 0) {
        return;
    }
    const toBeFilled = yield select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
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
    const toBeFilled = yield select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
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
