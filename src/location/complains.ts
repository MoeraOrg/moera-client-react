import i18n from 'i18next';

import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { goToComplains } from "state/navigation/actions";
import { complainsGroupClose, complainsGroupOpen } from "state/complains/actions";
import { getActiveComplainGroupId } from "state/complains/selectors";
import { atOwner } from "util/misc";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const actions: ClientAction[] = [goToComplains()];
    const srcGroupId = srcInfo.directories[1];
    const dstGroupId = dstInfo.directories[1];
    if (srcGroupId == null) {
        if (dstGroupId != null) {
            actions.push(complainsGroupOpen(dstGroupId));
        }
    } else {
        if (dstGroupId == null) {
            actions.push(complainsGroupClose());
        } else {
            if (srcGroupId !== dstGroupId) {
                actions.push(complainsGroupOpen(dstGroupId));
            }
        }
    }
    return actions;
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("complains");
    const groupId = getActiveComplainGroupId(state);
    if (groupId != null) {
        info = info.sub(groupId);
    }
    return info.withTitle(i18n.t("complains") + atOwner(state));
}
