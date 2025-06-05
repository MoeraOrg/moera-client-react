import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { ContactsState } from "state/contacts/state";
import { ClientAction } from "state/action";

const emptyQuery = {
    loading: false,
    loaded: false
}

const initialState = {
    queries: {},
    contacts: []
}

export default (state: ContactsState = initialState, action: ClientAction): ContactsState => {
    switch (action.type) {
        case "CONTACTS_LOAD":
            if (state.queries[action.payload.query]) {
                return immutable.set(state, ["queries", action.payload.query, "loading"], true);
            } else {
                return immutable.assign(
                    state,
                    ["queries", action.payload.query],
                    {...emptyQuery, loading: true}
                );
            }

        case "CONTACTS_LOADED": {
            const istate = immutable.wrap(state);
            istate.assign(["queries", action.payload.query], {loading: false, loaded: true});
            const names = new Set(action.payload.contacts.map(c => c.nodeName));
            istate.set("contacts", state.contacts.filter(c => !names.has(c.nodeName)).concat(action.payload.contacts));
            return istate.value();
        }

        case "CONTACTS_NAME_FOUND": {
            const {nodeName} = action.payload;
            const hasName = state.contacts.find(c => c.nodeName === nodeName) != null;
            if (!hasName) {
                return immutable.set(state, "contacts", [...state.contacts, {nodeName, distance: 3}]);
            }
            return state;
        }

        case "CONTACTS_LOAD_FAILED":
            return immutable.set(state, ["queries", action.payload.query, "loading"], false);

        case "CONTACTS_UNSET":
            return cloneDeep(initialState);

        default:
            return state;
    }
}
