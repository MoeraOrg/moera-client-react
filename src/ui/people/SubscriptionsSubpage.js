import React from 'react';
import { connect } from 'react-redux';

import { Loading } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import UnsubscribeButton from "ui/people/UnsubscribeButton";
import "./SubscriptionsSubpage.css";

const SubscriptionsSubpage = ({loading, subscriptions}) => (
    <div className="row">
        <Loading active={loading}/>
        {subscriptions.map(sr =>
            <div key={sr.id} className="subscription col-md-4 col-sm-6">
                <NodeName name={sr.remoteNodeName} fullName={sr.remoteFullName}/>
                <UnsubscribeButton nodeName={sr.remoteNodeName} feedName={sr.remoteFeedName}
                                   subscriberId={sr.remoteSubscriberId}/>
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
