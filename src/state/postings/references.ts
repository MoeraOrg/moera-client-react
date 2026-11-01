import { PostingReference } from "state/postings/state";
import { ClientState } from "state/state";

export default function getReferencedPostings(state: ClientState, roots: PostingReference[] = []): PostingReference[] {
    const references: PostingReference[] = [];
    const seen = new Map<string, Set<string>>();

    const add = (reference: PostingReference): void => {
        const {nodeName, postingId} = reference;
        if (!seen.has(nodeName)) {
            seen.set(nodeName, new Set());
        }
        const ids = seen.get(nodeName)!;
        if (!ids.has(postingId)) {
            ids.add(postingId);
            references.push(reference);
        }
    };

    roots.forEach(add);

    for (const [nodeName, postings] of Object.entries(state.postings)) {
        for (const [postingId, entry] of Object.entries(postings ?? {})) {
            if (entry?.deleting || entry?.verificationStatus === "running") {
                add({nodeName, postingId});
            }
        }
    }

    // Traverse only from retained roots, deduplicating to terminate cycles.
    for (const {nodeName, postingId} of references) {
        const entry = state.postings[nodeName]?.[postingId];
        entry?.references?.forEach(add);
        for (const attachment of entry?.posting?.media ?? []) {
            if (attachment.postingId != null) {
                add({nodeName, postingId: attachment.postingId});
            }
        }
        entry?.picked?.forEach(add);
    }
    return references;
}
