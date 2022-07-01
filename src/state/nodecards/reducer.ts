import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import {
    NODE_CARD_DETAILS_SET,
    NODE_CARD_LOAD,
    NODE_CARD_LOAD_FAILED,
    NODE_CARD_LOADED,
    NODE_CARD_PEOPLE_SET,
    NODE_CARD_STORIES_SET,
    NODE_CARD_SUBSCRIBER_SET,
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

const initialState = {
};

const emptyCard: NodeCardState = {
    fullName: null,
    gender: null,
    title: null,
    avatar: null,
    fundraisers: null,
    storiesTotal: null,
    lastStoryCreatedAt: null,
    subscribersTotal: null,
    subscriptionsTotal: null,
    subscribing: false,
    unsubscribing: false,
    loading: false,
    loaded: false,
    subscriber: null,
    subscription: null
};

export default (state: NodeCardsState = initialState, action: WithContext<ClientAction>): NodeCardsState => {
    switch (action.type) {
        case NODE_CARD_LOAD: {
            const {nodeName} = action.payload;
            const istate = immutable.wrap(state);
            if (!state[nodeName]) {
                istate.set([nodeName], cloneDeep(emptyCard));
            }
            return istate.set([nodeName, "loading"], true)
                .value();
        }

        case NODE_CARD_LOADED: {
            const {nodeName} = action.payload;
            if (state[nodeName]) {
                return immutable.wrap(state)
                    .set([nodeName, "loading"], false)
                    .set([nodeName, "loaded"], true)
                    .value();
            }
            return state;
        }

        case NODE_CARD_LOAD_FAILED: {
            const {nodeName} = action.payload;
            if (state[nodeName]) {
                return immutable.set(state, [nodeName, "loading"], false);
            }
            return state;
        }

        case NODE_CARD_DETAILS_SET: {
            const {nodeName, fullName, gender, title, avatar, fundraisers} = action.payload;
            if (state[nodeName]) {
                const istate = immutable.wrap(state);
                istate.assign([nodeName], {fullName, gender, title, fundraisers});
                if (avatar != null) {
                    istate.set([nodeName, "avatar"], avatar);
                }
                return istate.value();
            }
            return state;
        }

        case NODE_CARD_STORIES_SET: {
            const {nodeName, storiesTotal, lastStoryCreatedAt} = action.payload;
            if (state[nodeName]) {
                return immutable.assign(state, [nodeName], {storiesTotal, lastStoryCreatedAt});
            }
            return state;
        }

        case NODE_CARD_PEOPLE_SET: {
            const {nodeName, subscribersTotal, subscriptionsTotal} = action.payload;
            if (state[nodeName]) {
                return immutable.assign(state, [nodeName], {subscribersTotal, subscriptionsTotal});
            }
            return state;
        }

        case NODE_CARD_SUBSCRIBER_SET: {
            const {nodeName, subscriber} = action.payload;
            if (state[nodeName]) {
                return immutable.set(state, [nodeName, "subscriber"], subscriber);
            }
            return state;
        }

        case NODE_CARD_SUBSCRIPTION_SET: {
            const {nodeName, subscription} = action.payload;
            if (state[nodeName]) {
                return immutable.set(state, [nodeName, "subscription"], subscription);
            }
            return state;
        }

        case FEED_SUBSCRIBE: {
            const {nodeName} = action.payload;
            if (state[nodeName]) {
                return immutable.set(state, [nodeName, "subscribing"], true);
            }
            return state;
        }

        case FEED_SUBSCRIBED: {
            const {nodeName, subscription} = action.payload;
            const {ownerName} = action.context;
            const istate = immutable.wrap(state);
            if (state[nodeName]) {
                istate.assign([nodeName], {
                    subscribing: false,
                    subscription
                });
                if (nodeName !== ownerName) {
                    istate.update([nodeName, "subscribersTotal"], total => total + 1);
                }
            }
            return istate.value();
        }

        case FEED_SUBSCRIBE_FAILED: {
            const {nodeName} = action.payload;
            if (state[nodeName]) {
                return immutable.set(state, [nodeName, "subscribing"], false);
            }
            return state;
        }

        case FEED_UNSUBSCRIBE: {
            const {nodeName} = action.payload;
            if (state[nodeName]) {
                return immutable.set(state, [nodeName, "unsubscribing"], true);
            }
            return state;
        }

        case FEED_UNSUBSCRIBED: {
            const {nodeName} = action.payload;
            const {ownerName} = action.context;
            const istate = immutable.wrap(state);
            if (state[nodeName]) {
                istate.assign([nodeName], {
                    unsubscribing: false,
                    subscription: null
                });
                if (nodeName !== ownerName) {
                    istate.update([nodeName, "subscribersTotal"], total => total > 0 ? total - 1 : 0);
                }
            }
            return istate.value();
        }

        case FEED_UNSUBSCRIBE_FAILED: {
            const {nodeName} = action.payload;
            if (state[nodeName]) {
                return immutable.set(state, [nodeName, "unsubscribing"], false);
            }
            return state;
        }

        case FEED_SUBSCRIBER_UPDATED: {
            const {nodeName, subscriber} = action.payload;
            const {homeOwnerName} = action.context;
            if (nodeName === homeOwnerName && state[subscriber.nodeName]) {
                return immutable.set(state, [subscriber.nodeName, "subscriber"], subscriber);
            }
            return state;
        }

        case FEED_SUBSCRIPTION_UPDATED: {
            const {nodeName, subscription} = action.payload;
            const {homeOwnerName} = action.context;
            if (nodeName === homeOwnerName && state[subscription.remoteNodeName]) {
                return immutable.set(state, [subscription.remoteNodeName, "subscription"], subscription);
            }
            return state;
        }

        case NODE_CARDS_UNSET:
            return cloneDeep(initialState);

        case EVENT_HOME_REMOTE_NODE_FULL_NAME_CHANGED: {
            const {name, fullName} = action.payload;
            if (state[name]) {
                return immutable.set(state, [name], fullName);
            }
            return state;
        }

        case EVENT_HOME_REMOTE_NODE_AVATAR_CHANGED: {
            const {name, avatar} = action.payload;
            if (state[name]) {
                return immutable.set(state, [name], cloneDeep(avatar));
            }
            return state;
        }

        case EVENT_NODE_SUBSCRIBERS_TOTAL_CHANGED: {
            const {feedSubscribersTotal} = action.payload;
            const {ownerName} = action.context;
            if (ownerName != null && state[ownerName]) {
                return immutable.set(state, [ownerName, "subscribersTotal"], feedSubscribersTotal);
            }
            return state;
        }

        case EVENT_NODE_SUBSCRIPTIONS_TOTAL_CHANGED: {
            const {feedSubscriptionsTotal} = action.payload;
            const {ownerName} = action.context;
            if (ownerName != null && state[ownerName]) {
                return immutable.set(state, [ownerName, "subscriptionsTotal"], feedSubscriptionsTotal);
            }
            return state;
        }

        case EVENT_HOME_SUBSCRIBERS_TOTAL_CHANGED: {
            const {feedSubscribersTotal} = action.payload;
            const {homeOwnerName} = action.context;
            if (homeOwnerName != null && state[homeOwnerName]) {
                return immutable.set(state, [homeOwnerName, "subscribersTotal"], feedSubscribersTotal);
            }
            return state;
        }

        case EVENT_HOME_SUBSCRIPTIONS_TOTAL_CHANGED: {
            const {feedSubscriptionsTotal} = action.payload;
            const {homeOwnerName} = action.context;
            if (homeOwnerName != null && state[homeOwnerName]) {
                return immutable.set(state, [homeOwnerName, "subscriptionsTotal"], feedSubscriptionsTotal);
            }
            return state;
        }

        case EVENT_HOME_SUBSCRIBER_ADDED: {
            const {subscriber} = action.payload;
            if (state[subscriber.nodeName]) {
                return immutable.set(state, [subscriber.nodeName, "subscriber"], subscriber);
            }
            return state;
        }

        case EVENT_HOME_SUBSCRIBER_DELETED: {
            const {subscriber} = action.payload;
            if (state[subscriber.nodeName]) {
                return immutable.set(state, [subscriber.nodeName, "subscriber"], null);
            }
            return state;
        }

        case EVENT_HOME_SUBSCRIPTION_ADDED: {
            const {subscription} = action.payload;
            if (state[subscription.remoteNodeName]) {
                return immutable.assign(state, [subscription.remoteNodeName], {
                    subscribing: false,
                    subscription
                });
            }
            return state;
        }

        case EVENT_HOME_SUBSCRIPTION_DELETED: {
            const {subscription} = action.payload;
            if (state[subscription.remoteNodeName]) {
                return immutable.assign(state, [subscription.remoteNodeName], {
                    unsubscribing: false,
                    subscription: null
                });
            }
            return state;
        }

        default:
            return state;
    }
}
