import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ContactWithRelationships } from "api";
import { ClientState } from "state/state";
import { getPeopleContactsByAlpha, getPeopleContactsByDistance, isPeopleContactsLoading } from "state/people/selectors";
import { Loading } from "ui/control";
import PeoplePerson from "ui/people/PeoplePerson";
import { nameListItemMatch } from "util/names-list";
import "./PeopleContent.css";

export default function PeopleContent() {
    const loadingContacts = useSelector(isPeopleContactsLoading);
    const contacts = useSelector(
        (state: ClientState) =>
            state.people.sortAlpha ? getPeopleContactsByAlpha(state) : getPeopleContactsByDistance(state)
    );
    const searchRegexes = useSelector((state: ClientState) => state.people.searchRegexes);

    const found = useMemo(() =>
        contacts
            .filter(cs => matchesSearch(cs, searchRegexes))
            .map((cs, index) => <PeoplePerson key={index} contact={cs}/>),
        [contacts, searchRegexes]
    );

    return (
        <div className="people-content">
            {found}
            {loadingContacts && <Loading/>}
        </div>
    );
}

function matchesSearch(contactState: ContactWithRelationships, searchRegexes: RegExp[]): boolean {
    const {nodeName, fullName} = contactState.contact;
    return nameListItemMatch({nodeName, fullName}, searchRegexes);
}
