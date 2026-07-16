import { saga } from "state/saga";
import { Node, NodeName, SearchNodeInfo } from "api";
import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { errorThrown } from "state/error/actions";
import {
    ContactsLoadAction,
    VisitedContactsDeleteAction,
    VisitedContactsLoadAction,
    contactsLoaded,
    contactsLoadFailed,
    contactsNameFound,
    visitedContactsLoaded,
    visitedContactsLoadFailed
} from "state/contacts/actions";
import { getNameDetails } from "state/naming/sagas";
import { hasContactsName } from "state/contacts/selectors";
import { getSetting } from "state/settings/selectors";
import { getSafeSearchDefault } from "state/search/selectors";
import { REL_HOME, REL_SEARCH } from "util/rel-node-name";

export default [
    saga("CONTACTS_LOAD", payload => payload.query, contactsLoadSaga),
    saga("VISITED_CONTACTS_LOAD", payload => payload.query, visitedContactsLoadSaga),
    saga("VISITED_CONTACTS_DELETE", payload => payload.nodeName, visitedContactsDeleteSaga)
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

async function visitedContactsLoadSaga(action: WithContext<VisitedContactsLoadAction>): Promise<void> {
    const {query} = action.payload;

    try {
        const contacts: SearchNodeInfo[] = await Node.getVisitedNodes(action, REL_HOME, query, 4);
        dispatch(visitedContactsLoaded(query, contacts).causedBy(action));
    } catch {
        dispatch(visitedContactsLoadFailed(query).causedBy(action));
    }
}

async function visitedContactsDeleteSaga(action: WithContext<VisitedContactsDeleteAction>): Promise<void> {
    try {
        await Node.deleteVisitedNode(action, REL_HOME, action.payload.nodeName);
    } catch (e) {
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
