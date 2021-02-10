import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import {
    NODE_CARD_LOAD,
    NODE_CARD_LOAD_FAILED,
    NODE_CARD_LOADED,
    NODE_CARD_PEOPLE_SET,
    NODE_CARD_SUBSCRIPTION_SET,
    NODE_CARDS_UNSET
} from "state/nodecards/actions";
import {
    FEED_SUBSCRIBE,
    FEED_SUBSCRIBE_FAILED,
    FEED_SUBSCRIBED,
    FEED_UNSUBSCRIBE,
    FEED_UNSUBSCRIBE_FAILED,
    FEED_UNSUBSCRIBED
} from "state/feeds/actions";

const initialState = {
};

const emptyCard = {
    fullName: null,
    subscribersTotal: null,
    subscriptionsTotal: null,
    subscribed: null,
    subscribing: false,
    unsubscribing: false,
    subscriberId: null,
    loading: false,
    loaded: false
};

export default (state = initialState, action) => {
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

        case NODE_CARD_PEOPLE_SET: {
            const {nodeName, subscribersTotal, subscriptionsTotal} = action.payload;
            if (state[nodeName]) {
                return immutable.assign(state, [nodeName], {subscribersTotal, subscriptionsTotal});
            }
            return state;
        }

        case NODE_CARD_SUBSCRIPTION_SET: {
            const {nodeName, subscriberId} = action.payload;
            if (state[nodeName]) {
                return immutable.assign(state, [nodeName], {
                    subscribed: subscriberId != null,
                    subscriberId
                });
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
            const {nodeName, subscriberId} = action.payload;
            if (state[nodeName]) {
                return immutable.wrap(state)
                    .assign([nodeName], {
                        subscribing: false,
                        subscribed: true,
                        subscriberId
                    })
                    .update([nodeName, "subscribersTotal"], total => total + 1)
                    .value();
            }
            return state;
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
            if (state[nodeName]) {
                return immutable.wrap(state)
                    .assign([nodeName], {
                        unsubscribing: false,
                        subscribed: false,
                        subscriberId: null
                    })
                    .update([nodeName, "subscribersTotal"], total => total > 0 ? total - 1 : 0)
                    .value();
            }
            return state;
        }

        case FEED_UNSUBSCRIBE_FAILED: {
            const {nodeName} = action.payload;
            if (state[nodeName]) {
                return immutable.set(state, [nodeName, "unsubscribing"], false);
            }
            return state;
        }

        case NODE_CARDS_UNSET:
            return cloneDeep(initialState);

        default:
            return state;
    }
}
