import { Node, PostingInfo, StoryInfo } from "api";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { select } from "state/store-sagas";
import { isAtHomeNode } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { REL_HOME } from "util/rel-node-name";
import { notNull } from "util/misc";

export async function fillActivityReactionsInStories(
    caller: WithContext<ClientAction> | null, stories: StoryInfo[]
): Promise<void> {
    const postings: PostingInfo[] = stories
        .map(t => t.posting)
        .filter(notNull)
        .filter(p => p.receiverName != null && p.receiverPostingId != null);
    await fillActivityReactionsInPostings(caller, postings);
}

export async function fillActivityReactionsInPostings(
    caller: WithContext<ClientAction> | null, postings: PostingInfo[]
): Promise<void> {
    if (postings.length === 0) {
        return;
    }
    const toBeFilled = select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const remotePostings = postings.map(p => ({nodeName: p.receiverName!, postingId: p.receiverPostingId!}));
    const reactions = await Node.searchActivityReactions(caller, REL_HOME, {postings: remotePostings});
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

export async function fillActivityReaction(
    caller: WithContext<ClientAction> | null, posting: PostingInfo
): Promise<void> {
    if (posting.receiverName == null || posting.receiverPostingId == null) {
        return;
    }
    const toBeFilled = select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const remotePostings = [{nodeName: posting.receiverName, postingId: posting.receiverPostingId}];
    const reactions = await Node.searchActivityReactions(caller, REL_HOME, {postings: remotePostings});
    if (reactions.length > 0) {
        posting.clientReaction = {
            negative: reactions[0].negative,
            emoji: reactions[0].emoji,
            createdAt: reactions[0].createdAt
        }
    }
}
