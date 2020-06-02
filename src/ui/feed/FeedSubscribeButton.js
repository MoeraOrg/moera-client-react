import React from 'react';
import { connect } from 'react-redux';

import { Button, Loading } from "ui/control";
import { isAtHomeNode } from "state/node/selectors";
import { isFeedGeneralLoading, isFeedGeneralReady, isSubscribedToFeed } from "state/feeds/selectors";

const FeedSubscribeButton = ({feedName, atHomeNode, generalReady, generalLoading, subscribed}) => (
    <>
        {
            !atHomeNode && generalReady && (
                !subscribed ?
                    <Button variant="outline-primary" size="sm" className="ml-3">
                        Subscribe
                    </Button>
                :
                    <Button variant="outline-danger" size="sm" className="ml-3">
                        Unsubscribe
                    </Button>
            )
        }
        <Loading active={generalLoading}/>
    </>
);

export default connect(
    (state, ownProps) => ({
        atHomeNode: isAtHomeNode(state),
        generalReady: isFeedGeneralReady(state, ownProps.feedName),
        generalLoading: isFeedGeneralLoading(state, ownProps.feedName),
        subscribed: isSubscribedToFeed(state, ownProps.feedName)
    })
)(FeedSubscribeButton);
