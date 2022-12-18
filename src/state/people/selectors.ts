import { ClientState } from "state/state";
import { isPermitted } from "state/node/selectors";
import { ContactState, PeopleTab } from "state/people/state";
import { FriendInfo, FriendOfInfo, SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

export function isPeopleGeneralToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedGeneral && !state.people.loadingGeneral;
}

export function getPeopleTab(state: ClientState): PeopleTab {
    return state.people.tab;
}

export function isAtSubscribersTab(state: ClientState): boolean {
    return getPeopleTab(state) === "subscribers";
}

export function isAtSubscriptionsTab(state: ClientState): boolean {
    return getPeopleTab(state) === "subscriptions";
}

export function isAtFriendsTab(state: ClientState): boolean {
    return !isAtSubscribersTab(state) && !isAtSubscriptionsTab(state) && !isAtFriendOfsTab(state);
}

export function isAtFriendGroupTab(state: ClientState, id: string): boolean {
    return getPeopleTab(state) === id;
}

export function isAtFriendOfsTab(state: ClientState): boolean {
    return getPeopleTab(state) === "friend-ofs";
}

export function isSubscribersToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedSubscribers && !state.people.loadingSubscribers;
}

export function isSubscriptionsToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedSubscriptions && !state.people.loadingSubscriptions;
}

export function isFriendsToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedFriends && !state.people.loadingFriends;
}

export function isFriendOfsToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedFriendOfs && !state.people.loadingFriendOfs;
}

export function isSubscribersVisible(state: ClientState): boolean {
    return isPermitted("viewSubscribers", state.people, "public", state);
}

export function isSubscriptionsVisible(state: ClientState): boolean {
    return isPermitted("viewSubscriptions", state.people, "public", state);
}

export function isFriendsVisible(state: ClientState): boolean {
    return isPermitted("viewFriends", state.people, "public", state);
}

export function isFriendOfsVisible(state: ClientState): boolean {
    return isPermitted("viewFriendOfs", state.people, "public", state);
}

export function isSubscribersTotalVisible(state: ClientState): boolean {
    return isPermitted("viewSubscribersTotal", state.people, "public", state);
}

export function isSubscriptionsTotalVisible(state: ClientState): boolean {
    return isPermitted("viewSubscriptionsTotal", state.people, "public", state);
}

export function isFriendsTotalVisible(state: ClientState): boolean {
    return isPermitted("viewFriendsTotal", state.people, "public", state);
}

export function isFriendOfsTotalVisible(state: ClientState): boolean {
    return isPermitted("viewFriendOfsTotal", state.people, "public", state);
}

type SubscriberContactState = ContactState & { subscriber: SubscriberInfo };

export function getPeopleSubscribers(state: ClientState): SubscriberContactState[] {
    return Object.values(state.people.contacts)
        .filter((contact): contact is SubscriberContactState => contact?.subscriber != null);
}

type SubscriptionContactState = ContactState & { subscription: SubscriptionInfo };

export function getPeopleSubscriptions(state: ClientState): SubscriptionContactState[] {
    return Object.values(state.people.contacts)
        .filter((contact): contact is SubscriptionContactState => contact?.subscription != null);
}

type FriendContactState = ContactState & { friend: FriendInfo };

export function getPeopleFriends(state: ClientState, friendGroupId: string): FriendContactState[] {
    return Object.values(state.people.contacts)
        .filter((contact): contact is FriendContactState => contact?.friend != null
            && contact.friend.groups?.find(fg => fg.id === friendGroupId) != null);
}

type FriendOfContactState = ContactState & { friendOf: FriendOfInfo };

export function getPeopleFriendOfs(state: ClientState): FriendOfContactState[] {
    return Object.values(state.people.contacts)
        .filter((contact): contact is FriendOfContactState => contact?.friendOf != null);
}
