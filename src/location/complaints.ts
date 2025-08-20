import i18n from 'i18next';

import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { goToComplaints } from "state/navigation/actions";
import { complaintsGroupClose, complaintsGroupOpen } from "state/complaints/actions";
import { getActiveComplaintGroupId } from "state/complaints/selectors";
import { atOwner } from "util/names";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const actions: ClientAction[] = [goToComplaints()];
    const srcGroupId = srcInfo.directories[1];
    const dstGroupId = dstInfo.directories[1];
    if (srcGroupId == null) {
        if (dstGroupId != null) {
            actions.push(complaintsGroupOpen(dstGroupId));
        }
    } else {
        if (dstGroupId == null) {
            actions.push(complaintsGroupClose());
        } else {
            if (srcGroupId !== dstGroupId) {
                actions.push(complaintsGroupOpen(dstGroupId));
            }
        }
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("complaints");
    const groupId = getActiveComplaintGroupId(state);
    if (groupId != null) {
        info = info.sub(groupId);
    }
    return info.noIndex().withTitle(i18n.t("complaints") + atOwner(state)).withBackTitle(i18n.t("back-complaints"));
}
