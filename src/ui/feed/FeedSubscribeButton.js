import React from 'react';
import { connect } from 'react-redux';

import { Button, Loading } from "ui/control";
import { isAtHomeNode } from "state/node/selectors";
import {
    getFeedSubscriberId,
    isFeedGeneralLoading,
    isFeedGeneralReady,
    isSubscribedToFeed,
    isSubscribingToFeed,
    isUnsubscribingFromFeed
} from "state/feeds/selectors";
import { feedSubscribe, feedUnsubscribe } from "state/feeds/actions";
import "./FeedSubscribeButton.css";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { isOwnerNameSet } from "state/owner/selectors";

class FeedSubscribeButton extends React.PureComponent {

    onSubscribe = () => {
        const {feedName, feedSubscribe} = this.props;
        feedSubscribe("", feedName);
    }

    onUnsubscribe = () => {
        const {feedName, subscriberId, feedUnsubscribe} = this.props;
        feedUnsubscribe("", feedName, subscriberId);
    }

    render() {
        const {atHomeNode, generalReady, generalLoading, subscribed, subscribing, unsubscribing} = this.props;
        return (
            <>
                {
                    !atHomeNode && generalReady && (
                        !subscribed ?
                            <Button variant="outline-primary" size="sm" className="feed-subscribe ml-3"
                                    loading={subscribing} onClick={this.onSubscribe}>
                                Subscribe
                            </Button>
                        :
                            <Button variant="outline-secondary" size="sm" className="feed-unsubscribe ml-3"
                                    loading={unsubscribing} onClick={this.onUnsubscribe}>
                                Unsubscribe
                            </Button>
                    )
                }
                <Loading active={generalLoading}/>
            </>
        );
    }

}

export default connect(
    (state, ownProps) => ({
        show: isConnectedToHome(state) && isHomeOwnerNameSet(state) && isOwnerNameSet(state) && !isAtHomeNode(state),
        generalReady: isFeedGeneralReady(state, ownProps.feedName),
        generalLoading: isFeedGeneralLoading(state, ownProps.feedName),
        subscribed: isSubscribedToFeed(state, ownProps.feedName),
        subscribing: isSubscribingToFeed(state, ownProps.feedName),
        unsubscribing: isUnsubscribingFromFeed(state, ownProps.feedName),
        subscriberId: getFeedSubscriberId(state, ownProps.feedName)
    }),
    { feedSubscribe, feedUnsubscribe }
)(FeedSubscribeButton);
