import { conj, inv, trigger } from "state/trigger";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { GO_TO_PAGE, newLocation } from "state/navigation/actions";
import { isAtPeoplePage } from "state/navigation/selectors";
import {
    isAtSubscribersTab,
    isAtSubscriptionsTab,
    isPeopleGeneralToBeLoaded,
    isSubscribersToBeLoaded,
    isSubscribersTotalVisible,
    isSubscribersVisible,
    isSubscriptionsToBeLoaded,
    isSubscriptionsTotalVisible,
    isSubscriptionsVisible
} from "state/people/selectors";
import {
    PEOPLE_GENERAL_LOADED,
    PEOPLE_GO_TO_TAB,
    peopleGeneralLoad,
    peopleGoToTab,
    subscribersLoad, subscribersUnset, subscriptionsUnset,
    subscriptionsLoad
} from "state/people/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtPeoplePage, isPeopleGeneralToBeLoaded), peopleGeneralLoad),
    trigger(PEOPLE_GO_TO_TAB, true, newLocation),
    trigger(PEOPLE_GO_TO_TAB, conj(isAtSubscribersTab, isSubscribersToBeLoaded), subscribersLoad),
    trigger(PEOPLE_GO_TO_TAB, conj(isAtSubscriptionsTab, isSubscriptionsToBeLoaded), subscriptionsLoad),
    trigger(
        PEOPLE_GENERAL_LOADED,
        conj(isAtPeoplePage, inv(isSubscribersVisible), inv(isSubscribersTotalVisible), isAtSubscribersTab),
        peopleGoToTab("subscriptions")
    ),
    trigger(
        PEOPLE_GENERAL_LOADED,
        conj(isAtPeoplePage, inv(isSubscriptionsVisible), inv(isSubscriptionsTotalVisible), isAtSubscriptionsTab),
        peopleGoToTab("subscribers")
    ),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], isAtPeoplePage, peopleGeneralLoad),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME],
        conj(isAtPeoplePage, isAtSubscribersTab),
        subscribersLoad
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME],
        conj(isAtPeoplePage, inv(isAtSubscribersTab)),
        subscribersUnset
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME],
        conj(isAtPeoplePage, isAtSubscriptionsTab),
        subscriptionsLoad
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME],
        conj(isAtPeoplePage, inv(isAtSubscriptionsTab)),
        subscriptionsUnset
    )
];
