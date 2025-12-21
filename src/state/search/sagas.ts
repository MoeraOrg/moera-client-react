import { endOfDay, getUnixTime, startOfDay, subDays, subMonths, subWeeks, subYears } from 'date-fns';
import clipboardCopy from 'clipboard-copy';

import { executor } from "state/executor";
import i18n from "i18next";
import { Node, SearchEntryType, SearchHashtagFilter, SearchNodeFilter, SearchTextFilter } from "api";
import { homeIntroduced } from "state/init-barriers";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { getNodeUri } from "state/naming/sagas";
import { flashBox } from "state/flashbox/actions";
import {
    SearchEntryCopyLinkAction,
    searchHashtagLoaded,
    searchHistoryAdd,
    SearchHistoryDeleteAction,
    SearchHistoryLoadAction,
    searchHistoryLoaded,
    searchHistoryLoadFailed,
    SearchLoadAction,
    searchLoadFailed,
    SearchLoadMoreAction,
    searchPeopleLoaded,
    searchTextLoaded
} from "state/search/actions";
import { SearchFilterBeforeDate, SearchFilterDatePeriod, SearchTab } from "state/search/state";
import {
    getSafeSearchDefault,
    getSearchFilter,
    getSearchMode,
    getSearchQuery,
    getSearchTab,
    SEARCH_PAGE_SIZE
} from "state/search/selectors";
import { nodeCardsPreload } from "state/nodecards/actions";
import { getSetting } from "state/settings/selectors";
import * as Browser from "ui/browser";
import { REL_HOME, REL_SEARCH } from "util/rel-node-name";
import { universalLocation } from "util/universal-url";
import { ut } from "util/url";

export default [
    executor("SEARCH_LOAD", null, searchLoadSaga),
    executor("SEARCH_LOAD_MORE", null, searchLoadMoreSaga),
    executor("SEARCH_RESTORE_SCROLL", null, searchRestoreScrollSaga),
    executor("SEARCH_HISTORY_LOAD", payload => payload.query, searchHistoryLoadSaga),
    executor("SEARCH_HISTORY_DELETE", payload => payload.query, searchHistoryDeleteSaga),
    executor("SEARCH_ENTRY_COPY_LINK", null, searchEntryCopyLinkSaga)
];

async function searchLoadSaga(action: WithContext<SearchLoadAction>): Promise<void> {
    const {query, tab} = action.payload;

    await homeIntroduced();
    await load(query, tab, Number.MAX_SAFE_INTEGER, 0, action);
    if (query) {
        saveToHistory(query, action);
    }
}

async function saveToHistory(query: string, action: WithContext<ClientAction>): Promise<void> {
    try {
        const history = await Node.saveToSearchHistory(action, REL_HOME, {query});
        dispatch(searchHistoryAdd(history));
    } catch (e) {
        // ignore
    }
}

async function searchLoadMoreSaga(action: WithContext<SearchLoadMoreAction>): Promise<void> {
    const query = select(getSearchQuery);
    const tab = select(getSearchTab);
    const after = select(state => state.search.after);
    const nextPage = select(state => state.search.nextPage);

    await load(query, tab, after, nextPage, action);
}

const getBeforeDate = (value: SearchFilterBeforeDate): Date => {
    const now = new Date();
    switch (value) {
        case "now":
            return now;
        case "yesterday":
            return subDays(now, 1);
        case "week":
            return subWeeks(now, 1);
        case "month":
            return subMonths(now, 1);
        case "3-months":
            return subMonths(now, 3);
        case "year":
            return subYears(now, 1);
    }
};

const getDatePeriod = (value: SearchFilterDatePeriod): [Date | undefined, Date | undefined] => {
    const now = new Date();
    switch (value) {
        case "any":
            return [undefined, undefined];
        case "today":
            return [startOfDay(now), undefined];
        case "yesterday":
            const yesterday = subDays(now, 1);
            return [startOfDay(yesterday), endOfDay(yesterday)];
        case "week":
            return [startOfDay(subWeeks(now, 1)), undefined];
        case "month":
            return [startOfDay(subMonths(now, 1)), undefined];
        case "3-months":
            return [startOfDay(subMonths(now, 3)), undefined];
        case "year":
            return [startOfDay(subYears(now, 1)), undefined];
        case "year+":
            return [undefined, startOfDay(subYears(now, 1))];
    }
};

const toUnixTime = (date: Date | undefined): number | undefined =>
    date ? getUnixTime(date) : undefined;

async function load(
    query: string, tab: SearchTab, before: number, nextPage: number, action: WithContext<ClientAction>
) {
    const mode = select(getSearchMode);
    const filter = select(getSearchFilter);
    const sheriffNameDefault = select(state => getSetting(state, "search.sheriff-name") as string);
    const safeSearchDefault = select(getSafeSearchDefault);

    let entryType: SearchEntryType = filter.entryType;
    switch (tab) {
        case "content":
            entryType = "all";
            break;
        case "postings":
            entryType = "posting";
            break;
        case "comments":
            entryType = "comment";
            break;
    }
    const publisherName = tab === "own-blog"
        ? action.context.homeOwnerName
        : (tab === "current-blog" ? action.context.ownerName : null);
    const inNewsfeed = tab === "own-blog" ? filter.inNewsfeed : undefined;
    const owners = action.context.homeOwnerName && filter.ownedByMe ? [action.context.homeOwnerName] : undefined;
    const repliedTo = action.context.homeOwnerName && filter.repliedToMe && entryType !== "posting"
        ? [action.context.homeOwnerName]
        : undefined;
    const minImageCount = filter.minImageCount ?? undefined;
    const videoPresent = filter.videoPresent;
    const sheriffName = (filter.safeSearch ?? safeSearchDefault) && sheriffNameDefault ? sheriffNameDefault : undefined;

    try {
        if (mode === "hashtag") {
            if (before >= Number.MAX_SAFE_INTEGER && filter.beforeDate !== "now") {
                before = getUnixTime(getBeforeDate(filter.beforeDate)) * 1000;
            }
            const searchFilter: SearchHashtagFilter = {
                entryType,
                hashtags: query.split(/\s+/).filter(x => x.startsWith("#")),
                publisherName,
                inNewsfeed,
                owners,
                minImageCount,
                videoPresent,
                sheriffName,
                before,
                limit: SEARCH_PAGE_SIZE
            }
            const slice = await Node.searchEntriesByHashtag(action, REL_SEARCH, searchFilter);
            dispatch(searchHashtagLoaded(slice).causedBy(action));
        } else {
            if (tab === "people") {
                const searchFilter: SearchNodeFilter = {
                    query,
                    sheriffName,
                    page: nextPage,
                    limit: SEARCH_PAGE_SIZE
                }
                const page = await Node.searchNodes(action, REL_SEARCH, searchFilter);
                dispatch(searchPeopleLoaded(page).causedBy(action));
                dispatch(nodeCardsPreload(page.nodes.map(node => node.nodeName)).causedBy(action));
            } else {
                const [createdAfter, createdBefore] = getDatePeriod(filter.datePeriod);
                const searchFilter: SearchTextFilter = {
                    entryType,
                    text: query,
                    publisherName,
                    inNewsfeed,
                    owners,
                    repliedTo,
                    minImageCount,
                    videoPresent,
                    sheriffName,
                    createdBefore: toUnixTime(createdBefore),
                    createdAfter: toUnixTime(createdAfter),
                    page: nextPage,
                    limit: SEARCH_PAGE_SIZE
                }
                const page = await Node.searchEntriesByText(action, REL_SEARCH, searchFilter);
                dispatch(searchTextLoaded(page).causedBy(action));
            }
        }
    } catch (e) {
        dispatch(searchLoadFailed().causedBy(action));
    }
}

function searchRestoreScrollSaga(): void {
    const position = select(state => state.search.scrollPosition);
    setTimeout(() => window.scrollTo(0, position), 100);
}

async function searchHistoryLoadSaga(action: WithContext<SearchHistoryLoadAction>): Promise<void> {
    try {
        const history = await Node.getSearchHistory(action, REL_HOME, action.payload.query, 15);
        dispatch(searchHistoryLoaded(action.payload.query, history).causedBy(action));
    } catch (e) {
        dispatch(searchHistoryLoadFailed(action.payload.query).causedBy(action));
    }
}

async function searchHistoryDeleteSaga(action: WithContext<SearchHistoryDeleteAction>): Promise<void> {
    try {
        await Node.deleteFromSearchHistory(action, REL_HOME, action.payload.query);
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

async function searchEntryCopyLinkSaga(action: WithContext<SearchEntryCopyLinkAction>): Promise<void> {
    const {nodeName, postingId, commentId} = action.payload;

    try {
        const nodeUri = await getNodeUri(action, nodeName);
        const location = ut`/post/${postingId}` + (commentId != null ? ut`?comment=${commentId}` : "");
        const href = universalLocation(null, nodeName, nodeUri, location);
        await clipboardCopy(href);
        if (!Browser.isAndroidBrowser()) {
            dispatch(flashBox(i18n.t("link-copied")).causedBy(action));
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}
