import { ExtStoryInfo } from "state/feeds/state";
import { PostingReference } from "state/postings/state";
import { ClientState } from "state/state";

function addRemotePostingReference(references: PostingReference[], story: ExtStoryInfo): void {
    if (story.storyType === "posting-added" && story.remotePostingId != null && story.remoteNodeName != null) {
        references.push({nodeName: story.remoteNodeName, postingId: story.remotePostingId});
    }
}

export default function getReferencedPostings(state: ClientState): PostingReference[] {
    const references: PostingReference[] = [];
    for (const [nodeName, feeds] of Object.entries(state.feeds)) {
        for (const feed of Object.values(feeds ?? {})) {
            for (const story of feed?.stories ?? []) {
                if (story.postingId != null) {
                    references.push({nodeName, postingId: story.postingId});
                }
                addRemotePostingReference(references, story);
            }
            for (const slice of feed?.pending ?? []) {
                for (const story of slice.stories) {
                    const postingId = story.posting?.id ?? story.postingId;
                    if (postingId != null) {
                        references.push({nodeName, postingId});
                    }
                    addRemotePostingReference(references, story);
                }
            }
        }
    }
    return references;
}
