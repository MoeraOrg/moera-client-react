import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToCompose } from "state/navigation/actions";
import { getComposeDraftId, getComposePostingId } from "state/compose/selectors";
import { LocationInfo } from "location/LocationInfo";
import { atOwner } from "util/names";

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
        return info.withTitle(i18n.t("new-post-title") + atOwner(state));
    } else {
        return info.withParameter("id", id).withTitle(i18n.t("edit-post-title") + atOwner(state));
    }
}
