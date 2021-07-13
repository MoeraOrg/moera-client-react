import * as immutable from 'object-path-immutable';
import cloneDeep from 'lodash.clonedeep';

import { CONTACTS_LOAD, CONTACTS_LOAD_FAILED, CONTACTS_LOADED, CONTACTS_UNSET } from "state/contacts/actions";
import { EVENT_HOME_REMOTE_NODE_AVATAR_CHANGED, EVENT_HOME_REMOTE_NODE_FULL_NAME_CHANGED } from "api/events/actions";
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
        case CONTACTS_LOAD:
            if (state.queries[action.payload.query]) {
                return immutable.set(state, ["queries", action.payload.query, "loading"], true);
            } else {
                return immutable.assign(state, ["queries", action.payload.query],
                    {...emptyQuery, loading: true});
            }

        case CONTACTS_LOADED: {
            const istate = immutable.wrap(state);
            istate.assign(["queries", action.payload.query], {loading: false, loaded: true});
            const names = new Set(action.payload.contacts.map(c => c.nodeName));
            istate.set("contacts", state.contacts.filter(c => !names.has(c.nodeName)).concat(action.payload.contacts));
            return istate.value();
        }

        case CONTACTS_LOAD_FAILED:
            return immutable.set(state, ["queries", action.payload.query, "loading"], false);

        case CONTACTS_UNSET:
            return cloneDeep(initialState);

        case EVENT_HOME_REMOTE_NODE_FULL_NAME_CHANGED: {
            const index = state.contacts.findIndex(c => c.nodeName === action.payload.name);
            if (index >= 0) {
                return immutable.update(state, ["contacts", index],
                        c => ({...c, fullName: action.payload.fullName})).value();
            }
            return state;
        }

        case EVENT_HOME_REMOTE_NODE_AVATAR_CHANGED: {
            const index = state.contacts.findIndex(c => c.nodeName === action.payload.name);
            if (index >= 0) {
                return immutable.update(state, ["contacts", index],
                    c => ({...c, avatar: cloneDeep(action.payload.avatar)})).value();
            }
            return state;
        }

        default:
            return state;
    }
}
