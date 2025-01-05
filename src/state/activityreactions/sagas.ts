import { call, select } from 'typed-redux-saga';

import { Node, PostingInfo, StoryInfo } from "api";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { isAtHomeNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { REL_HOME } from "util/rel-node-name";
import { notNull } from "util/misc";

export function* fillActivityReactionsInStories(caller: WithContext<ClientAction> | null, stories: StoryInfo[]) {
    const postings: PostingInfo[] = stories
        .map(t => t.posting)
        .filter(notNull)
        .filter(p => p.receiverName != null && p.receiverPostingId != null);
    yield* call(fillActivityReactionsInPostings, caller, postings);
}

export function* fillActivityReactionsInPostings(caller: WithContext<ClientAction> | null, postings: PostingInfo[]) {
    if (postings.length === 0) {
        return;
    }
    const toBeFilled = yield* select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const remotePostings = postings.map(p => ({nodeName: p.receiverName!, postingId: p.receiverPostingId!}));
    const reactions = yield* call(Node.searchActivityReactions, caller, REL_HOME, {postings: remotePostings});
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

export function* fillActivityReaction(caller: WithContext<ClientAction> | null, posting: PostingInfo) {
    if (posting.receiverName == null || posting.receiverPostingId == null) {
        return;
    }
    const toBeFilled = yield* select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const remotePostings = [{nodeName: posting.receiverName, postingId: posting.receiverPostingId}];
    const reactions = yield* call(Node.searchActivityReactions, caller, REL_HOME, {postings: remotePostings});
    if (reactions.length > 0) {
        posting.clientReaction = {
            negative: reactions[0].negative,
            emoji: reactions[0].emoji,
            createdAt: reactions[0].createdAt
        }
    }
}
