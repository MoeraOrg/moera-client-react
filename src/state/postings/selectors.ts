import selectn from 'selectn';
import { ClientState } from "state/state";
import { FeedReference, PostingInfo, StoryInfo } from "api/node/api-types";
import { VerificationStatus } from "state/state-types";
import { now } from "util/misc";
import { PostingsState } from "state/postings/state";

export function getPosting(state: ClientState, id: string | null): PostingInfo | null {
    if (id == null) {
        return null;
    }
    return selectn(["postings", id, "posting"], state);
}

export function isPostingCached(state: ClientState, id: string | null): boolean {
    return id != null && !!getPosting(state, id);
}

export function isPostingBeingDeleted(state: ClientState, id: string | null): boolean {
    if (id == null) {
        return false;
    }
    return selectn(["postings", id, "deleting"], state) ?? false;
}

export function getPostingVerificationStatus(state: ClientState, id: string): VerificationStatus | null {
    return selectn(["postings", id, "verificationStatus"], state);
}

export function getPostingFeedReference(posting: PostingInfo, feedName: string): FeedReference | null {
    return posting.feedReferences ? (posting.feedReferences.find(r => r.feedName === feedName) ?? null) : null;
}

export function hasPostingFeedReference(posting: PostingInfo, feedName: string): boolean {
    return getPostingFeedReference(posting, feedName) != null;
}

export function getPostingMoment(posting: PostingInfo, feedName: string): number | null {
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

export function findPostingIdByRemote(postings: PostingsState, remoteNodeName: string | null,
                                      remotePostingId: string | null): string | null {
    for (let [id, {posting}] of Object.entries(postings)) {
        if (posting.receiverName === remoteNodeName && posting.receiverPostingId === remotePostingId) {
            return id;
        }
    }
    return null;
}
