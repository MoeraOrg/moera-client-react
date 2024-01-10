import * as immutable from 'object-path-immutable';

import { NameState, NamingState } from "state/naming/state";
import { ClientAction } from "state/action";
import { now } from "util/misc";

const initialState: NamingState = {
    serverUrl: null,
    names: {}
};

const emptyDetails: NameState = {
    accessed: 0,
    updated: 0,
    loading: false,
    loaded: false,
    nodeUri: null
};

export default (state: NamingState = initialState, action: ClientAction) => {
    switch (action.type) {
        case "NAMING_NAMES_USED": {
            const {names} = action.payload;

            if (!names || names.length === 0) {
                return state;
            }

            const istate = immutable.wrap(state);
            for (const name of names) {
                if (!name) {
                    continue;
                }
                if (state.names[name]) {
                    istate.set(["names", name, "accessed"], now());
                } else {
                    istate.set(["names", name], {...emptyDetails, accessed: now()});
                }
            }
            return istate.value();
        }

        case "NAMING_NAME_LOAD":
            return immutable.set(state, ["names", action.payload.name, "loading"], true);

        case "NAMING_NAME_LOADED": {
            const istate = immutable.wrap(state);
            if (state.serverUrl == null) {
                istate.set("serverUrl", action.payload.serverUrl);
            } else if (state.serverUrl !== action.payload.serverUrl) {
                return state;
            }
            istate.assign(["names", action.payload.name], {
                accessed: now(),
                loading: false,
                loaded: true,
                nodeUri: action.payload.nodeUri,
                updated: action.payload.updated
            });
            return istate.value();
        }

        case "NAMING_NAME_LOAD_FAILED":
            return immutable.set(state, ["names", action.payload.name, "loading"], false);

        case "NAMING_NAMES_PURGE": {
            const {names} = action.payload;

            if (!names || names.length === 0) {
                return state;
            }

            const istate = immutable.wrap(state);
            names.forEach(name => istate.del(["names", name]));
            return istate.value();
        }

        case "NAMING_NAMES_POPULATE": {
            const istate = immutable.wrap(state);
            if (state.serverUrl == null) {
                istate.set("serverUrl", action.payload.serverUrl);
            } else if (state.serverUrl !== action.payload.serverUrl) {
                return state;
            }
            action.payload.names
                .filter(info => state.names[info.name] == null)
                .forEach(info => {
                    istate.set(["names", info.name], {
                        accessed: info.updated,
                        loading: false,
                        loaded: true,
                        nodeUri: info.nodeUri
                    })
                });
            return istate.value();
        }

        case "NAMING_NAMES_SWITCH_SERVER":
            if (state.serverUrl === action.payload.serverUrl) {
                return state;
            }
            return immutable.assign(state, "", {
                serverUrl: action.payload.serverUrl,
                names: {}
            });

        default:
            return state;
    }
}
