import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { feedSubscribe, feedUnsubscribe } from "state/feeds/actions";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { getOwnerName } from "state/owner/selectors";
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
        const {nodeName, ownerName, feedName, feedSubscribe} = this.props;
        feedSubscribe(nodeName, nodeName === ownerName, feedName);
    }

    onUnsubscribe = () => {
        const {nodeName, ownerName, feedName, subscriberId, feedUnsubscribe} = this.props;
        feedUnsubscribe(nodeName, nodeName === ownerName, feedName, subscriberId);
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
        homeSet: isConnectedToHome(state) && isHomeOwnerNameSet(state),
        ownerName: getOwnerName(state)
    }),
    { feedSubscribe, feedUnsubscribe }
)(SubscribeButton);
