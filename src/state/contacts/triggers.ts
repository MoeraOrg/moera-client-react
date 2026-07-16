import { trigger } from "state/trigger";
import { isConnectedToHome } from "state/home/selectors";
import {
    contactsLoad,
    ContactsPrepareAction,
    visitedContactsLoad,
    VisitedContactsPrepareAction
} from "state/contacts/actions";
import { isContactsQueryToBeLoaded, isVisitedContactsQueryToBeLoaded } from "state/contacts/selectors";

export default [
    trigger(
        "CONTACTS_PREPARE",
        (state, signal: ContactsPrepareAction) => isContactsQueryToBeLoaded(state, signal.payload.query),
        signal => contactsLoad(signal.payload.query)
    ),
    trigger(
        "VISITED_CONTACTS_PREPARE",
        (state, signal: VisitedContactsPrepareAction) =>
            isConnectedToHome(state) && isVisitedContactsQueryToBeLoaded(state, signal.payload.query),
        signal => visitedContactsLoad(signal.payload.query)
    )
];
