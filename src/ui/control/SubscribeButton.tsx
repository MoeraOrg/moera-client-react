import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { feedSubscribe, feedUnsubscribe } from "state/feeds/actions";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { Button, DropdownMenu } from "ui/control";
import "./SubscribeButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

    const loading = !subscribed ? subscribing : unsubscribing;
    if ((!subscribed && !subscribedToMe) || loading) {
        return (
            <Button variant="outline-primary" size="sm" className="subscribe-button" loading={loading}
                    onClick={onSubscribe}>
                Subscribe
            </Button>
        );
    }

    return (
        <DropdownMenu className="btn btn-sm btn-outline-primary subscribe-button" items={[
            {
                title: "Subscribe back",
                href: null,
                onClick: onSubscribe,
                show: !subscribed
            },
            {
                title: "Unsubscribe",
                href: null,
                onClick: onUnsubscribe,
                show: subscribed
            }
        ]}>
            {!subscribed ?
                "Subscribed to me"
            :
                (!subscribedToMe ? "Subscribed" : "Mutually subscribed")
            }
            &nbsp;&nbsp;
            <FontAwesomeIcon icon="chevron-down"/>
        </DropdownMenu>
    );
}

const connector = connect(
    (state: ClientState) => ({
        homeSet: isConnectedToHome(state) && isHomeOwnerNameSet(state)
    }),
    { feedSubscribe, feedUnsubscribe }
);

export default connector(SubscribeButton);
