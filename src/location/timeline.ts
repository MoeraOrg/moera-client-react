import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { getFeedAt } from "state/feeds/selectors";
import { goToTimeline } from "state/navigation/actions";
import { getFeedTitle } from "ui/feed/feeds";
import { atOwner } from "util/misc";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const before = dstInfo.parameters["before"];
    return [goToTimeline(before != null ? parseInt(before) : null)];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("timeline");
    const at = getFeedAt(state, "timeline");
    info = at < Number.MAX_SAFE_INTEGER ? info.withParameter("before", String(at)) : info;
    return info.withTitle(getFeedTitle("timeline") + atOwner(state));
}
