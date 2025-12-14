import i18n from 'i18next';

import { tTitle } from "i18n";
import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { getNodeRootLocation } from "state/node/selectors";
import { isAtActivePeoplePage, isAtTrendingPage, isAtDiscussionsPage } from "state/navigation/selectors";
import { getFeedAt } from "state/feeds/selectors";
import { goToActivePeople, goToExplore, goToTrending, goToDiscussions } from "state/navigation/actions";
import { REL_CURRENT } from "util/rel-node-name";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    if (dstInfo.directories.length > 1) {
        if (dstInfo.directories[1] === "people") {
            return [goToActivePeople()];
        }
        if (dstInfo.directories[1] === "trending") {
            return [goToTrending()];
        }
        if (dstInfo.directories[1] === "discussions") {
            return [goToDiscussions()];
        }
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
    if (isAtTrendingPage(state)) {
        info = info.sub("trending");
        return info.withTitle(tTitle(i18n.t("trending")));
    }
    if (isAtDiscussionsPage(state)) {
        info = info.sub("discussions");
        return info.withTitle(tTitle(i18n.t("discussions")));
    }
    const at = getFeedAt(state, REL_CURRENT, "explore");
    info = at < Number.MAX_SAFE_INTEGER ? info.withParameter("before", String(at)) : info;
    info = info.withCanonicalUrl(getNodeRootLocation(state) + info.toUrl()).noIndex();
    return info.withTitle(tTitle(i18n.t("explore-posts")));
}
