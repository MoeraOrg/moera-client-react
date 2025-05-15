import { trigger } from "state/trigger";
import { ClientState } from "state/state";
import { GoToSearchAction } from "state/navigation/actions";
import { isAtSearchPage } from "state/navigation/selectors";
import { searchLoad } from "state/search/actions";
import { getSearchQuery } from "state/search/selectors";

export default [
    trigger(
        "GO_TO_PAGE",
        (state: ClientState, signal: GoToSearchAction) =>
            isAtSearchPage(state) && signal.payload.details.query !== getSearchQuery(state),
        (signal: GoToSearchAction) => searchLoad(signal.payload.details.query)
    )
];
