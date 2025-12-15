import { conj, disj, trigger } from "state/trigger";
import {
    isAtActivePeoplePage,
    isAtDiscussionsPage,
    isAtNewsPage,
    isAtStartReadingPage,
    isAtTrendingPage
} from "state/navigation/selectors";
import { activePeopleLoad, discussionsLoad, trendingLoad } from "state/explore/actions";
import {
    isActivePeopleLoaded,
    isActivePeopleToBeLoaded,
    isDiscussionsLoaded,
    isDiscussionsToBeLoaded,
    isTrendingLoaded,
    isTrendingToBeLoaded
} from "state/explore/selectors";

export default [
    trigger(
        "GO_TO_PAGE",
        conj(disj(isAtActivePeoplePage, isAtStartReadingPage), isActivePeopleToBeLoaded),
        activePeopleLoad
    ),
    trigger("PULSE_6H", isActivePeopleLoaded, activePeopleLoad),
    trigger("GO_TO_PAGE", conj(disj(isAtTrendingPage, isAtNewsPage), isTrendingToBeLoaded), trendingLoad),
    trigger("PULSE_6H", isTrendingLoaded, trendingLoad),
    trigger("GO_TO_PAGE", conj(disj(isAtDiscussionsPage, isAtNewsPage), isDiscussionsToBeLoaded), discussionsLoad),
    trigger("PULSE_6H", isDiscussionsLoaded, discussionsLoad),
];
