import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getPeopleContactsSorted, getPeopleContactsTotal, isPeopleContactsLoading } from "state/people/selectors";
import { Loading } from "ui/control";
import PeopleSelectionPanel from "ui/people/PeopleSelectionPanel";
import PeoplePerson from "ui/people/PeoplePerson";

type Props = ConnectedProps<typeof connector>;

const PeopleContent = ({loading, loadingGeneral, contacts, contactsTotal}: Props) => (
    <div>
        {(!loadingGeneral && contactsTotal > 0) &&
            <PeopleSelectionPanel/>
        }
        <Loading active={loading}/>
        {contacts.map((cs, index) => <PeoplePerson key={index} contact={cs}/>)}
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        loading: isPeopleContactsLoading(state),
        loadingGeneral: state.people.loadingGeneral,
        contacts: getPeopleContactsSorted(state),
        contactsTotal: getPeopleContactsTotal(state)
    })
);

export default connector(PeopleContent);
