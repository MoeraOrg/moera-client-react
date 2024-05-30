import i18n from 'i18next';

import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { getNodeRootLocation } from "state/node/selectors";
import { getFeedAt } from "state/feeds/selectors";
import { goToTimeline } from "state/navigation/actions";
import { getFeedTitle } from "ui/feed/feeds";
import { atOwner } from "util/names";
import { REL_CURRENT } from "util/rel-node-name";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const before = dstInfo.parameters["before"];
    return [goToTimeline(before != null ? parseInt(before) : null)];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("timeline");
    const at = getFeedAt(state, REL_CURRENT, "timeline");
    info = at < Number.MAX_SAFE_INTEGER ? info.withParameter("before", String(at)) : info;
    info = info.withCanonicalUrl(getNodeRootLocation(state) + info.toUrl()).noIndex();
    return info.withTitle(getFeedTitle("timeline", i18n.t) + atOwner(state));
}
