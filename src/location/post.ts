import { goToPosting } from "state/navigation/actions";
import { openLightBox } from "state/lightbox/actions";
import { getDetailedPosting, getDetailedPostingId, getFocusedCommentId } from "state/detailedposting/selectors";
import { atOwner } from "util/misc";
import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const postingId = dstInfo.directories[1];
    const commentId = dstInfo.hash ? dstInfo.hash : dstInfo.parameters["comment"];
    const actions: ClientAction[] = [goToPosting(postingId, commentId)];
    const mediaId = dstInfo.parameters["media"];
    if (mediaId != null) {
        actions.push(openLightBox("", postingId, commentId ?? null, mediaId));
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("post").sub(getDetailedPostingId(state)!);
    const focusedCommentId = getFocusedCommentId(state);
    if (focusedCommentId != null) {
        info = info.withParameter("comment", focusedCommentId);
    }
    const posting = getDetailedPosting(state);
    const heading = posting != null ? posting.heading : "";
    return info.withTitle(heading + atOwner(state));
}
