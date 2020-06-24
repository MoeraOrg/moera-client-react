import React from 'react';
import { connect } from 'react-redux';

import { Loading, NodeName } from "ui/control";

const SubscribersSubpage = ({loading, subscribers}) => (
    <div>
        <Loading active={loading}/>
        {subscribers.map(sr =>
            <div key={sr.id}>
                <NodeName name={sr.nodeName}/>
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
