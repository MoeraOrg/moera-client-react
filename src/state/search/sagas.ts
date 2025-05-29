import { executor } from "state/executor";
import { Node, SearchEntryType, SearchHashtagFilter, SearchNodeFilter, SearchTextFilter } from "api";
import { homeIntroduced } from "state/init-barriers";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import {
    searchHashtagLoaded,
    SearchLoadAction,
    searchLoadFailed,
    SearchLoadMoreAction,
    searchPeopleLoaded,
    searchTextLoaded
} from "state/search/actions";
import { SearchTab } from "state/search/state";
import { getSearchFilter, getSearchMode, getSearchQuery, getSearchTab, SEARCH_PAGE_SIZE } from "state/search/selectors";
import { nodeCardPrepare } from "state/nodecards/actions";
import { REL_SEARCH } from "util/rel-node-name";

export default [
    executor("SEARCH_LOAD", null, searchLoadSaga),
    executor("SEARCH_LOAD_MORE", null, searchLoadMoreSaga),
    executor("SEARCH_RESTORE_SCROLL", null, searchRestoreScrollSaga)
];

async function searchLoadSaga(action: WithContext<SearchLoadAction>): Promise<void> {
    const {query, tab} = action.payload;

    await homeIntroduced();
    await load(query, tab, Number.MAX_SAFE_INTEGER, 0, action);
}

async function searchLoadMoreSaga(action: WithContext<SearchLoadMoreAction>): Promise<void> {
    const query = select(getSearchQuery);
    const tab = select(getSearchTab);
    const after = select(state => state.search.after);
    const nextPage = select(state => state.search.nextPage);

    await load(query, tab, after, nextPage, action);
}

async function load(
    query: string, tab: SearchTab, before: number, nextPage: number, action: WithContext<ClientAction>
) {
    const mode = select(getSearchMode);
    const filter = select(getSearchFilter);

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

    try {
        if (mode === "hashtag") {
            const filter: SearchHashtagFilter = {
                entryType,
                hashtags: query.split(/\s+/).filter(x => x.startsWith("#")),
                publisherName,
                inNewsfeed,
                owners,
                minImageCount,
                videoPresent,
                before,
                limit: SEARCH_PAGE_SIZE
            }
            const slice = await Node.searchEntriesByHashtag(action, REL_SEARCH, filter);
            dispatch(searchHashtagLoaded(slice).causedBy(action));
        } else {
            if (tab === "people") {
                const filter: SearchNodeFilter = {
                    query,
                    page: nextPage,
                    limit: SEARCH_PAGE_SIZE
                }
                const page = await Node.searchNodes(action, REL_SEARCH, filter);
                dispatch(searchPeopleLoaded(page).causedBy(action));
                page.nodes.forEach(node => dispatch(nodeCardPrepare(node.nodeName).causedBy(action)));
            } else {
                const filter: SearchTextFilter = {
                    entryType,
                    text: query,
                    publisherName,
                    inNewsfeed,
                    owners,
                    repliedTo,
                    minImageCount,
                    videoPresent,
                    page: nextPage,
                    limit: SEARCH_PAGE_SIZE
                }
                const page = await Node.searchEntriesByText(action, REL_SEARCH, filter);
                dispatch(searchTextLoaded(page).causedBy(action));
            }
        }
    } catch (e) {
        dispatch(searchLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}

function searchRestoreScrollSaga(): void {
    const position = select(state => state.search.scrollPosition);
    setTimeout(() => window.scrollTo(0, position), 100);
}
