import i18n from 'i18next';
import cloneDeep from 'lodash.clonedeep';

import { SearchEntryType } from "api";
import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { goToSearch } from "state/navigation/actions";
import { SearchFilterBeforeDate, SearchFilterDatePeriod, SearchTab } from "state/search/state";
import { emptySearchFilter } from "state/search/empty";
import { getSafeSearchDefault, getSearchFilter, getSearchQuery, getSearchTab } from "state/search/selectors";
import { LocationInfo } from "location/LocationInfo";
import { toBoolean, toBooleanString } from "util/bool-string";

export function transform(srcInfo: LocationInfo, dstInfo: LocationInfo): ClientAction[] {
    const query = dstInfo.parameters["query"] ?? "";
    const tab = (dstInfo.parameters["tab"] ?? "content") as SearchTab;
    const filter = cloneDeep(emptySearchFilter);
    if (dstInfo.parameters["entry"] != null) {
        filter.entryType = dstInfo.parameters["entry"] as SearchEntryType;
    }
    if (dstInfo.parameters["news"] != null) {
        filter.inNewsfeed = toBoolean(dstInfo.parameters["news"]);
    }
    if (dstInfo.parameters["my"] != null) {
        filter.ownedByMe = toBoolean(dstInfo.parameters["my"]);
    }
    if (dstInfo.parameters["me"] != null) {
        filter.repliedToMe = toBoolean(dstInfo.parameters["me"]);
    }
    if (dstInfo.parameters["imin"] != null) {
        filter.minImageCount = parseInt(dstInfo.parameters["imin"]);
    }
    if (dstInfo.parameters["video"] != null) {
        filter.videoPresent = toBoolean(dstInfo.parameters["video"]);
    }
    if (dstInfo.parameters["safe"] != null) {
        filter.safeSearch = toBoolean(dstInfo.parameters["safe"]);
    }
    if (dstInfo.parameters["date"] != null) {
        filter.beforeDate = dstInfo.parameters["date"] as SearchFilterBeforeDate;
    }
    if (dstInfo.parameters["period"] != null) {
        filter.datePeriod = dstInfo.parameters["period"] as SearchFilterDatePeriod;
    }
    return [goToSearch(query, tab, filter)];
}

export function build(state: ClientState, info: LocationInfo): LocationInfo {
    info = info.sub("search")
    const query = getSearchQuery(state);
    const tab = getSearchTab(state);
    const filter = getSearchFilter(state);
    const safeSearchDefault = getSafeSearchDefault(state);
    if (query) {
        info = info.withParameter("query", query);
    }
    if (tab !== "content") {
        info = info.withParameter("tab", tab);
    }
    if (filter.entryType !== emptySearchFilter.entryType) {
        info = info.withParameter("entry", filter.entryType);
    }
    if (filter.inNewsfeed) {
        info = info.withParameter("news", "true");
    }
    if (filter.ownedByMe) {
        info = info.withParameter("my", "true");
    }
    if (filter.repliedToMe) {
        info = info.withParameter("me", "true");
    }
    if (filter.minImageCount != null && filter.minImageCount > 0) {
        info = info.withParameter("imin", filter.minImageCount.toString());
    }
    if (filter.videoPresent) {
        info = info.withParameter("video", "true");
    }
    if (filter.safeSearch != null && filter.safeSearch !== safeSearchDefault) {
        info = info.withParameter("safe", toBooleanString(filter.safeSearch));
    }
    if (filter.beforeDate !== emptySearchFilter.beforeDate) {
        info = info.withParameter("date", filter.beforeDate);
    }
    if (filter.datePeriod !== emptySearchFilter.datePeriod) {
        info = info.withParameter("period", filter.datePeriod);
    }
    return info.withTitle(i18n.t("search") + (query ? ": " + query : ""));
}
