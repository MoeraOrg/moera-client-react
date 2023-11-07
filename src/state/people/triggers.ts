import { conj, inv, trigger } from "state/trigger";
import { newLocation } from "state/navigation/actions";
import { isAtPeoplePage } from "state/navigation/selectors";
import {
    isAtBlockedByTab,
    isAtBlockedTab,
    isAtFriendOfsTab,
    isAtFriendsTab,
    isAtSubscribersTab,
    isAtSubscriptionsTab,
    isBlockedByToBeLoaded,
    isBlockedToBeLoaded,
    isFriendOfsToBeLoaded,
    isFriendsToBeLoaded,
    isPeopleGeneralToBeLoaded,
    isSubscribersToBeLoaded,
    isSubscriptionsToBeLoaded
} from "state/people/selectors";
import {
    blockedByLoad,
    blockedLoad,
    friendOfsLoad,
    friendsLoad,
    peopleGeneralLoad,
    peopleGeneralUnset,
    peopleGoToDefaultTab,
    peopleUnset,
    subscribersLoad,
    subscriptionsLoad
} from "state/people/actions";
import {
    EventAction,
    SubscriptionAddedEvent,
    SubscriptionDeletedEvent
} from "api/events";

export default [
    trigger("GO_TO_PAGE", conj(isAtPeoplePage, isPeopleGeneralToBeLoaded), peopleGeneralLoad),
    trigger("PEOPLE_GO_TO_TAB", true, newLocation),
    trigger("PEOPLE_GO_TO_TAB", conj(isAtSubscribersTab, isSubscribersToBeLoaded), subscribersLoad),
    trigger("PEOPLE_GO_TO_TAB", conj(isAtSubscriptionsTab, isSubscriptionsToBeLoaded), subscriptionsLoad),
    trigger("PEOPLE_GO_TO_TAB", conj(isAtFriendsTab, isFriendsToBeLoaded), friendsLoad),
    trigger("PEOPLE_GO_TO_TAB", conj(isAtFriendOfsTab, isFriendOfsToBeLoaded), friendOfsLoad),
    trigger("PEOPLE_GO_TO_TAB", conj(isAtBlockedTab, isBlockedToBeLoaded), blockedLoad),
    trigger("PEOPLE_GO_TO_TAB", conj(isAtBlockedByTab, isBlockedByToBeLoaded), blockedByLoad),
    trigger("PEOPLE_GENERAL_LOADED", isAtPeoplePage, peopleGoToDefaultTab),
    trigger("HOME_INTRODUCED", isAtPeoplePage, peopleGeneralLoad),
    trigger("HOME_INTRODUCED", true, peopleUnset),
    trigger("HOME_INTRODUCED", conj(isAtPeoplePage, isAtSubscribersTab), subscribersLoad),
    trigger("HOME_INTRODUCED", conj(isAtPeoplePage, isAtSubscriptionsTab), subscriptionsLoad),
    trigger("HOME_INTRODUCED", conj(isAtPeoplePage, isAtFriendsTab), friendsLoad),
    trigger("HOME_INTRODUCED", conj(isAtPeoplePage, isAtFriendOfsTab), friendOfsLoad),
    trigger("HOME_INTRODUCED", conj(isAtPeoplePage, isAtBlockedTab), blockedLoad),
    trigger("HOME_INTRODUCED", conj(isAtPeoplePage, isAtBlockedByTab), blockedByLoad),
    trigger(
        ["FEED_SUBSCRIBED", "FEED_UNSUBSCRIBED", "EVENT_NODE_SUBSCRIBER_ADDED", "EVENT_NODE_SUBSCRIBER_DELETED"],
        isAtPeoplePage,
        peopleGeneralLoad
    ),
    trigger(
        ["EVENT_NODE_SUBSCRIPTION_ADDED", "EVENT_NODE_SUBSCRIPTION_DELETED"],
        (state, signal: EventAction<SubscriptionAddedEvent | SubscriptionDeletedEvent>) =>
            isAtPeoplePage(state) && signal.payload.subscription.type === "feed",
        peopleGeneralLoad
    ),
    trigger(
        ["FEED_SUBSCRIBED", "FEED_UNSUBSCRIBED", "EVENT_NODE_SUBSCRIBER_ADDED", "EVENT_NODE_SUBSCRIBER_DELETED"],
        inv(isAtPeoplePage),
        peopleGeneralUnset
    ),
    trigger(
        ["EVENT_NODE_SUBSCRIPTION_ADDED", "EVENT_NODE_SUBSCRIPTION_DELETED"],
        (state, signal: EventAction<SubscriptionAddedEvent | SubscriptionDeletedEvent>) =>
            !isAtPeoplePage(state) && signal.payload.subscription.type === "feed",
        peopleGeneralUnset
    )
];
