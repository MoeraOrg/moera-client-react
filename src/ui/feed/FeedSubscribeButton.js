import React from 'react';
import { connect } from 'react-redux';

import { Button, Loading } from "ui/control";
import { isAtHomeNode } from "state/node/selectors";
import {
    isFeedGeneralLoading,
    isFeedGeneralReady,
    isSubscribedToFeed,
    isSubscribingToFeed
} from "state/feeds/selectors";
import { feedSubscribe } from "state/feeds/actions";

class FeedSubscribeButton extends React.PureComponent {

    onSubscribe = () => {
        const {feedName, feedSubscribe} = this.props;
        feedSubscribe(feedName);
    }

    render() {
        const {atHomeNode, generalReady, generalLoading, subscribed, subscribing} = this.props;
        return (
            <>
                {
                    !atHomeNode && generalReady && (
                        !subscribed ?
                            <Button variant="outline-primary" size="sm" className="ml-3" loading={subscribing}
                                    onClick={this.onSubscribe}>
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
    }

}

export default connect(
    (state, ownProps) => ({
        atHomeNode: isAtHomeNode(state),
        generalReady: isFeedGeneralReady(state, ownProps.feedName),
        generalLoading: isFeedGeneralLoading(state, ownProps.feedName),
        subscribed: isSubscribedToFeed(state, ownProps.feedName),
        subscribing: isSubscribingToFeed(state, ownProps.feedName)
    }),
    { feedSubscribe }
)(FeedSubscribeButton);
