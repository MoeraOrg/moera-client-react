import { getFeedAt } from "state/feeds/selectors";
import { goToNews } from "state/navigation/actions";
import { atOwner } from "util/misc";

export function transform(srcInfo, dstInfo) {
    const before = dstInfo.parameters["before"];
    return [goToNews(before != null ? parseInt(before) : null)];
}

export function build(state, info) {
    info = info.sub("news");
    const at = getFeedAt(state, "news");
    info = at < Number.MAX_SAFE_INTEGER ? info.withParameter("before", at) : info;
    return info.withTitle("News" + atOwner(state));
}
