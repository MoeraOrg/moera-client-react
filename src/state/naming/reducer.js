import immutable from 'object-path-immutable';

import {
    NAMING_NAME_LOAD,
    NAMING_NAME_LOAD_FAILED,
    NAMING_NAME_LOADED,
    NAMING_NAME_PURGE,
    NAMING_NAME_USED
} from "state/naming/actions";
import { now } from "util/misc";

const initialState = {
    names: {}
};

const emptyDetails = {
    accessed: 0,
    loading: false,
    loaded: false,
    latest: false,
    nodeUri: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case NAMING_NAME_USED:
            if (state.names[action.payload.name]) {
                return immutable.set(state, ["names", action.payload.name, "accessed"], now());
            }
            return immutable.set(state, ["names", action.payload.name], {
                ...emptyDetails,
                accessed: now()
            });

        case NAMING_NAME_LOAD:
            return immutable.set(state, ["names", action.payload.name, "loading"], true);

        case NAMING_NAME_LOADED:
            return immutable.assign(state, ["names", action.payload.name], {
                accessed: now(),
                loading: false,
                loaded: true,
                latest: action.payload.latest,
                nodeUri: action.payload.nodeUri
            });

        case NAMING_NAME_LOAD_FAILED:
            return immutable.set(state, ["names", action.payload.name, "loading"], false);

        case NAMING_NAME_PURGE:
            return immutable.del(state, ["names", action.payload.name]);

        default:
            return state;
    }
}
