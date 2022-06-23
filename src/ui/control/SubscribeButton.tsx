import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Button } from "ui/control/index";
import { ClientState } from "state/state";
import { feedSubscribe, feedUnsubscribe } from "state/feeds/actions";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import "./SubscribeButton.css";

type Props = {
    show: boolean;
    ready: boolean;
    subscribed: boolean;
    subscribing: boolean;
    unsubscribing: boolean;
    nodeName: string;
    feedName: string;
    subscriberId: string | null;
    subscribedToMe: boolean;
} & ConnectedProps<typeof connector>;

function SubscribeButton({show, ready, subscribed, subscribing, unsubscribing, homeSet, nodeName, feedName,
                          subscriberId, subscribedToMe, feedSubscribe, feedUnsubscribe}: Props) {
    const onSubscribe = () => feedSubscribe(nodeName, feedName);

    const onUnsubscribe = () => subscriberId != null && feedUnsubscribe(nodeName, feedName, subscriberId);

    if (!homeSet || !show || !ready) {
        return null;
    }

    return (
        <Button variant="outline-primary" size="sm" className="subscribe-button"
                loading={!subscribed ? subscribing: unsubscribing}
                onClick={!subscribed ? onSubscribe : onUnsubscribe}>
            {!subscribed ?
                (!subscribedToMe ? "Subscribe" : "Subscribed to me")
            :
                (!subscribedToMe ? "Subscribed" : "Mutually subscribed")
            }
        </Button>
    );
}

const connector = connect(
    (state: ClientState) => ({
        homeSet: isConnectedToHome(state) && isHomeOwnerNameSet(state)
    }),
    { feedSubscribe, feedUnsubscribe }
);

export default connector(SubscribeButton);
