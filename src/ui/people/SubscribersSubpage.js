import React from 'react';
import { connect } from 'react-redux';

import { Loading } from "ui/control";
import NodeName from "ui/nodename/NodeName";

const SubscribersSubpage = ({loading, subscribers}) => (
    <div className="row">
        <Loading active={loading}/>
        {subscribers.map(sr =>
            <div key={sr.id} className="col-md-3 col-sm-4">
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
