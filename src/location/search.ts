import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToSearch } from "state/navigation/actions";
import { SearchTab } from "state/search/state";
import { getSearchQuery, getSearchTab } from "state/search/selectors";
import { LocationInfo } from "location/LocationInfo";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const query = dstInfo.parameters["query"] ?? "";
    const tab = (dstInfo.parameters["tab"] ?? "content") as SearchTab;
    return [goToSearch(query, tab)];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("search")
    const query = getSearchQuery(state);
    const tab = getSearchTab(state);
    if (query) {
        info = info.withParameter("query", query);
    }
    if (tab !== "content") {
        info = info.withParameter("tab", tab);
    }
    return info.withTitle(i18n.t("search") + (query ? ": " + query : ""));
}
