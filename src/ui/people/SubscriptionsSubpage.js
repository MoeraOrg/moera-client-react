import React from 'react';
import { connect } from 'react-redux';

import { Loading, NodeName } from "ui/control";

const SubscriptionsSubpage = ({loading, subscriptions}) => (
    <div>
        <Loading active={loading}/>
        {subscriptions.map(sr =>
            <div key={sr.id}>
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
