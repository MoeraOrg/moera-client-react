import React, { useCallback } from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { feedSubscribe, feedUnsubscribe } from "state/feeds/actions";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import "./SubscribeButton.css";

function SubscribeButton({show, ready, subscribed, subscribing, unsubscribing, homeSet, nodeName, feedName,
                          subscriberId, feedSubscribe, feedUnsubscribe}) {
    const onSubscribe = useCallback(
        () => feedSubscribe(nodeName, feedName),
        [feedSubscribe, nodeName, feedName]
    );

    const onUnsubscribe = useCallback(
        () => feedUnsubscribe(nodeName, feedName, subscriberId),
        [feedUnsubscribe, nodeName, feedName, subscriberId]
    );

    if (!homeSet || !show || !ready) {
        return null;
    }

    if (!subscribed) {
        return (
            <Button variant="outline-primary" size="sm" className="subscribe-button" loading={subscribing}
                    onClick={onSubscribe}>
                Subscribe
            </Button>
        );
    } else {
        return (
            <Button variant="outline-secondary" size="sm" className="subscribe-button" loading={unsubscribing}
                    onClick={onUnsubscribe}>
                Unsubscribe
            </Button>
        );
    }
}

SubscribeButton.propTypes = {
    show: PropType.bool,
    ready: PropType.bool,
    subscribed: PropType.bool,
    subscribing: PropType.bool,
    unsubscribing: PropType.bool,
    nodeName: PropType.string,
    feedName: PropType.string,
    subscriberId: PropType.string
};

export default connect(
    state => ({
        homeSet: isConnectedToHome(state) && isHomeOwnerNameSet(state)
    }),
    { feedSubscribe, feedUnsubscribe }
)(SubscribeButton);
