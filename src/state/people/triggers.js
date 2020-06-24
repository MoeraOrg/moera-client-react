import { conj, trigger } from "state/trigger";
import { GO_TO_PAGE, newLocation } from "state/navigation/actions";
import { isAtPeoplePage } from "state/navigation/selectors";
import {
    isAtSubscribersTab,
    isAtSubscriptionsTab,
    isPeopleGeneralToBeLoaded,
    isSubscribersToBeLoaded,
    isSubscriptionsToBeLoaded
} from "state/people/selectors";
import { PEOPLE_GO_TO_TAB, peopleGeneralLoad, subscribersLoad, subscriptionsLoad } from "state/people/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtPeoplePage, isPeopleGeneralToBeLoaded), peopleGeneralLoad),
    trigger(PEOPLE_GO_TO_TAB, true, newLocation),
    trigger(PEOPLE_GO_TO_TAB, conj(isAtSubscribersTab, isSubscribersToBeLoaded), subscribersLoad),
    trigger(PEOPLE_GO_TO_TAB, conj(isAtSubscriptionsTab, isSubscriptionsToBeLoaded), subscriptionsLoad)
];
