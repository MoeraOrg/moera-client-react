import { executor } from "state/executor";
import { Node, SearchHashtagFilter, SearchTextFilter } from "api";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { SearchLoadAction, searchLoaded, searchLoadFailed, SearchLoadMoreAction } from "state/search/actions";
import { getSearchQuery, SEARCH_PAGE_SIZE } from "state/search/selectors";
import { REL_SEARCH } from "util/rel-node-name";

export default [
    executor("SEARCH_LOAD", null, searchLoadSaga),
    executor("SEARCH_LOAD_MORE", null, searchLoadMoreSaga)
];

async function searchLoadSaga(action: WithContext<SearchLoadAction>): Promise<void> {
    const {query} = action.payload;

    await load(query, Number.MAX_SAFE_INTEGER, 0, action);
}

async function searchLoadMoreSaga(action: WithContext<SearchLoadMoreAction>): Promise<void> {
    const query = select(getSearchQuery);
    const after = select(state => state.search.after);
    const nextPage = select(state => state.search.nextPage);

    await load(query, after, nextPage, action);
}

async function load(query: string, before: number, nextPage: number, action: WithContext<ClientAction>) {
    const mode = select(state => state.search.mode);
    try {
        if (mode === "hashtag") {
            const filter: SearchHashtagFilter = {
                hashtags: query.split(/\s+/).filter(x => x.startsWith("#")),
                before,
                limit: SEARCH_PAGE_SIZE
            }
            const slice = await Node.searchEntriesByHashtag(action, REL_SEARCH, filter);
            dispatch(searchLoaded(slice).causedBy(action));
        } else {
            const filter: SearchTextFilter = {
                text: query,
                page: nextPage,
                limit: SEARCH_PAGE_SIZE
            }
            const page = await Node.searchEntriesByText(action, REL_SEARCH, filter);
            dispatch(searchLoaded(page).causedBy(action));
        }
    } catch (e) {
        dispatch(searchLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}
