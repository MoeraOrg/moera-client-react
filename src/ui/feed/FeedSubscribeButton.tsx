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

function FeedSubscribeButton({feedName, small, show, ownerName, generalReady, generalLoading, card}: Props) {
    if (ownerName == null || !show) {
        return null;
    }

    return (
        <>
            {(generalReady && (card?.subscription?.loaded ?? false)) &&
                <SubscribeButton nodeName={ownerName} feedName={feedName} small={small}
                                 subscribing={card?.subscription?.subscribing ?? false}
                                 unsubscribing={card?.subscription?.unsubscribing ?? false}
                                 subscriber={card?.subscription?.subscriber ?? null}
                                 subscription={card?.subscription?.subscription ?? null}
                                 friendGroups={card?.friendship?.groups ?? null}
                                 remoteFriendGroups={card?.friendship?.remoteGroups ?? null}
                                 updatingFriendship={card?.friendship?.updating ?? false}/>
            }
            <Loading active={generalLoading || card?.subscription?.loading}/>
        </>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        show: isOwnerNameSet(state) && !isAtHomeNode(state) && isConnectedToHome(state) && isHomeOwnerNameSet(state),
        ownerName: getOwnerName(state),
        generalReady: isFeedGeneralReady(state, ownProps.feedName),
        generalLoading: isFeedGeneralLoading(state, ownProps.feedName),
        card: getOwnerCard(state)
    })
);

export default connector(FeedSubscribeButton);
