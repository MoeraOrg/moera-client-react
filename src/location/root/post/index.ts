import { goToPosting } from "state/navigation/actions";
import { getDetailedPosting, getDetailedPostingId, getFocusedCommentId } from "state/detailedposting/selectors";
import { atOwner } from "util/misc";
import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const commentId = dstInfo.hash ? dstInfo.hash : dstInfo.parameters["comment"];
    return [goToPosting(dstInfo.directories[1], commentId)];
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
