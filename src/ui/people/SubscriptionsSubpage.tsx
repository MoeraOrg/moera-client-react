import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { createSelector } from 'reselect';

import { ClientState } from "state/state";
import { getPeopleSubscriptions } from "state/people/selectors";
import { AvatarWithPopup, Loading, Principal } from "ui/control";
import NodeName from "ui/nodename/NodeName";

type Props = ConnectedProps<typeof connector>;

const SubscriptionsSubpage = ({loading, subscriptions}: Props) => (
    <div className="row">
        <Loading active={loading}/>
        {subscriptions.map(sr =>
            <div key={sr.subscription.id} className="person col-sm-4">
                <AvatarWithPopup ownerName={sr.contact.nodeName} ownerFullName={sr.contact.fullName}
                                 avatar={sr.contact.avatar} size={48}/>
                <NodeName name={sr.contact.nodeName} fullName={sr.contact.fullName}/>
                <Principal value={sr.subscription.operations?.view ?? "public"} defaultValue="public"/>
            </div>
        )}
    </div>
);

const getSubscriptions = createSelector(
    getPeopleSubscriptions,
    subscriptions =>
        subscriptions.sort((sr1, sr2) => {
            const sr1name = sr1.contact.fullName || sr1.contact.nodeName;
            const sr2name = sr2.contact.fullName || sr2.contact.nodeName;
            return sr1name.localeCompare(sr2name);
        })
);

const connector = connect(
    (state: ClientState) => ({
        loading: state.people.loadingSubscriptions,
        subscriptions: getSubscriptions(state)
    })
);

export default connector(SubscriptionsSubpage);
