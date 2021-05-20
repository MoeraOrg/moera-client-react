import React from 'react';
import { connect } from 'react-redux';

import { AvatarWithPopup, Loading } from "ui/control";
import NodeName from "ui/nodename/NodeName";

const SubscribersSubpage = ({loading, subscribers}) => (
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

export default connect(
    state => ({
        loading: state.people.loadingSubscribers,
        subscribers: state.people.subscribers
    })
)(SubscribersSubpage);
