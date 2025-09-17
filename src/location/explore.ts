import i18n from 'i18next';

import { tTitle } from "i18n";
import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { getNodeRootLocation } from "state/node/selectors";
import { isAtActivePeoplePage } from "state/navigation/selectors";
import { getFeedAt } from "state/feeds/selectors";
import { goToActivePeople, goToExplore } from "state/navigation/actions";
import { REL_CURRENT } from "util/rel-node-name";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    if (dstInfo.directories.length > 1 && dstInfo.directories[1] === "people") {
        return [goToActivePeople()];
    }
    const before = dstInfo.parameters["before"];
    return [goToExplore(before != null ? parseInt(before) : null)];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("explore");
    if (isAtActivePeoplePage(state)) {
        info = info.sub("people");
        return info.withTitle(tTitle(i18n.t("explore-people")));
    }
    const at = getFeedAt(state, REL_CURRENT, "explore");
    info = at < Number.MAX_SAFE_INTEGER ? info.withParameter("before", String(at)) : info;
    info = info.withCanonicalUrl(getNodeRootLocation(state) + info.toUrl()).noIndex();
    return info.withTitle(tTitle(i18n.t("explore-posts")));
}
