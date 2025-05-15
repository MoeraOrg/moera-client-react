import { executor } from "state/executor";
import { Node, SearchHashtagFilter, SearchTextFilter } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { SearchLoadAction, searchLoaded, searchLoadFailed } from "state/search/actions";
import { REL_SEARCH } from "util/rel-node-name";

export default [
    executor("SEARCH_LOAD", payload => payload.query, searchLoadSaga)
];

async function searchLoadSaga(action: WithContext<SearchLoadAction>): Promise<void> {
    const {query} = action.payload;

    const mode = select(state => state.search.mode);
    try {
        if (mode === "hashtag") {
            const filter: SearchHashtagFilter = {
                hashtags: query.split(/\s+/).filter(x => x.startsWith("#")),
                limit: 20
            }
            const slice = await Node.searchEntriesByHashtag(action, REL_SEARCH, filter);
            dispatch(searchLoaded(query, slice.entries).causedBy(action));
        } else {
            const filter: SearchTextFilter = {
                text: query,
                limit: 20
            }
            const page = await Node.searchEntriesByText(action, REL_SEARCH, filter);
            dispatch(searchLoaded(query, page.entries).causedBy(action));
        }
    } catch (e) {
        dispatch(searchLoadFailed().causedBy(action));
        dispatch(errorThrown(e));
    }
}
