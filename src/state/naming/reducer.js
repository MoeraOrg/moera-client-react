import * as immutable from 'object-path-immutable';

import {
    NAMING_NAME_LOAD,
    NAMING_NAME_LOAD_FAILED,
    NAMING_NAME_LOADED,
    NAMING_NAMES_POPULATE,
    NAMING_NAMES_PURGE,
    NAMING_NAMES_USED
} from "state/naming/actions";
import { now } from "util/misc";

const initialState = {
    names: {}
};

const emptyDetails = {
    accessed: 0,
    loading: false,
    loaded: false,
    nodeUri: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case NAMING_NAMES_USED: {
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

        case NAMING_NAME_LOAD:
            return immutable.set(state, ["names", action.payload.name, "loading"], true);

        case NAMING_NAME_LOADED:
            return immutable.assign(state, ["names", action.payload.name], {
                accessed: now(),
                loading: false,
                loaded: true,
                nodeUri: action.payload.nodeUri,
                updated: action.payload.updated
            });

        case NAMING_NAME_LOAD_FAILED:
            return immutable.set(state, ["names", action.payload.name, "loading"], false);

        case NAMING_NAMES_PURGE: {
            const {names} = action.payload;

            if (!names || names.length === 0) {
                return state;
            }

            const istate = immutable.wrap(state);
            names.forEach(name => istate.del(state, ["names", name]));
            return istate.value();
        }

        case NAMING_NAMES_POPULATE: {
            const istate = immutable.wrap(state);
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

        default:
            return state;
    }
}
