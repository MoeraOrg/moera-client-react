import React from 'react';
import { connect } from 'react-redux';

import { Loading, NodeName } from "ui/control";

const SubscribersSubpage = ({loading, subscribers}) => (
    <div className="row">
        <Loading active={loading}/>
        {subscribers.map(sr =>
            <div key={sr.id} className="col-md-3 col-sm-4">
                <NodeName name={sr.nodeName}/> to {feedTitle(sr.feedName)}
            </div>
        )}
    </div>
);

function feedTitle(feedName) {
    switch (feedName) {
        case "timeline":
            return "Timeline";
        case "news":
            return "News";
        default:
            return feedName;
    }
}

export default connect(
    state => ({
        loading: state.people.loadingSubscribers,
        subscribers: state.people.subscribers
    })
)(SubscribersSubpage);
