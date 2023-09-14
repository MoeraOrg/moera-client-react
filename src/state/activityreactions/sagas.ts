import { call, select } from 'typed-redux-saga';

import { Node, PostingInfo, StoryInfo } from "api";
import { isAtHomeNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";

export function* fillActivityReactionsInStories(stories: StoryInfo[]) {
    const postings: PostingInfo[] = stories
        .map(t => t.posting)
        .filter((p): p is PostingInfo => p != null)
        .filter(p => p.receiverName != null && p.receiverPostingId != null);
    yield* call(fillActivityReactionsInPostings, postings);
}

export function* fillActivityReactionsInPostings(postings: PostingInfo[]) {
    if (postings.length === 0) {
        return;
    }
    const toBeFilled = yield* select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const remotePostings = postings.map(p => ({nodeName: p.receiverName!, postingId: p.receiverPostingId!}));
    const reactions = yield* call(Node.searchActivityReactions, ":", remotePostings);
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
    });
}

export function* fillActivityReaction(posting: PostingInfo) {
    if (posting.receiverName == null || posting.receiverPostingId == null) {
        return;
    }
    const toBeFilled = yield* select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const remotePostings = [{nodeName: posting.receiverName, postingId: posting.receiverPostingId}];
    const reactions = yield* call(Node.searchActivityReactions, ":", remotePostings);
    if (reactions.length > 0) {
        posting.clientReaction = {
            negative: reactions[0].negative,
            emoji: reactions[0].emoji,
            createdAt: reactions[0].createdAt
        }
    }
}
