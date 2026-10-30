import { PostingReference } from "state/postings/state";
import { ClientState } from "state/state";

export default function getReferencedPostings(state: ClientState): PostingReference[] {
    const references: PostingReference[] = [];
    for (const [nodeName, feeds] of Object.entries(state.feeds)) {
        for (const feed of Object.values(feeds ?? {})) {
            for (const story of feed?.stories ?? []) {
                if (story.postingId != null) {
                    references.push({nodeName, postingId: story.postingId});
                }
            }
            for (const slice of feed?.pending ?? []) {
                for (const story of slice.stories) {
                    const postingId = story.posting?.id ?? story.postingId;
                    if (postingId != null) {
                        references.push({nodeName, postingId});
                    }
                }
            }
        }
    }
    return references;
}
