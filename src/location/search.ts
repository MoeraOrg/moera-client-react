import i18n from 'i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToSearch } from "state/navigation/actions";
import { getSearchQuery } from "state/search/selectors";
import { LocationInfo } from "location/LocationInfo";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const query = dstInfo.parameters["query"];
    return [goToSearch(query ?? "")];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("search")
    const query = getSearchQuery(state);
    if (query) {
        info = info.withParameter("query", query);
    }
    return info.withTitle(i18n.t("search") + (query ? ": " + query : ""));
}
