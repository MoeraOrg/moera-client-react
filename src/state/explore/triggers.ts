import { conj, disj, trigger } from "state/trigger";
import { isAtActivePeoplePage, isAtStartReadingPage, isAtTrendingPage, isAtDiscussionsPage } from "state/navigation/selectors";
import { activePeopleLoad, trendingLoad, discussionsLoad } from "state/explore/actions";
import {
    isActivePeopleLoaded,
    isActivePeopleToBeLoaded,
    isTrendingLoaded,
    isTrendingToBeLoaded,
    isDiscussionsLoaded,
    isDiscussionsToBeLoaded
} from "state/explore/selectors";

export default [
    trigger(
        "GO_TO_PAGE",
        conj(disj(isAtActivePeoplePage, isAtStartReadingPage), isActivePeopleToBeLoaded),
        activePeopleLoad
    ),
    trigger("PULSE_6H", isActivePeopleLoaded, activePeopleLoad),
    trigger("GO_TO_PAGE", conj(isAtTrendingPage, isTrendingToBeLoaded), trendingLoad),
    trigger("PULSE_6H", isTrendingLoaded, trendingLoad),
    trigger("GO_TO_PAGE", conj(isAtDiscussionsPage, isDiscussionsToBeLoaded), discussionsLoad),
    trigger("PULSE_6H", isDiscussionsLoaded, discussionsLoad),
];
