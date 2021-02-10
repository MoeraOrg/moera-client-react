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

    getNodeCodeName() {
        const {nodeName, ownerName} = this.props;
        return nodeName !== ownerName ? nodeName : "";
    }

    onSubscribe = () => {
        const {feedName, feedSubscribe} = this.props;
        feedSubscribe(this.getNodeCodeName(), feedName);
    }

    onUnsubscribe = () => {
        const {feedName, subscriberId, feedUnsubscribe} = this.props;
        feedUnsubscribe(this.getNodeCodeName(), feedName, subscriberId);
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
