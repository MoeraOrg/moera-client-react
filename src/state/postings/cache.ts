import * as immutable from 'object-path-immutable';

import feedsReferences from "state/feeds/references";
import detailedPostingReferences from "state/detailedposting/references";
import composeReferences from "state/compose/references";
import reactionsDialogReferences from "state/reactionsdialog/references";
import sharingsDialogReferences from "state/sharingsdialog/references";
import repostDialogReferences from "state/repostdialog/references";
import imageEditDialogReferences from "state/imageeditdialog/references";
import lightboxReferences from "state/lightbox/references";
import postingsReferences from "state/postings/references";
import { PostingReference, PostingsState } from "state/postings/state";
import { ClientState } from "state/state";

const UNUSED_POSTINGS_LIMIT = 300;
const POSTING_RETENTION_SECONDS = 60;

export function getReferencedPostings(state: ClientState): PostingReference[] {
    return expandPostingReferences(state, [
        ...feedsReferences(state),
        ...detailedPostingReferences(state),
        ...composeReferences(state),
        ...reactionsDialogReferences(state),
        ...sharingsDialogReferences(state),
        ...repostDialogReferences(state),
        ...imageEditDialogReferences(state),
        ...lightboxReferences(state),
        ...postingsReferences(state)
    ]);
}

function expandPostingReferences(state: ClientState, roots: PostingReference[]): PostingReference[] {
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

    // Traverse only from retained roots, deduplicating to terminate cycles.
    for (const {nodeName, postingId} of references) {
        for (const reference of state.postings[nodeName]?.[postingId]?.references ?? []) {
            add(reference);
        }
        for (const attachment of state.postings[nodeName]?.[postingId]?.posting?.media ?? []) {
            if (attachment.postingId != null) {
                add({nodeName, postingId: attachment.postingId});
            }
        }
    }

    return references;
}

export function prunePostings(state: PostingsState, references: PostingReference[], at: number): PostingsState {
    const referenced = new Map<string, Set<string>>();
    for (const {nodeName, postingId} of references) {
        if (!referenced.has(nodeName)) {
            referenced.set(nodeName, new Set());
        }
        referenced.get(nodeName)!.add(postingId);
    }

    const istate = immutable.wrap(state);
    const candidates: (PostingReference & {lastUsedAt: number})[] = [];
    let unused = 0;
    for (const [nodeName, postings] of Object.entries(state)) {
        for (const [postingId, entry] of Object.entries(postings ?? {})) {
            if (entry == null) {
                continue;
            }
            const used = referenced.get(nodeName)?.has(postingId) ?? false;
            let lastUsedAt = entry.lastUsedAt ?? 0;
            if (used !== (entry.referenced ?? false)) {
                // Detect releases at maintenance time, conservatively starting a full grace period.
                lastUsedAt = Math.max(lastUsedAt, at);
                istate.assign([nodeName, postingId], {referenced: used, lastUsedAt});
            }
            if (used || entry.deleting || entry.verificationStatus === "running") {
                continue;
            }
            unused++;
            if (at - lastUsedAt >= POSTING_RETENTION_SECONDS) {
                candidates.push({nodeName, postingId, lastUsedAt});
            }
        }
    }

    if (unused > UNUSED_POSTINGS_LIMIT) {
        candidates.sort((a, b) => a.lastUsedAt - b.lastUsedAt);
        const removedByNode = new Map<string, number>();
        for (const {nodeName, postingId} of candidates.slice(0, unused - UNUSED_POSTINGS_LIMIT)) {
            istate.del([nodeName, postingId]);
            removedByNode.set(nodeName, (removedByNode.get(nodeName) ?? 0) + 1);
        }
        for (const [nodeName, removed] of removedByNode) {
            if (Object.keys(state[nodeName] ?? {}).length === removed) {
                istate.del([nodeName]);
            }
        }
    }

    return istate.value();
}
