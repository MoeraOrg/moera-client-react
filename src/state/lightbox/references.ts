import { getRelNodeNameContext } from "state/home/selectors";
import { getLightboxMediaPostingId } from "state/lightbox/selectors";
import { getOwnerNameOrUrl } from "state/node/selectors";
import { PostingReference } from "state/postings/state";
import { ClientState } from "state/state";
import { absoluteNodeName } from "util/rel-node-name";

export default function getReferencedPostings(state: ClientState): PostingReference[] {
    if (!state.lightbox?.show) {
        return [];
    }
    const {postingId} = state.lightbox;
    const nodeName = absoluteNodeName(state.lightbox.nodeName, getRelNodeNameContext(state));
    const references: PostingReference[] = [];
    if (postingId != null) {
        // The parent is read from the current node; media can belong to another node.
        references.push({nodeName: getOwnerNameOrUrl(state), postingId}, {nodeName, postingId});
    }
    const mediaPostingId = getLightboxMediaPostingId(state);
    if (mediaPostingId != null) {
        references.push({nodeName, postingId: mediaPostingId});
    }
    return references;
}
