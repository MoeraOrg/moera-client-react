import { FeedReference, PostingInfo, StoryInfo } from "api";
import { ClientState } from "state/state";
import { VerificationStatus } from "state/state-types";
import { getRelNodeNameContext } from "state/home/selectors";
import { ExtPostingInfo, PostingsState, PostingState } from "state/postings/state";
import { isSheriffGoverned, isSheriffMarked } from "util/sheriff";
import { now } from "util/misc";
import { absoluteNodeName, RelNodeName } from "util/rel-node-name";

function getPostingState(
    state: ClientState, id: string | null, nodeName: RelNodeName | string
): PostingState | undefined {
    if (id == null) {
        return undefined;
    }
    nodeName = absoluteNodeName(nodeName, getRelNodeNameContext(state));
    return state.postings[nodeName]?.[id];
}

export function getPosting(
    state: ClientState, id: string | null, nodeName: RelNodeName | string
): ExtPostingInfo | null {
    return getPostingState(state, id, nodeName)?.posting ?? null;
}

export function isPostingCached(state: ClientState, id: string | null, nodeName: RelNodeName | string): boolean {
    return id != null && !!getPosting(state, id, nodeName);
}

export function isPostingBeingDeleted(state: ClientState, id: string | null, nodeName: RelNodeName | string): boolean {
    return getPostingState(state, id, nodeName)?.deleting ?? false;
}

export function getPostingVerificationStatus(
    state: ClientState, id: string, nodeName: RelNodeName | string
): VerificationStatus | null {
    return getPostingState(state, id, nodeName)?.verificationStatus ?? null;
}

export function getPostingCommentsSubscriptionId(
    state: ClientState, id: string, nodeName: RelNodeName | string
): string | null {
    return getPostingState(state, id, nodeName)?.subscriptions.comments ?? null;
}

export function getPostingFeedReference(
    posting: Pick<PostingInfo, "feedReferences"> | null, feedName: string
): FeedReference | null {
    return posting?.feedReferences?.find(r => r.feedName === feedName) ?? null;
}

export function hasPostingFeedReference(
    posting: Pick<PostingInfo, "feedReferences"> | null, feedName: string
): boolean {
    return getPostingFeedReference(posting, feedName) != null;
}

export function getPostingCommentAddedInstantBlockId(
    state: ClientState, id: string, nodeName: RelNodeName | string
): string | null {
    return getPostingState(state, id, nodeName)?.posting.blockedInstants
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
