import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import {
    getPeopleContactsMaxInTabs,
    getPeopleContactsSorted,
    getPeopleContactsTotal,
    isPeopleContactsLoading
} from "state/people/selectors";
import { Loading } from "ui/control";
import { Browser } from "ui/browser";
import PeopleSelectionPanel from "ui/people/PeopleSelectionPanel";
import PeoplePerson from "ui/people/PeoplePerson";

type Props = ConnectedProps<typeof connector>;

const PeopleContent = ({atHome, loading, loadingGeneral, contacts, contactsTotal, contactsMax}: Props) => (
    <div>
        {(atHome && !loadingGeneral && contactsTotal > 0 && (Browser.isDevMode() || contactsMax > 12)) &&
            <PeopleSelectionPanel/>
        }
        <Loading active={loading}/>
        {contacts.map((cs, index) => <PeoplePerson key={index} contact={cs}/>)}
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        atHome: isAtHomeNode(state),
        loading: isPeopleContactsLoading(state),
        loadingGeneral: state.people.loadingGeneral,
        contacts: getPeopleContactsSorted(state),
        contactsTotal: getPeopleContactsTotal(state),
        contactsMax: getPeopleContactsMaxInTabs(state)
    })
);

export default connector(PeopleContent);
