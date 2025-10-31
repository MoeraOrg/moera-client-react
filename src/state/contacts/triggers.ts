import { trigger } from "state/trigger";
import { contactsLoad, ContactsPrepareAction } from "state/contacts/actions";
import { isContactsQueryToBeLoaded } from "state/contacts/selectors";

export default [
    trigger(
        "CONTACTS_PREPARE",
        (state, signal: ContactsPrepareAction) => isContactsQueryToBeLoaded(state, signal.payload.query),
        signal => contactsLoad(signal.payload.query)
    )
];
