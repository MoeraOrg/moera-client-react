import { getFeedAt } from "state/feeds/selectors";
import { atOwner } from "util/misc";
import { goToTimeline } from "state/navigation/actions";
import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const before = dstInfo.parameters["before"];
    return [goToTimeline(before != null ? parseInt(before) : null)];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("timeline");
    const at = getFeedAt(state, "timeline");
    info = at < Number.MAX_SAFE_INTEGER ? info.withParameter("before", String(at)) : info;
    return info.withTitle("Timeline" + atOwner(state));
}
