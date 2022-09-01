import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getOwnerName, isAtHomeNode, isOwnerNameSet } from "state/node/selectors";
import {
    getFeedSubscriber,
    getFeedSubscription,
    isFeedGeneralLoading,
    isFeedGeneralReady,
    isSubscribingToFeed,
    isUnsubscribingFromFeed
} from "state/feeds/selectors";
import { Loading } from "ui/control";
import SubscribeButton from "ui/control/SubscribeButton";

interface OwnProps {
    feedName: string;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const FeedSubscribeButton = ({feedName, show, ownerName, generalReady, generalLoading, subscribing, unsubscribing,
                              subscriber, subscription}: Props) => (
    ownerName != null ?
        <>
            <SubscribeButton nodeName={ownerName} feedName={feedName} show={show} ready={generalReady}
                             subscribing={subscribing} unsubscribing={unsubscribing} subscriber={subscriber}
                             subscription={subscription}/>
            <Loading active={generalLoading}/>
        </>
    :
        null
);

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        show: isOwnerNameSet(state) && !isAtHomeNode(state),
        ownerName: getOwnerName(state),
        generalReady: isFeedGeneralReady(state, ownProps.feedName),
        generalLoading: isFeedGeneralLoading(state, ownProps.feedName),
        subscribing: isSubscribingToFeed(state, ownProps.feedName),
        unsubscribing: isUnsubscribingFromFeed(state, ownProps.feedName),
        subscriber: getFeedSubscriber(state, ownProps.feedName),
        subscription: getFeedSubscription(state, ownProps.feedName)
    })
);

export default connector(FeedSubscribeButton);
