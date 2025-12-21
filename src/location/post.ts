import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { getNodeRootLocation } from "state/node/selectors";
import { goToPosting } from "state/navigation/actions";
import { openLightBox } from "state/lightbox/actions";
import {
    getDetailedPosting,
    getDetailedPostingId,
    getFocusedCommentId,
    isDetailedPostingGalleryExpanded
} from "state/detailedposting/selectors";
import { LocationInfo } from "location/LocationInfo";
import { atOwner } from "util/names";
import { REL_CURRENT } from "util/rel-node-name";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const postingId = dstInfo.directories[1];
    const hash = dstInfo.hash?.includes("_fn-") || dstInfo.hash?.includes("_fnref-") ? null : dstInfo.hash;
    const commentId = hash || dstInfo.parameters["comment"];
    const expanded = dstInfo.parameters["expanded"] === "true";
    const actions: ClientAction[] = [goToPosting(postingId, commentId, expanded)];
    const mediaId = dstInfo.parameters["media"];
    if (mediaId != null) {
        actions.push(openLightBox(REL_CURRENT, postingId, commentId ?? null, mediaId));
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("post");
    const postingId = getDetailedPostingId(state);
    if (postingId != null) {
        info = info.sub(postingId);
    } else {
        info = info.withError();
    }
    const focusedCommentId = getFocusedCommentId(state);
    if (focusedCommentId != null) {
        info = info.withParameter("comment", focusedCommentId);
    }
    const expanded = isDetailedPostingGalleryExpanded(state);
    if (expanded) {
        info = info.withParameter("expanded", "true");
    }
    info = info.withCanonicalUrl(getNodeRootLocation(state) + info.toUrl());
    const posting = getDetailedPosting(state);
    const heading = posting != null ? posting.heading : "";
    return info.withTitle(heading + atOwner(state));
}
