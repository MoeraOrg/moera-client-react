import { goToCompose } from "state/navigation/actions";
import { getComposeDraftId, getComposePostingId } from "state/compose/selectors";
import { atOwner } from "util/misc";
import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    return [goToCompose(dstInfo.parameters["id"], dstInfo.parameters["draft"])];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
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
