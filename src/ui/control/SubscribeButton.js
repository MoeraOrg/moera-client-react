import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { feedSubscribe, feedUnsubscribe } from "state/feeds/actions";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import "./SubscribeButton.css";

class SubscribeButton extends React.PureComponent {

    static propTypes = {
        show: PropType.bool,
        ready: PropType.bool,
        subscribed: PropType.bool,
        subscribing: PropType.bool,
        unsubscribing: PropType.bool,
        nodeName: PropType.string,
        feedName: PropType.string,
        subscriberId: PropType.string
    };

    onSubscribe = () => {
        const {nodeName, feedName, feedSubscribe} = this.props;
        feedSubscribe(nodeName, feedName);
    }

    onUnsubscribe = () => {
        const {nodeName, feedName, subscriberId, feedUnsubscribe} = this.props;
        feedUnsubscribe(nodeName, feedName, subscriberId);
    }

    render() {
        const {show, ready, subscribed, subscribing, unsubscribing, homeSet} = this.props;

        if (!homeSet || !show || !ready) {
            return null;
        }

        if (!subscribed) {
            return (
                <Button variant="outline-primary" size="sm" className="subscribe-button"
                        loading={subscribing} onClick={this.onSubscribe}>
                    Subscribe
                </Button>
            );
        } else {
            return (
                <Button variant="outline-secondary" size="sm" className="subscribe-button"
                        loading={unsubscribing} onClick={this.onUnsubscribe}>
                    Unsubscribe
                </Button>
            );
        }
    }

}

export default connect(
    state => ({
        homeSet: isConnectedToHome(state) && isHomeOwnerNameSet(state)
    }),
    { feedSubscribe, feedUnsubscribe }
)(SubscribeButton);
