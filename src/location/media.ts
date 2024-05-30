import { ClientState } from "state/state";
import { LocationInfo } from "location/LocationInfo";
import { getNodeRootLocation } from "state/node/selectors";
import { getLightBoxCommentId, getLightBoxMediaId, getLightBoxPostingId } from "state/lightbox/selectors";
import { getPosting } from "state/postings/selectors";
import { atOwner } from "util/names";
import { REL_CURRENT } from "util/rel-node-name";

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    const postingId = getLightBoxPostingId(state);
    if (postingId != null) {
        info = info.sub("post").sub(postingId);
    }
    const commentId = getLightBoxCommentId(state);
    if (commentId != null) {
        info = info.withParameter("comment", commentId);
    }
    const mediaId = getLightBoxMediaId(state);
    if (mediaId != null) {
        info = info.withParameter("media", mediaId);
    }
    info = info.withCanonicalUrl(getNodeRootLocation(state) + info.toUrl());
    const posting = getPosting(state, postingId, REL_CURRENT);
    const heading = posting != null ? posting.heading : "";
    return info.withTitle(heading + atOwner(state));
}
