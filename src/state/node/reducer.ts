import cloneDeep from 'lodash.clonedeep';
import * as immutable from 'object-path-immutable';
import { getUnixTime } from 'date-fns';

import { INIT_FROM_LOCATION } from "state/navigation/actions";
import {
    NODE_FEATURES_LOADED,
    OWNER_SET,
    OWNER_SWITCH,
    OWNER_SWITCH_CLOSE,
    OWNER_SWITCH_FAILED,
    OWNER_SWITCH_OPEN,
    OWNER_VERIFIED
} from "state/node/actions";
import { ClientAction } from "state/action";
import { NodeState } from "state/node/state";
import { toWsUrl } from "util/url";

const initialState = {
    root: {
        location: null,
        page: null,
        api: null,
        events: null
    },
    owner: {
        name: null,
        correct: false,
        verified: false,
        verifiedAt: 0,
        changing: false,
        showNavigator: false,
        switching: false
    },
    features: null
};

export default (state: NodeState = initialState, action: ClientAction): NodeState => {
    switch (action.type) {
        case INIT_FROM_LOCATION: {
            if (!action.payload.rootLocation) {
                return state;
            }

            const location = action.payload.rootLocation;
            const page = location + "/moera";
            const api = page + "/api";
            const events = toWsUrl(api + "/events");
            return {
                ...cloneDeep(initialState),
                root: {
                    location,
                    page,
                    api,
                    events
                }
            };
        }

        case OWNER_SET: {
            const istate = immutable.wrap(state);
            if (state.owner.name !== action.payload.name) {
                istate.assign("owner", initialState.owner)
                    .set("owner.name", action.payload.name);
            }
            if (action.payload.changing != null) {
                istate.set("owner.changing", action.payload.changing);
            }
            return istate.value();
        }

        case OWNER_VERIFIED:
            if (state.owner.name === action.payload.name) {
                return immutable.assign(state, "owner", {
                    correct: action.payload.correct,
                    verified: true,
                    verifiedAt: getUnixTime(new Date())
                });
            }
            return state;

        case OWNER_SWITCH_OPEN:
            return immutable.assign(state, "owner", {
                showNavigator: true,
                switching: false
            });

        case OWNER_SWITCH_CLOSE:
            return immutable.assign(state, "owner", {
                showNavigator: false,
                switching: false
            });

        case OWNER_SWITCH:
            return immutable.set(state, "owner.switching", true);

        case OWNER_SWITCH_FAILED:
            return immutable.set(state, "owner.switching", false);

        case NODE_FEATURES_LOADED:
            return {
                ...state,
                features: action.payload.features
            };

        default:
            return state;
    }
}
