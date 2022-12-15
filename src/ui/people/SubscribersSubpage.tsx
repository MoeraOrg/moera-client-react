import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from 'reselect';

import { ClientState } from "state/state";
import { getPeopleSubscribers } from "state/people/selectors";
import { AvatarWithPopup, Loading } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import SubscriberVisibility from "ui/people/SubscriberVisibility";

type Props = ConnectedProps<typeof connector>;

const SubscribersSubpage = ({loading, subscribers}: Props) => (
    <div className="row">
        <Loading active={loading}/>
        {subscribers.map(sr =>
            <div key={sr.subscriber.id} className="person col-sm-4">
                <AvatarWithPopup ownerName={sr.contact.nodeName} ownerFullName={sr.contact.fullName}
                                 avatar={sr.contact.avatar} size={48}/>
                <NodeName name={sr.contact.nodeName} fullName={sr.contact.fullName}/>
                <SubscriberVisibility subscriber={sr.subscriber}/>
            </div>
        )}
    </div>
);

const getSubscribers = createSelector(
    getPeopleSubscribers,
    subscribers =>
        subscribers.sort((sr1, sr2) => {
            const sr1name = sr1.contact.fullName || sr1.contact.nodeName;
            const sr2name = sr2.contact.fullName || sr2.contact.nodeName;
            return sr1name.localeCompare(sr2name);
        })
);

const connector = connect(
    (state: ClientState) => ({
        loading: state.people.loadingSubscribers,
        subscribers: getSubscribers(state)
    })
);

export default connector(SubscribersSubpage);
