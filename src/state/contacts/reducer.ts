import * as immutable from 'object-path-immutable';

import { SearchNodeInfo } from "api";
import { ContactsQueryState, ContactsState } from "state/contacts/state";
import { ClientAction } from "state/action";

const emptyQuery: ContactsQueryState = {
    loading: false,
    loaded: false
}

const initialState: ContactsState = {
    queries: {},
    visitedQueries: {},
    contacts: [],
    visitedContacts: []
}

function updateNameInfo(
    contacts: SearchNodeInfo[],
    name: string,
    fullName: string | null | undefined,
    title: string | null | undefined
): SearchNodeInfo[] {
    const index = contacts.findIndex(c => c.nodeName === name);
    if (index < 0) {
        return contacts;
    }
    return immutable.assign(contacts, [index], {fullName, title});
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

        case "CONTACTS_LOAD_FAILED":
            return immutable.set(state, ["queries", action.payload.query, "loading"], false);

        case "VISITED_CONTACTS_LOAD":
            if (state.visitedQueries[action.payload.query]) {
                return immutable.set(state, ["visitedQueries", action.payload.query, "loading"], true);
            } else {
                return immutable.assign(
                    state,
                    ["visitedQueries", action.payload.query],
                    {...emptyQuery, loading: true}
                );
            }

        case "VISITED_CONTACTS_LOADED": {
            const istate = immutable.wrap(state);
            istate.assign(["visitedQueries", action.payload.query], {loading: false, loaded: true});
            const names = new Set(action.payload.contacts.map(c => c.nodeName));
            istate.set(
                "visitedContacts",
                state.visitedContacts.filter(c => !names.has(c.nodeName)).concat(action.payload.contacts)
            );
            return istate.value();
        }

        case "VISITED_CONTACTS_LOAD_FAILED":
            return immutable.set(state, ["visitedQueries", action.payload.query, "loading"], false);

        case "VISITED_CONTACTS_DELETE":
            return immutable.set(
                state,
                "visitedContacts",
                state.visitedContacts.filter(c => c.nodeName !== action.payload.nodeName)
            );

        case "CONTACTS_NAME_FOUND": {
            const {nodeName} = action.payload;
            const hasName =
                state.contacts.find(c => c.nodeName === nodeName) != null
                || state.visitedContacts.find(c => c.nodeName === nodeName) != null;
            if (!hasName) {
                return immutable.set(state, "contacts", [...state.contacts, {nodeName, distance: 3}]);
            }
            return state;
        }

        case "EVENT_HOME_REMOTE_NODE_FULL_NAME_CHANGED": {
            const {name, fullName, title} = action.payload;
            const contacts = updateNameInfo(state.contacts, name, fullName, title);
            const visitedContacts = updateNameInfo(state.visitedContacts, name, fullName, title);
            return contacts !== state.contacts || visitedContacts !== state.visitedContacts
                ? {...state, contacts, visitedContacts}
                : state;
        }

        default:
            return state;
    }
}
