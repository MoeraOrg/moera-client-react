import { executor } from "state/executor";
import { Node, SearchHashtagFilter } from "api";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { SearchLoadAction, searchLoaded, searchLoadFailed } from "state/search/actions";
import { REL_SEARCH } from "util/rel-node-name";

export default [
    executor("SEARCH_LOAD", payload => payload.query, searchLoadSaga)
];

async function searchLoadSaga(action: WithContext<SearchLoadAction>): Promise<void> {
    const {query} = action.payload;

    const filter: SearchHashtagFilter = {
        hashtags: [query],
        limit: 20
    }

    try {
        const slice = await Node.searchEntriesByHashtag(action, REL_SEARCH, filter);
        dispatch(searchLoaded(query, slice.entries).causedBy(action));
    } catch (e) {
        dispatch(searchLoadFailed(query).causedBy(action));
        dispatch(errorThrown(e));
    }
}
