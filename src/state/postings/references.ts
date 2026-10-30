import { PostingReference } from "state/postings/state";
import { ClientState } from "state/state";

export default function getReferencedPostings(state: ClientState): PostingReference[] {
    const references: PostingReference[] = [];
    for (const [nodeName, postings] of Object.entries(state.postings)) {
        for (const [postingId, entry] of Object.entries(postings ?? {})) {
            if (entry?.deleting || entry?.verificationStatus === "running") {
                references.push({nodeName, postingId});
            }
        }
    }
    return references;
}
