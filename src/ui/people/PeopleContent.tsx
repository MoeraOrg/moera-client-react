import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import {
    getPeopleContactsByAlpha,
    getPeopleContactsByCloseness,
    getPeopleContactsMaxInTabs,
    getPeopleContactsTotal,
    isPeopleContactsLoading
} from "state/people/selectors";
import { ContactState } from "state/people/state";
import { Loading } from "ui/control";
import { Browser } from "ui/browser";
import PeopleSelectionPanel from "ui/people/PeopleSelectionPanel";
import PeoplePerson from "ui/people/PeoplePerson";
import { nameListItemMatch } from "util/names-list";

type Props = ConnectedProps<typeof connector>;

const PeopleContent = ({
    atHome, loading, loadingGeneral, contacts, contactsTotal, contactsMax, searchRegexes
}: Props) => (
    <div className="flex-fill">
        {(atHome && !loadingGeneral && contactsTotal > 0 && (Browser.isDevMode() || contactsMax > 12)) &&
            <PeopleSelectionPanel/>
        }
        <Loading active={loading}/>
        {contacts
            .filter(cs => matchesSearch(cs, searchRegexes))
            .map((cs, index) => <PeoplePerson key={index} contact={cs}/>)
        }
    </div>
);

function matchesSearch(contactState: ContactState, searchRegexes: RegExp[]): boolean {
    const {nodeName, fullName} = contactState.contact;
    return nameListItemMatch({nodeName, fullName}, searchRegexes);
}

const connector = connect(
    (state: ClientState) => ({
        atHome: isAtHomeNode(state),
        loading: isPeopleContactsLoading(state),
        loadingGeneral: state.people.loadingGeneral,
        contacts: state.people.sortAlpha ? getPeopleContactsByAlpha(state) : getPeopleContactsByCloseness(state),
        contactsTotal: getPeopleContactsTotal(state),
        contactsMax: getPeopleContactsMaxInTabs(state),
        searchRegexes: state.people.searchRegexes
    })
);

export default connector(PeopleContent);
