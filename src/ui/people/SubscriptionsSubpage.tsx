import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { AvatarWithPopup, Loading } from "ui/control";
import NodeName from "ui/nodename/NodeName";

type Props = ConnectedProps<typeof connector>;

const SubscriptionsSubpage = ({loading, subscriptions}: Props) => (
    <div className="row">
        <Loading active={loading}/>
        {subscriptions.map(sr =>
            <div key={sr.id} className="person col-sm-4">
                <AvatarWithPopup ownerName={sr.remoteNodeName} ownerFullName={sr.remoteFullName}
                                 avatar={sr.remoteAvatar} size={48}/>
                <NodeName name={sr.remoteNodeName} fullName={sr.remoteFullName}/>
            </div>
        )}
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        loading: state.people.loadingSubscriptions,
        subscriptions: state.people.subscriptions
    })
);

export default connector(SubscriptionsSubpage);
