import React from 'react';
import { connect } from 'react-redux';

import { Loading, NodeName } from "ui/control";
import UnsubscribeButton from "ui/people/UnsubscribeButton";
import "./SubscriptionsSubpage.css";

const SubscriptionsSubpage = ({loading, subscriptions}) => (
    <div className="row">
        <Loading active={loading}/>
        {subscriptions.map(sr =>
            <div key={sr.id} className="subscription col-md-3 col-sm-4">
                <NodeName name={sr.remoteNodeName}/>
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
