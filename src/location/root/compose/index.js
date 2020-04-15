import { goToCompose } from "state/navigation/actions";
import { getComposeDraftId, getComposePostingId } from "state/compose/selectors";
import { atOwner } from "util/misc";

export function transform(srcInfo, dstInfo) {
    return [goToCompose(dstInfo.parameters["id"], dstInfo.parameters["draft"])];
}

export function build(state, info) {
    info = info.sub("compose");
    const id = getComposePostingId(state);
    if (id == null) {
        const draftId = getComposeDraftId(state);
        if (draftId != null) {
            info = info.withParameter("draft", draftId);
        }
        return info.withTitle("New Post" + atOwner(state));
    } else {
        return info.withParameter("id", id).withTitle("Edit Post" + atOwner(state));
    }
}
