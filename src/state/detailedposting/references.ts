import { getOwnerNameOrUrl } from "state/node/selectors";
import { PostingReference } from "state/postings/state";
import { ClientState } from "state/state";

export default function getReferencedPostings(state: ClientState): PostingReference[] {
    const postingId = state.detailedPosting?.id;
    return postingId != null ? [{nodeName: getOwnerNameOrUrl(state), postingId}] : [];
}
