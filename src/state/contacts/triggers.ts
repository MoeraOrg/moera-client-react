import { trigger } from "state/trigger";
import { HOME_INTRODUCED } from "state/home/actions";
import { CONTACTS_PREPARE, contactsLoad, ContactsPrepareAction, contactsUnset } from "state/contacts/actions";
import { isContactsQueryToBeLoaded } from "state/contacts/selectors";
import { isConnectedToHome } from "state/home/selectors";

export default [
    trigger(
        CONTACTS_PREPARE,
        (state, signal: ContactsPrepareAction) =>
            isConnectedToHome(state) && isContactsQueryToBeLoaded(state, signal.payload.query),
        signal => contactsLoad(signal.payload.query)
    ),
    trigger(HOME_INTRODUCED, true, contactsUnset)
];
