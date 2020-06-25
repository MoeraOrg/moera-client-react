import React from 'react';
import { connect } from 'react-redux';

import { Loading, NodeName } from "ui/control";

const SubscriptionsSubpage = ({loading, subscriptions}) => (
    <div className="row">
        <Loading active={loading}/>
        {subscriptions.map(sr =>
            <div key={sr.id} className="col-md-3 col-sm-4">
                <NodeName name={sr.remoteNodeName}/>
            </div>
        )}
    </div>
);

export default connect(
    state => ({
        loading: state.people.loadingSubscriptions,
        subscriptions: state.people.subscriptions
    })
)(SubscriptionsSubpage);
