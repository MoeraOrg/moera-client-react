import { BlockedByUserFilter, BlockedOperation, Node, PostingInfo, StoryInfo } from "api";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { select } from "state/store-sagas";
import { isConnectedToHome } from "state/home/selectors";
import { isAtHomeNode } from "state/node/selectors";
import { REL_HOME } from "util/rel-node-name";
import { notNull } from "util/misc";

export async function fillBlockedOperationsInStories(
    caller: WithContext<ClientAction> | null, stories: StoryInfo[]
): Promise<void> {
    const postings: PostingInfo[] = stories
        .map(t => t.posting)
        .filter(notNull)
        .filter(p => p.receiverName != null && p.receiverPostingId != null);
    await fillBlockedOperationsInPostings(caller, postings);
}

export async function fillBlockedOperationsInPostings(
    caller: WithContext<ClientAction> | null, postings: PostingInfo[]
): Promise<void> {
    if (postings.length === 0) {
        return;
    }
    const toBeFilled = select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const filter: BlockedByUserFilter = {
        blockedOperations: ["comment", "reaction"],
        postings: postings.map(p => ({nodeName: p.receiverName!, postingId: p.receiverPostingId!}))
    };
    const blockedByUsers = await Node.searchBlockedByUsers(caller, REL_HOME, filter);
    if (blockedByUsers.length === 0) {
        return;
    }
    const postingMap = new Map(postings.map(p => [`${p.receiverName} ${p.receiverPostingId}`, p]));
    blockedByUsers.forEach(bbu => {
        if (bbu.postingId == null) {
            postings
                .filter(p => p.receiverName === bbu.nodeName)
                .forEach(p => addBlockedOperation(p, bbu.blockedOperation));
        } else {
            const key = `${bbu.nodeName} ${bbu.postingId}`;
            const posting = postingMap.get(key);
            if (posting != null) {
                addBlockedOperation(posting, bbu.blockedOperation);
            }
        }
    });
}

export async function fillBlockedOperations(
    caller: WithContext<ClientAction> | null, posting: PostingInfo
): Promise<void> {
    if (posting.receiverName == null || posting.receiverPostingId == null) {
        return;
    }
    const toBeFilled = select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const filter: BlockedByUserFilter = {
        blockedOperations: ["comment", "reaction"],
        postings: [{nodeName: posting.receiverName, postingId: posting.receiverPostingId}]
    };
    const blockedByUsers = await Node.searchBlockedByUsers(caller, REL_HOME, filter);
    blockedByUsers.forEach(bbu => addBlockedOperation(posting, bbu.blockedOperation));
}

function addBlockedOperation(posting: PostingInfo, operation: BlockedOperation) {
    if (posting.blockedOperations == null) {
        posting.blockedOperations = [];
    }
    switch (operation) {
        case "comment":
            posting.blockedOperations.push("addComment");
            break;
        case "reaction":
            posting.blockedOperations.push("addReaction");
            if (posting.blockedCommentOperations == null) {
                posting.blockedCommentOperations = [];
            }
            posting.blockedCommentOperations.push("addReaction");
            break;
    }
}
