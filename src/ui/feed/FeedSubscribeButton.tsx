import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Loading } from "ui/control";
import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import {
    getFeedSubscribedToMe,
    getFeedSubscriberId,
    isFeedGeneralLoading,
    isFeedGeneralReady,
    isSubscribedToFeed,
    isSubscribingToFeed,
    isUnsubscribingFromFeed
} from "state/feeds/selectors";
import { getOwnerName, isOwnerNameSet } from "state/owner/selectors";
import SubscribeButton from "ui/control/SubscribeButton";

interface OwnProps {
    feedName: string;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const FeedSubscribeButton = ({feedName, show, ownerName, generalReady, generalLoading, subscribed, subscribing,
                              unsubscribing, subscriberId, subscribedToMe}: Props) => (
    ownerName != null ?
        <>
            <SubscribeButton nodeName={ownerName} feedName={feedName} show={show} ready={generalReady}
                             subscribed={subscribed} subscribing={subscribing} unsubscribing={unsubscribing}
                             subscriberId={subscriberId} subscribedToMe={subscribedToMe}/>
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
        subscribed: isSubscribedToFeed(state, ownProps.feedName),
        subscribing: isSubscribingToFeed(state, ownProps.feedName),
        unsubscribing: isUnsubscribingFromFeed(state, ownProps.feedName),
        subscriberId: getFeedSubscriberId(state, ownProps.feedName),
        subscribedToMe: getFeedSubscribedToMe(state, ownProps.feedName)
    })
);

export default connector(FeedSubscribeButton);
