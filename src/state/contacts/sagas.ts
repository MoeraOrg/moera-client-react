import { executor } from "state/executor";
import { Node, NodeName } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import { ContactsLoadAction, contactsLoaded, contactsLoadFailed, contactsNameFound } from "state/contacts/actions";
import { getNameDetails } from "state/naming/sagas";
import { hasContactsName } from "state/contacts/selectors";
import { getSetting } from "state/settings/selectors";
import { getSafeSearchDefault } from "state/search/selectors";
import { REL_SEARCH } from "util/rel-node-name";

export default [
    executor("CONTACTS_LOAD", payload => payload.query, contactsLoadSaga)
];

async function contactsLoadSaga(action: WithContext<ContactsLoadAction>): Promise<void> {
    const {query} = action.payload;

    const sheriffName = select(state => getSetting(state, "search.sheriff-name") as string);
    const safeSearchDefault = select(getSafeSearchDefault);
    const sheriff = safeSearchDefault && sheriffName ? sheriffName : null;

    try {
        contactsFindName(action, query);
        const contact = await Node.searchNodeSuggestions(action, REL_SEARCH, query, sheriff, 25);
        dispatch(contactsLoaded(query, contact).causedBy(action));
    } catch (e) {
        dispatch(contactsLoadFailed(query).causedBy(action));
        dispatch(errorThrown(e));
    }
}

async function contactsFindName(action: ContactsLoadAction, nodeName: string): Promise<void> {
    const hasName = select(state => hasContactsName(state, nodeName));
    if (hasName) {
        return;
    }
    const registeredName = NodeName.expand(nodeName);
    const details = await getNameDetails(action, registeredName, true);
    if (details.loaded && details.nodeUri != null) {
        dispatch(contactsNameFound(details.nodeName ?? registeredName).causedBy(action));
    }
}
