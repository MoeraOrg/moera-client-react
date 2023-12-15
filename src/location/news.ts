import i18n from 'i18next';

import { LocationInfo } from "location/LocationInfo";
import { ClientAction } from "state/action";
import { ClientState } from "state/state";
import { getFeedAt } from "state/feeds/selectors";
import { goToNews } from "state/navigation/actions";
import { getFeedTitle } from "ui/feed/feeds";
import { atOwner } from "util/names";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const before = dstInfo.parameters["before"];
    return [goToNews(before != null ? parseInt(before) : null)];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("news");
    const at = getFeedAt(state, "news");
    info = at < Number.MAX_SAFE_INTEGER ? info.withParameter("before", String(at)) : info;
    return info.withTitle(getFeedTitle("news", i18n.t) + atOwner(state));
}
