import React from 'react';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { isAtHomeNode } from "state/node/selectors";
import { feedUnsubscribe } from "state/feeds/actions";

class UnsubscribeButton extends React.PureComponent {

    onUnsubscribe = () => {
        const {nodeName, feedName, subscriberId, feedUnsubscribe} = this.props;
        feedUnsubscribe(nodeName, feedName, subscriberId);
    }

    render() {
        const {atHomeNode} = this.props;

        if (!atHomeNode) {
            return null;
        }
        return (
            <Button variant="outline-secondary" size="sm" className="feed-unsubscribe ml-3"
                    onClick={this.onUnsubscribe}>
                Unsubscribe
            </Button>
        );
    }

}

export default connect(
    state => ({
        atHomeNode: isAtHomeNode(state)
    }),
    { feedUnsubscribe }
)(UnsubscribeButton);
