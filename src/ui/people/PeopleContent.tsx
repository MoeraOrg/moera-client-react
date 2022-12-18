import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from 'reselect';

import { ClientState } from "state/state";
import { ContactState } from "state/people/state";
import {
    getPeopleFriendOfs,
    getPeopleFriends,
    getPeopleSubscribers,
    getPeopleSubscriptions,
    getPeopleTab
} from "state/people/selectors";
import { AvatarWithPopup, Loading } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import PeopleContactIcons from "ui/people/PeopleContactIcons";

type Props = ConnectedProps<typeof connector>;

const PeopleContent = ({loading, contacts}: Props) => (
    <div>
        <Loading active={loading}/>
        {contacts.map((cs, index) =>
            <div key={index} className="person">
                <AvatarWithPopup ownerName={cs.contact.nodeName} ownerFullName={cs.contact.fullName}
                                 avatar={cs.contact.avatar} size={48}/>
                <NodeName name={cs.contact.nodeName} fullName={cs.contact.fullName}/>
                <PeopleContactIcons contact={cs}/>
            </div>
        )}
    </div>
);

function isLoading(state: ClientState): boolean {
    switch (getPeopleTab(state)) {
        case "subscribers":
            return state.people.loadingSubscribers;
        case "subscriptions":
            return state.people.loadingSubscriptions;
        case "friend-ofs":
            return state.people.loadingFriendOfs;
        default:
            return state.people.loadingFriends;
    }
}

function getPeopleContacts(state: ClientState): ContactState[] {
    const tab = getPeopleTab(state);
    switch (tab) {
        case "subscribers":
            return getPeopleSubscribers(state);
        case "subscriptions":
            return getPeopleSubscriptions(state);
        case "friend-ofs":
            return getPeopleFriendOfs(state);
        default:
            return getPeopleFriends(state, tab);
    }
}

const getContacts = createSelector(
    getPeopleContacts,
    contacts =>
        contacts.sort((sr1, sr2) => {
            const sr1name = sr1.contact.fullName || sr1.contact.nodeName;
            const sr2name = sr2.contact.fullName || sr2.contact.nodeName;
            return sr1name.localeCompare(sr2name);
        })
);

const connector = connect(
    (state: ClientState) => ({
        loading: isLoading(state),
        contacts: getContacts(state)
    })
);

export default connector(PeopleContent);
