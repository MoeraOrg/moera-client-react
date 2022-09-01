import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import {
    NODE_CARD_DETAILS_LOAD,
    NODE_CARD_DETAILS_LOAD_FAILED,
    NODE_CARD_DETAILS_SET,
    NODE_CARD_PEOPLE_LOAD,
    NODE_CARD_PEOPLE_LOAD_FAILED,
    NODE_CARD_PEOPLE_SET,
    NODE_CARD_STORIES_LOAD,
    NODE_CARD_STORIES_LOAD_FAILED,
    NODE_CARD_STORIES_SET,
    NODE_CARD_SUBSCRIPTION_LOAD,
    NODE_CARD_SUBSCRIPTION_LOAD_FAILED,
    NODE_CARD_SUBSCRIPTION_SET,
    NODE_CARDS_UNSET
} from "state/nodecards/actions";
import {
    FEED_SUBSCRIBE,
    FEED_SUBSCRIBE_FAILED,
    FEED_SUBSCRIBED,
    FEED_SUBSCRIBER_UPDATED,
    FEED_SUBSCRIPTION_UPDATED,
    FEED_UNSUBSCRIBE,
    FEED_UNSUBSCRIBE_FAILED,
    FEED_UNSUBSCRIBED
} from "state/feeds/actions";
import {
    EVENT_HOME_REMOTE_NODE_AVATAR_CHANGED,
    EVENT_HOME_REMOTE_NODE_FULL_NAME_CHANGED,
    EVENT_HOME_SUBSCRIBER_ADDED,
    EVENT_HOME_SUBSCRIBER_DELETED,
    EVENT_HOME_SUBSCRIBERS_TOTAL_CHANGED,
    EVENT_HOME_SUBSCRIPTION_ADDED,
    EVENT_HOME_SUBSCRIPTION_DELETED,
    EVENT_HOME_SUBSCRIPTIONS_TOTAL_CHANGED,
    EVENT_NODE_SUBSCRIBERS_TOTAL_CHANGED,
    EVENT_NODE_SUBSCRIPTIONS_TOTAL_CHANGED
} from "api/events/actions";
import { NodeCardsState, NodeCardState } from "state/nodecards/state";
import { ClientAction } from "state/action";
import { WithContext } from "state/action-types";
import { OWNER_SET } from "state/node/actions";
import { HOME_OWNER_SET } from "state/home/actions";

const emptyProfileInfo = {
    fullName: null,
    gender: null,
    email: null,
    title: null,
    bioHtml: null,
    avatar: null,
    fundraisers: [],
    operations: null
};

const emptyCard: NodeCardState = {
    details: {
        loaded: false,
        loading: false,
        profile: emptyProfileInfo
    },
    stories: {
        loaded: false,
        loading: false,
        storiesTotal: null,
        lastStoryCreatedAt: null
    },
    people: {
        loaded: false,
        loading: false,
        subscribersTotal: null,
        subscriptionsTotal: null
    },
    subscription: {
        loaded: false,
        loading: false,
        subscribing: false,
        unsubscribing: false,
        subscriber: null,
        subscription: null
    }
};

const initialState: NodeCardsState = {
};

function getCard(state: NodeCardsState, nodeName: string): {istate: WrappedObject<NodeCardsState>, card: NodeCardState} {
    const istate = immutable.wrap(state);
    let card = state[nodeName];
    if (card == null) {
        card = cloneDeep(emptyCard);
        istate.set([nodeName], card);
    }
    return {istate, card};
}

function migrateCard(target: WrappedObject<NodeCardsState>, targetNodeName: string, source: NodeCardState): void {
    target.assign([targetNodeName, "details"], {
        loaded: source.details.loaded,
        profile: cloneDeep(source.details.profile)
    });
    target.assign([targetNodeName, "stories"], {
        loaded: source.stories.loaded,
        storiesTotal: source.stories.storiesTotal,
        lastStoryCreatedAt: source.stories.lastStoryCreatedAt
    });
    target.assign([targetNodeName, "people"], {
        loaded: source.people.loaded,
        subscribersTotal: source.people.subscribersTotal,
        subscriptionsTotal: source.people.subscriptionsTotal
    });
}

export default (state: NodeCardsState = initialState, action: WithContext<ClientAction>): NodeCardsState => {
    switch (action.type) {
        case NODE_CARD_DETAILS_LOAD: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "details", "loading"], true)
                .value();
        }

        case NODE_CARD_DETAILS_LOAD_FAILED: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "details", "loading"], false)
                .value();
        }

        case NODE_CARD_DETAILS_SET: {
            const {nodeName, profile} = action.payload;
            return getCard(state, nodeName).istate
                .assign([nodeName, "details"], {
                    loading: false,
                    loaded: true,
                    profile: {
                        ...cloneDeep(emptyProfileInfo),
                        ...cloneDeep(profile)
                    }
                })
                .value();
        }

        case OWNER_SET: {
            let {name, fullName, gender, title, avatar} = action.payload;
            const {ownerNameOrUrl} = action.context;

            name = name ?? ownerNameOrUrl;
            const istate = getCard(state, name).istate;
            const urlCard = getCard(state, ownerNameOrUrl).card;
            migrateCard(istate, name, urlCard);
            if (fullName !== false) {
                istate.set([name, "details", "profile", "fullName"], action.payload.fullName);
            }
            if (gender !== false) {
                istate.set([name, "details", "profile", "gender"], action.payload.gender);
            }
            if (title !== false) {
                istate.set([name, "details", "profile", "title"], action.payload.title);
            }
            if (avatar != null) {
                istate.set([name, "details", "profile", "avatar"], action.payload.avatar);
            }
            return istate.value();
        }

        case HOME_OWNER_SET: {
            let {name, fullName, avatar} = action.payload;
            const {homeOwnerNameOrUrl} = action.context;

            name = name ?? homeOwnerNameOrUrl;
            const istate = getCard(state, name).istate;
            const urlCard = getCard(state, homeOwnerNameOrUrl).card;
            migrateCard(istate, name, urlCard);
            istate.assign([name, "details", "profile"], {
                fullName,
                avatar
            });
            return istate.value();
        }

        case NODE_CARD_STORIES_LOAD: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "stories", "loading"], true)
                .value();
        }

        case NODE_CARD_STORIES_LOAD_FAILED: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "stories", "loading"], false)
                .value();
        }

        case NODE_CARD_STORIES_SET: {
            const {nodeName, storiesTotal, lastStoryCreatedAt} = action.payload;
            return getCard(state, nodeName).istate
                .assign([nodeName, "stories"], {
                    loading: false,
                    loaded: true,
                    storiesTotal,
                    lastStoryCreatedAt
                })
                .value();
        }

        case NODE_CARD_PEOPLE_LOAD: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "people", "loading"], true)
                .value();
        }

        case NODE_CARD_PEOPLE_LOAD_FAILED: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "people", "loading"], false)
                .value();
        }

        case NODE_CARD_PEOPLE_SET: {
            const {nodeName, subscribersTotal, subscriptionsTotal} = action.payload;
            return getCard(state, nodeName).istate
                .assign([nodeName, "people"], {
                    loading: false,
                    loaded: true,
                    subscribersTotal,
                    subscriptionsTotal
                })
                .value();
        }

        case NODE_CARD_SUBSCRIPTION_LOAD: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "subscription", "loading"], true)
                .value();
        }

        case NODE_CARD_SUBSCRIPTION_LOAD_FAILED: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "subscription", "loading"], false)
                .value();
        }

        case NODE_CARD_SUBSCRIPTION_SET: {
            const {nodeName, subscriber, subscription} = action.payload;
            return getCard(state, nodeName).istate
                .assign([nodeName, "subscription"], {
                    loading: false,
                    loaded: true,
                    subscriber,
                    subscription
                })
                .value();
        }

        case FEED_SUBSCRIBE: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "subscription", "subscribing"], true)
                .value();
        }

        case FEED_SUBSCRIBED: {
            const {nodeName, subscription} = action.payload;
            const {ownerName} = action.context;
            const istate = getCard(state, nodeName).istate;
            istate.assign([nodeName, "subscription"], {
                subscribing: false,
                subscription
            });
            if (nodeName !== ownerName) {
                istate.update([nodeName, "people.subscribersTotal"], total => total + 1);
            }
            return istate.value();
        }

        case FEED_SUBSCRIBE_FAILED: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "subscription", "subscribing"], false)
                .value();
        }

        case FEED_UNSUBSCRIBE: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "subscription", "unsubscribing"], false)
                .value();
        }

        case FEED_UNSUBSCRIBED: {
            const {nodeName} = action.payload;
            const {ownerName} = action.context;
            const istate = getCard(state, nodeName).istate;
            istate.assign([nodeName, "subscription"], {
                unsubscribing: false,
                subscription: null
            });
            if (nodeName !== ownerName) {
                istate.update([nodeName, "people.subscribersTotal"], total => total > 0 ? total - 1 : 0);
            }
            return istate.value();
        }

        case FEED_UNSUBSCRIBE_FAILED: {
            const {nodeName} = action.payload;
            return getCard(state, nodeName).istate
                .set([nodeName, "subscription", "unsubscribing"], false)
                .value();
        }

        case FEED_SUBSCRIBER_UPDATED: {
            const {nodeName, subscriber} = action.payload;
            const {homeOwnerName} = action.context;
            const istate = getCard(state, subscriber.nodeName).istate;
            if (nodeName === homeOwnerName) {
                istate.set([subscriber.nodeName, "subscription", "subscriber"], subscriber);
            }
            return istate.value();
        }

        case FEED_SUBSCRIPTION_UPDATED: {
            const {nodeName, subscription} = action.payload;
            const {homeOwnerName} = action.context;
            const istate = getCard(state, subscription.remoteNodeName).istate;
            if (nodeName === homeOwnerName) {
                istate.set([subscription.remoteNodeName, "subscription", "subscription"], subscription);
            }
            return istate.value();
        }

        case NODE_CARDS_UNSET:
            return cloneDeep(initialState);

        case EVENT_HOME_REMOTE_NODE_FULL_NAME_CHANGED: {
            const {name, fullName} = action.payload;
            return getCard(state, name).istate
                .set([name, "details.profile.fullName"], fullName)
                .value();
        }

        case EVENT_HOME_REMOTE_NODE_AVATAR_CHANGED: {
            const {name, avatar} = action.payload;
            return getCard(state, name).istate
                .set([name, "details.profile.avatar"], cloneDeep(avatar))
                .value();
        }

        case EVENT_NODE_SUBSCRIBERS_TOTAL_CHANGED: {
            const {feedSubscribersTotal} = action.payload;
            const {ownerName} = action.context;
            if (ownerName != null) {
                return getCard(state, ownerName).istate
                    .set([ownerName, "people.subscribersTotal"], feedSubscribersTotal)
                    .value();
            }
            return state;
        }

        case EVENT_NODE_SUBSCRIPTIONS_TOTAL_CHANGED: {
            const {feedSubscriptionsTotal} = action.payload;
            const {ownerName} = action.context;
            if (ownerName != null) {
                return getCard(state, ownerName).istate
                    .set([ownerName, "people.subscriptionsTotal"], feedSubscriptionsTotal)
                    .value();
            }
            return state;
        }

        case EVENT_HOME_SUBSCRIBERS_TOTAL_CHANGED: {
            const {feedSubscribersTotal} = action.payload;
            const {homeOwnerName} = action.context;
            if (homeOwnerName != null) {
                return getCard(state, homeOwnerName).istate
                    .set([homeOwnerName, "people.subscribersTotal"], feedSubscribersTotal)
                    .value();
            }
            return state;
        }

        case EVENT_HOME_SUBSCRIPTIONS_TOTAL_CHANGED: {
            const {feedSubscriptionsTotal} = action.payload;
            const {homeOwnerName} = action.context;
            if (homeOwnerName != null) {
                return getCard(state, homeOwnerName).istate
                    .set([homeOwnerName, "people.subscriptionsTotal"], feedSubscriptionsTotal)
                    .value();
            }
            return state;
        }

        case EVENT_HOME_SUBSCRIBER_ADDED: {
            const {subscriber} = action.payload;
            return getCard(state, subscriber.nodeName).istate
                .set([subscriber.nodeName, "subscription", "subscriber"], subscriber)
                .value();
        }

        case EVENT_HOME_SUBSCRIBER_DELETED: {
            const {subscriber} = action.payload;
            return getCard(state, subscriber.nodeName).istate
                .set([subscriber.nodeName, "subscription", "subscriber"], null)
                .value();
        }

        case EVENT_HOME_SUBSCRIPTION_ADDED: {
            const {subscription} = action.payload;
            return getCard(state, subscription.remoteNodeName).istate
                .assign([subscription.remoteNodeName, "subscription"], {
                    subscribing: false,
                    subscription
                })
                .value();
        }

        case EVENT_HOME_SUBSCRIPTION_DELETED: {
            const {subscription} = action.payload;
            return getCard(state, subscription.remoteNodeName).istate
                .assign([subscription.remoteNodeName, "subscription"], {
                    unsubscribing: false,
                    subscription: null
                })
                .value();
        }

        default:
            return state;
    }
}
