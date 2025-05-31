import { trigger } from "state/trigger";
import { ClientState } from "state/state";
import { GoToSearchAction, updateLocation } from "state/navigation/actions";
import { isAtSearchPage } from "state/navigation/selectors";
import { searchLoad, searchRestoreScroll } from "state/search/actions";
import { getSearchQuery, getSearchTab } from "state/search/selectors";

function isSameQuery(signal: GoToSearchAction, state: ClientState) {
    return signal.payload.details.query === getSearchQuery(state)
           && signal.payload.details.tab === getSearchTab(state);
}

export default [
    trigger(
        "GO_TO_PAGE",
        (state: ClientState, signal: GoToSearchAction) => isAtSearchPage(state) && !isSameQuery(signal, state),
        (signal: GoToSearchAction) =>
            searchLoad(signal.payload.details.query, signal.payload.details.tab, signal.payload.details.filter)
    ),
    trigger(
        "GO_TO_PAGE",
        (state: ClientState, signal: GoToSearchAction) => isAtSearchPage(state) && isSameQuery(signal, state),
        searchRestoreScroll
    ),
    trigger("SEARCH_LOAD", true, updateLocation)
];
