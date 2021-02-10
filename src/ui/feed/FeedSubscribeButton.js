import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { Loading } from "ui/control";
import { isAtHomeNode } from "state/node/selectors";
import {
    getFeedSubscriberId,
    isFeedGeneralLoading,
    isFeedGeneralReady,
    isSubscribedToFeed,
    isSubscribingToFeed,
    isUnsubscribingFromFeed
} from "state/feeds/selectors";
import { isOwnerNameSet } from "state/owner/selectors";
import SubscribeButton from "ui/control/SubscribeButton";

const FeedSubscribeButton = ({feedName, show, generalReady, generalLoading, subscribed, subscribing, unsubscribing,
                              subscriberId}) => (
    <>
        <SubscribeButton nodeName="" feedName={feedName} show={show} ready={generalReady} subscribed={subscribed}
                         subscribing={subscribing} unsubscribing={unsubscribing} subscriberId={subscriberId}/>
        <Loading active={generalLoading}/>
    </>
);

FeedSubscribeButton.propTypes = {
    feedName: PropType.string
}

export default connect(
    (state, ownProps) => ({
        show: isOwnerNameSet(state) && !isAtHomeNode(state),
        generalReady: isFeedGeneralReady(state, ownProps.feedName),
        generalLoading: isFeedGeneralLoading(state, ownProps.feedName),
        subscribed: isSubscribedToFeed(state, ownProps.feedName),
        subscribing: isSubscribingToFeed(state, ownProps.feedName),
        unsubscribing: isUnsubscribingFromFeed(state, ownProps.feedName),
        subscriberId: getFeedSubscriberId(state, ownProps.feedName)
    })
)(FeedSubscribeButton);
