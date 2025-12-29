import { conj, disj, inv, trigger } from "state/trigger";
import { isConnectedToHome } from "state/home/selectors";
import {
    isAtActivePeoplePage,
    isAtDetailedPostingPage,
    isAtDiscussionsPage,
    isAtNewsPage,
    isAtStartReadingPage,
    isAtTrendingPage
} from "state/navigation/selectors";
import { activePeopleLoad, discussionsLoad, discussionsVisited, trendingLoad } from "state/explore/actions";
import {
    isActivePeopleLoaded,
    isActivePeopleToBeLoaded,
    isDiscussionsLoaded,
    isDiscussionsToBeLoaded,
    isTrendingLoaded,
    isTrendingToBeLoaded
} from "state/explore/selectors";
import { isTinyScreen } from "ui/hook";

export default [
    trigger(
        "GO_TO_PAGE",
        conj(disj(isAtActivePeoplePage, isAtStartReadingPage), isActivePeopleToBeLoaded),
        activePeopleLoad
    ),
    trigger("PULSE_6H", isActivePeopleLoaded, activePeopleLoad),
    trigger("GO_TO_PAGE", conj(disj(isAtTrendingPage, isAtNewsPage), isTrendingToBeLoaded), trendingLoad),
    trigger(
        "GO_TO_PAGE",
        conj(inv(isConnectedToHome), inv(isTinyScreen), isAtDetailedPostingPage, isTrendingToBeLoaded),
        trendingLoad
    ),
    trigger("PULSE_6H", isTrendingLoaded, trendingLoad),
    trigger("GO_TO_PAGE", conj(disj(isAtDiscussionsPage, isAtNewsPage), isDiscussionsToBeLoaded), discussionsLoad),
    trigger(
        "GO_TO_PAGE",
        conj(inv(isConnectedToHome), inv(isTinyScreen), isAtDetailedPostingPage, isDiscussionsToBeLoaded),
        discussionsLoad
    ),
    trigger("GO_TO_PAGE", isAtDiscussionsPage, discussionsVisited),
    trigger("GO_TO_PAGE", conj(isAtNewsPage, inv(isTinyScreen)), discussionsVisited),
    trigger("PULSE_6H", isDiscussionsLoaded, discussionsLoad),
];
