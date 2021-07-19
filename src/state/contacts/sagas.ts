import { call, put } from 'typed-redux-saga/macro';

import { executor } from "state/executor";
import { Node } from "api";
import { errorThrown } from "state/error/actions";
import { CONTACTS_LOAD, ContactsLoadAction, contactsLoaded, contactsLoadFailed } from "state/contacts/actions";

export default [
    executor(CONTACTS_LOAD, payload => payload.query, contactsLoadSaga)
];

function* contactsLoadSaga(action: ContactsLoadAction) {
    const {query} = action.payload;
    try {
        const data = yield* call(Node.getContacts, ":", query, 25);
        yield* put(contactsLoaded(query, data));
    } catch (e) {
        yield* put(contactsLoadFailed(query));
        yield* put(errorThrown(e));
    }
}
