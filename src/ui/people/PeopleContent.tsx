import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ContactWithRelationships } from "api";
import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import {
    getPeopleContactsByAlpha,
    getPeopleContactsByDistance,
    getPeopleContactsMaxInTabs,
    getPeopleContactsTotal,
    isPeopleContactsLoading
} from "state/people/selectors";
import * as Browser from "ui/browser";
import { Loading } from "ui/control";
import PeopleSelectionPanel from "ui/people/PeopleSelectionPanel";
import PeoplePerson from "ui/people/PeoplePerson";
import { nameListItemMatch } from "util/names-list";

export default function PeopleContent() {
    const atHome = useSelector(isAtHomeNode);
    const loadingGeneral = useSelector((state: ClientState) => state.people.loadingGeneral);
    const loadingContacts = useSelector(isPeopleContactsLoading);
    const contacts = useSelector(
        (state: ClientState) =>
            state.people.sortAlpha ? getPeopleContactsByAlpha(state) : getPeopleContactsByDistance(state)
    );
    const contactsTotal = useSelector(getPeopleContactsTotal);
    const contactsMax = useSelector(getPeopleContactsMaxInTabs);
    const searchRegexes = useSelector((state: ClientState) => state.people.searchRegexes);

    const found = useMemo(() =>
        contacts
            .filter(cs => matchesSearch(cs, searchRegexes))
            .map((cs, index) => <PeoplePerson key={index} contact={cs}/>),
        [contacts, searchRegexes]
    );

    return (
        <div className="flex-fill">
            {(atHome && !loadingGeneral && contactsTotal > 0 && (Browser.isDevMode() || contactsMax > 12)) &&
                <PeopleSelectionPanel/>
            }
            {found}
            {loadingContacts && <Loading/>}
        </div>
    );
}

function matchesSearch(contactState: ContactWithRelationships, searchRegexes: RegExp[]): boolean {
    const {nodeName, fullName} = contactState.contact;
    return nameListItemMatch({nodeName, fullName}, searchRegexes);
}
