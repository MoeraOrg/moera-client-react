import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getOwnerCard, getOwnerName, isAtHomeNode, isOwnerNameSet } from "state/node/selectors";
import { isFeedGeneralLoading, isFeedGeneralReady } from "state/feeds/selectors";
import { Loading } from "ui/control";
import SubscribeButton from "ui/control/SubscribeButton";

interface OwnProps {
    feedName: string;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

const FeedSubscribeButton = ({feedName, show, ownerName, generalReady, generalLoading, subscription}: Props) => (
    ownerName != null ?
        <>
            {(!generalLoading && subscription?.loaded) &&
                <SubscribeButton nodeName={ownerName} feedName={feedName} show={show} ready={generalReady}
                                 subscribing={subscription?.subscribing ?? false}
                                 unsubscribing={subscription?.unsubscribing ?? false}
                                 subscriber={subscription?.subscriber ?? null}
                                 subscription={subscription?.subscription ?? null}/>
            }
            <Loading active={generalLoading || subscription?.loading}/>
        </>
    :
        null
);

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        show: isOwnerNameSet(state) && !isAtHomeNode(state),
        ownerName: getOwnerName(state),
        generalReady: isFeedGeneralReady(state, ownProps.feedName),
        generalLoading: isFeedGeneralLoading(state, ownProps.feedName),
        subscription: getOwnerCard(state)?.subscription
    })
);

export default connector(FeedSubscribeButton);
