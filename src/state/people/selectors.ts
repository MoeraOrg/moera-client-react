import { ClientState } from "state/state";
import { isPermitted } from "state/node/selectors";
import { ContactState } from "state/people/state";
import { SubscriberInfo, SubscriptionInfo } from "api/node/api-types";

export function isPeopleGeneralToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedGeneral && !state.people.loadingGeneral;
}

export function isAtSubscribersTab(state: ClientState): boolean {
    return state.people.tab === "subscribers";
}

export function isAtSubscriptionsTab(state: ClientState): boolean {
    return state.people.tab === "subscriptions";
}

export function isSubscribersToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedSubscribers && !state.people.loadingSubscribers;
}

export function isSubscriptionsToBeLoaded(state: ClientState): boolean {
    return !state.people.loadedSubscriptions && !state.people.loadingSubscriptions;
}

export function isSubscribersVisible(state: ClientState): boolean {
    return isPermitted("viewSubscribers", state.people, "public", state);
}

export function isSubscriptionsVisible(state: ClientState): boolean {
    return isPermitted("viewSubscriptions", state.people, "public", state);
}

export function isSubscribersTotalVisible(state: ClientState): boolean {
    return isPermitted("viewSubscribersTotal", state.people, "public", state);
}

export function isSubscriptionsTotalVisible(state: ClientState): boolean {
    return isPermitted("viewSubscriptionsTotal", state.people, "public", state);
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
