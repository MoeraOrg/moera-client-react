import { call, select } from 'typed-redux-saga';

import { BlockedByUserFilter, BlockedOperation, Node, PostingInfo, StoryInfo } from "api";
import { isConnectedToHome } from "state/home/selectors";
import { isAtHomeNode } from "state/node/selectors";
import { ClientAction } from "state/action";

export function* fillBlockedOperationsInStories(caller: ClientAction | null, stories: StoryInfo[]) {
    const postings: PostingInfo[] = stories
        .map(t => t.posting)
        .filter((p): p is PostingInfo => p != null)
        .filter(p => p.receiverName != null && p.receiverPostingId != null);
    yield* call(fillBlockedOperationsInPostings, caller, postings);
}

export function* fillBlockedOperationsInPostings(caller: ClientAction | null, postings: PostingInfo[]) {
    if (postings.length === 0) {
        return;
    }
    const toBeFilled = yield* select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const filter: BlockedByUserFilter = {
        blockedOperations: ["comment", "reaction"],
        postings: postings.map(p => ({nodeName: p.receiverName!, postingId: p.receiverPostingId!}))
    };
    const blockedByUsers = yield* call(Node.searchBlockedByUsers, caller, ":", filter);
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

export function* fillBlockedOperations(caller: ClientAction | null, posting: PostingInfo) {
    if (posting.receiverName == null || posting.receiverPostingId == null) {
        return;
    }
    const toBeFilled = yield* select(state => isConnectedToHome(state) && !isAtHomeNode(state));
    if (!toBeFilled) {
        return;
    }
    const filter: BlockedByUserFilter = {
        blockedOperations: ["comment", "reaction"],
        postings: [{nodeName: posting.receiverName, postingId: posting.receiverPostingId}]
    };
    const blockedByUsers = yield* call(Node.searchBlockedByUsers, caller, ":", filter);
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
