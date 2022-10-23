import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getOwnerCard, getOwnerName, isAtHomeNode, isOwnerNameSet } from "state/node/selectors";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { isFeedGeneralLoading, isFeedGeneralReady } from "state/feeds/selectors";
import { Loading } from "ui/control";
import SubscribeButton from "ui/control/SubscribeButton";

interface OwnProps {
    feedName: string;
    small?: boolean | null;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function FeedSubscribeButton({feedName, small, show, ownerName, generalReady, generalLoading, subscription}: Props) {
    if (ownerName == null || !show) {
        return null;
    }

    return (
        <>
            {(generalReady && (subscription?.loaded ?? false)) &&
                <SubscribeButton nodeName={ownerName} feedName={feedName} small={small}
                                 subscribing={subscription?.subscribing ?? false}
                                 unsubscribing={subscription?.unsubscribing ?? false}
                                 subscriber={subscription?.subscriber ?? null}
                                 subscription={subscription?.subscription ?? null}/>
            }
            <Loading active={generalLoading || subscription?.loading}/>
        </>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        show: isOwnerNameSet(state) && !isAtHomeNode(state) && isConnectedToHome(state) && isHomeOwnerNameSet(state),
        ownerName: getOwnerName(state),
        generalReady: isFeedGeneralReady(state, ownProps.feedName),
        generalLoading: isFeedGeneralLoading(state, ownProps.feedName),
        subscription: getOwnerCard(state)?.subscription
    })
);

export default connector(FeedSubscribeButton);
