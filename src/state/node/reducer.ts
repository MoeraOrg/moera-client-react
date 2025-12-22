import cloneDeep from 'lodash.clonedeep';
import * as immutable from 'object-path-immutable';
import { getUnixTime } from 'date-fns';

import { ClientAction } from "state/action";
import { NodeState } from "state/node/state";
import { toWsUrl } from "util/url";

const initialState: NodeState = {
    introduced: false,
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
        changing: false
    },
    features: null,
    type: "regular"
};

export default (state: NodeState = initialState, action: ClientAction): NodeState => {
    switch (action.type) {
        case "OWNER_SWITCH": {
            if (action.payload.rootLocation == null) {
                return cloneDeep(initialState);
            }
            const location = action.payload.rootLocation.toLowerCase();
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
                },
                owner: {
                    ...cloneDeep(initialState.owner),
                    name: action.payload.nodeName
                }
            };
        }

        case "NODE_READY":
            return {
                ...state,
                introduced: true
            };

        case "OWNER_SET": {
            if (
                action.payload.rootLocation != null
                && action.payload.rootLocation.toLowerCase() !== state.root.location
            ) {
                return state;
            }

            const istate = immutable.wrap(state);
            if (state.owner.name !== action.payload.name) {
                istate
                    .assign("owner", initialState.owner)
                    .set("owner.name", action.payload.name);
            }
            if (action.payload.changing != null) {
                istate.set("owner.changing", action.payload.changing);
            }
            if (action.payload.type != null) {
                istate.set("type", action.payload.type);
            }
            return istate.value();
        }

        case "OWNER_VERIFIED":
            if (state.owner.name === action.payload.name) {
                return immutable.assign(state, "owner", {
                    correct: action.payload.correct,
                    verified: true,
                    verifiedAt: getUnixTime(new Date())
                });
            }
            return state;

        case "NODE_FEATURES_LOADED":
            if (state.owner.name === action.payload.nodeName) {
                return {
                    ...state,
                    features: action.payload.features
                };
            }
            return state;

        default:
            return state;
    }
}
