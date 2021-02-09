import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { NODE_CARD_LOAD, NODE_CARD_LOAD_FAILED, NODE_CARD_LOADED, NODE_CARD_PEOPLE_SET } from "state/nodecards/actions";

const initialState = {
};

const emptyCard = {
    fullName: null,
    subscribersTotal: null,
    subscriptionsTotal: null,
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
                return immutable.wrap(state)
                    .set([nodeName, "subscribersTotal"], subscribersTotal)
                    .set([nodeName, "subscriptionsTotal"], subscriptionsTotal)
                    .value();
            }
            return state;
        }

        default:
            return state;
    }
}
