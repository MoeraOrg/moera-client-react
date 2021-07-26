import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { AvatarWithPopup, Loading } from "ui/control";
import NodeName from "ui/nodename/NodeName";

type Props = ConnectedProps<typeof connector>;

const SubscribersSubpage = ({loading, subscribers}: Props) => (
    <div className="row">
        <Loading active={loading}/>
        {subscribers.map(sr =>
            <div key={sr.id} className="person col-sm-4">
                <AvatarWithPopup ownerName={sr.nodeName} ownerFullName={sr.fullName} avatar={sr.avatar} size={48}/>
                <NodeName name={sr.nodeName} fullName={sr.fullName}/>
            </div>
        )}
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        loading: state.people.loadingSubscribers,
        subscribers: state.people.subscribers
    })
);

export default connector(SubscribersSubpage);
