import React from 'react';
import { connect } from 'react-redux';

import { Loading, NodeName } from "ui/control";

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
