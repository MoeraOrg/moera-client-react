import { FeedReference, PostingInfo, StoryInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { VerificationStatus } from "state/state-types";
import { ExtPostingInfo, PostingsState } from "state/postings/state";
import { isSheriffGoverned, isSheriffMarked } from "util/sheriff";
import { now } from "util/misc";

export function getPosting(state: ClientState, id: string | null, nodeName: string = ""): ExtPostingInfo | null {
    if (id == null) {
        return null;
    }
    return state.postings[nodeName]?.[id]?.posting ?? null;
}

export function isPostingCached(state: ClientState, id: string | null, nodeName: string = ""): boolean {
    return id != null && !!getPosting(state, id, nodeName);
}

export function isPostingBeingDeleted(state: ClientState, id: string | null, nodeName: string = ""): boolean {
    if (id == null) {
        return false;
    }
    return state.postings[nodeName]?.[id]?.deleting ?? false;
}

export function getPostingVerificationStatus(state: ClientState, id: string,
                                             nodeName: string = ""): VerificationStatus | null {
    return state.postings[nodeName]?.[id]?.verificationStatus ?? null;
}

export function getPostingCommentsSubscriptionId(state: ClientState, id: string,
                                                 nodeName: string = ""): string | null {
    return state.postings[nodeName]?.[id]?.subscriptions.comments ?? null;
}

export function getPostingFeedReference(posting: Pick<PostingInfo, "feedReferences"> | null,
                                        feedName: string): FeedReference | null {
    return posting?.feedReferences?.find(r => r.feedName === feedName) ?? null;
}

export function hasPostingFeedReference(posting: Pick<PostingInfo, "feedReferences"> | null,
                                        feedName: string): boolean {
    return getPostingFeedReference(posting, feedName) != null;
}

export function getPostingCommentAddedInstantBlockId(state: ClientState, id: string,
                                                     nodeName: string = ""): string | null {
    return state.postings[nodeName]?.[id]?.posting.blockedInstants
        ?.find(bi => bi.storyType === "comment-added")?.id ?? null;
}

export function getPostingMoment(posting: Pick<PostingInfo, "feedReferences">, feedName: string): number | null {
    const ref = getPostingFeedReference(posting, feedName);
    return ref ? ref.moment : null;
}

export function getPostingStory(posting: PostingInfo, feedName: string): StoryInfo | null {
    const ref = getPostingFeedReference(posting, feedName);
    if (ref == null) {
        return null;
    }
    const story: StoryInfo & {storyId?: any} = {
        ...ref,
        id: ref.storyId,
        posting,
        storyType: "posting-added" as const,
        createdAt: now()
    };
    delete story.storyId;
    return story;
}

interface FullPostingId {
    nodeName: string;
    postingId: string;
}

export function findPostingIdsByRemote(postings: PostingsState, remoteNodeName: string | null,
                                       remotePostingId: string | null): FullPostingId[] {
    const ids: FullPostingId[] = [];
    for (let nodeName of Object.keys(postings)) {
        const nodePostings = postings[nodeName];
        if (nodePostings == null) {
            continue;
        }
        for (let [id, entry] of Object.entries(nodePostings)) {
            if (entry?.posting.receiverName === remoteNodeName && entry.posting.receiverPostingId === remotePostingId) {
                ids.push({nodeName, postingId: id});
            }
        }
    }
    if (remoteNodeName != null && remotePostingId != null && postings[remoteNodeName]?.[remotePostingId] != null) {
        ids.push({nodeName: remoteNodeName, postingId: remotePostingId});
    }
    return ids;
}

export function isPostingSheriff(posting: PostingInfo | null | undefined, sheriffName: string | null): boolean {
    return isSheriffGoverned(posting, sheriffName);
}

export function isPostingSheriffMarked(posting: PostingInfo | null | undefined, sheriffName: string | null): boolean {
    return isSheriffMarked(posting, sheriffName);
}

export function isPostingSheriffProhibited(posting: PostingInfo | null | undefined,
                                           sheriffName: string | null): boolean {
    return !isPostingSheriff(posting, sheriffName) || isPostingSheriffMarked(posting, sheriffName);
}
