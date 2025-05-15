import { trigger } from "state/trigger";
import { searchLoad } from "state/search/actions";
import { GoToSearchAction } from "state/navigation/actions";
import { isAtSearchPage } from "state/navigation/selectors";

export default [
    trigger(
        "GO_TO_PAGE",
        isAtSearchPage,
        (signal: GoToSearchAction) => searchLoad(signal.payload.details.query)
    )
];
