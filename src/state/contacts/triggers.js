import { trigger } from "state/trigger";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { CONTACTS_PREPARE, contactsLoad, contactsUnset } from "state/contacts/actions";
import { isContactsQueryToBeLoaded } from "state/contacts/selectors";
import { isConnectedToHome } from "state/home/selectors";

export default [
    trigger(
        CONTACTS_PREPARE,
        (state, signal) => isConnectedToHome(state) && isContactsQueryToBeLoaded(state, signal.payload.query),
        signal => contactsLoad(signal.payload.query)
    ),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], true, contactsUnset)
];
