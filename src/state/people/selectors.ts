import { createSelector } from 'reselect';

import { ClientState } from "state/state";
import { isPermitted } from "state/node/selectors";
import { ContactState, PeopleTab } from "state/people/state";
import {
    BlockedByUserInfo,
    BlockedUserInfo,
    ContactInfo,
    FriendInfo,
    FriendOfInfo,
    SubscriberInfo,
    SubscriptionInfo
} from "api";

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

export function isAtBlockedTab(state: ClientState): boolean {
    return getPeopleTab(state) === "blocked";
}

export function isAtBlockedByTab(state: ClientState): boolean {
    return getPeopleTab(state) === "blocked-by";
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

export function isBlockedToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedBlocked && !state.people.loadingBlocked;
}

export function isBlockedByToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedBlockedBy && !state.people.loadingBlockedBy;
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

export function isBlockedVisible(state: ClientState): boolean {
    return isPermitted("viewBlocked", state.people, "public", state);
}

export function isBlockedByVisible(state: ClientState): boolean {
    return isPermitted("viewBlockedBy", state.people, "public", state);
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

type BlockedContactState = ContactState & { blocked: BlockedUserInfo[] };

export function getPeopleBlocked(state: ClientState): BlockedContactState[] {
    return Object.values(state.people.contacts)
        .filter((contact): contact is BlockedContactState => contact?.blocked != null && contact.blocked.length > 0);
}

type BlockedByContactState = ContactState & { blockedBy: BlockedByUserInfo[] };

export function getPeopleBlockedBy(state: ClientState): BlockedByContactState[] {
    return Object.values(state.people.contacts)
        .filter((contact): contact is BlockedByContactState =>
            contact?.blockedBy != null && contact.blockedBy.length > 0);
}

export function isPeopleContactsLoading(state: ClientState): boolean {
    switch (getPeopleTab(state)) {
        case "subscribers":
            return state.people.loadingSubscribers;
        case "subscriptions":
            return state.people.loadingSubscriptions;
        case "friend-ofs":
            return state.people.loadingFriendOfs;
        case "blocked":
            return state.people.loadingBlocked;
        case "blocked-by":
            return state.people.loadingBlockedBy;
        default:
            return state.people.loadingFriends;
    }
}

export function getPeopleContacts(state: ClientState): ContactState[] {
    const tab = getPeopleTab(state);
    switch (tab) {
        case "subscribers":
            return getPeopleSubscribers(state);
        case "subscriptions":
            return getPeopleSubscriptions(state);
        case "friend-ofs":
            return getPeopleFriendOfs(state);
        case "blocked":
            return getPeopleBlocked(state);
        case "blocked-by":
            return getPeopleBlockedBy(state);
        default:
            return getPeopleFriends(state, tab);
    }
}

export const getPeopleContactsByCloseness = createSelector(
    getPeopleContacts,
    contacts =>
        contacts.sort((sr1, sr2) => sr2.contact.closeness - sr1.contact.closeness)
);

export const getPeopleContactsByAlpha = createSelector(
    getPeopleContacts,
    contacts =>
        contacts.sort((sr1, sr2) => {
            const sr1name = sr1.contact.fullName || sr1.contact.nodeName;
            const sr2name = sr2.contact.fullName || sr2.contact.nodeName;
            return sr1name.localeCompare(sr2name);
        })
);

const getPeopleFriendsTotal = createSelector(
    (state: ClientState) => state.people.friendsTotal,
    friendsTotal => friendsTotal != null
        ? Object.values(friendsTotal).reduce((max = 0, v = 0) => v > max ? v : max, 0) ?? 0
        : 0
);

export function getPeopleContactsTotal(state: ClientState) {
    return (state.people.subscribersTotal ?? 0)
        + (state.people.subscriptionsTotal ?? 0)
        + getPeopleFriendsTotal(state)
        + (state.people.friendOfsTotal ?? 0)
        + (state.people.blockedTotal ?? 0)
        + (state.people.blockedByTotal ?? 0);
}

export function getPeopleContactsMaxInTabs(state: ClientState) {
    return Math.max(
        state.people.subscribersTotal ?? 0,
        state.people.subscriptionsTotal ?? 0,
        getPeopleFriendsTotal(state),
        state.people.friendOfsTotal ?? 0,
        state.people.blockedTotal ?? 0,
        state.people.blockedByTotal ?? 0
    );
}

export function getPeopleSelectedContacts(state: ClientState): ContactInfo[] {
    return Object.entries(state.people.selected)
        .filter(([, selected]) => selected)
        .map(([nodeName]) => state.people.contacts[nodeName])
        .filter((cs): cs is ContactState => cs != null)
        .map(cs => cs.contact);
}
