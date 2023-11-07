import { call, put, select, spawn } from 'typed-redux-saga';

import { executor } from "state/executor";
import { Node, RegisteredName } from "api";
import { errorThrown } from "state/error/actions";
import { ContactsLoadAction, contactsLoaded, contactsLoadFailed, contactsNameFound } from "state/contacts/actions";
import { getNameDetails } from "state/naming/sagas";
import { hasContactsName } from "state/contacts/selectors";

export default [
    executor("CONTACTS_LOAD", payload => payload.query, contactsLoadSaga)
];

function* contactsLoadSaga(action: ContactsLoadAction) {
    const {query} = action.payload;
    try {
        yield* spawn(contactsFindName, query);
        const contact = yield* call(Node.getContacts, ":", query, 25);
        yield* put(contactsLoaded(query, contact));
    } catch (e) {
        yield* put(contactsLoadFailed(query));
        yield* put(errorThrown(e));
    }
}

function* contactsFindName(nodeName: string) {
    const hasName = yield* select(state => hasContactsName(state, nodeName));
    if (hasName) {
        return;
    }
    const registeredName = new RegisteredName(nodeName).format();
    const details = yield* call(getNameDetails, registeredName, true);
    if (details.loaded && details.nodeUri != null) {
        yield* put(contactsNameFound(details.nodeName ?? registeredName));
    }
}
