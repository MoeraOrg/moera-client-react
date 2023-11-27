import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { getOwnerCard, getOwnerName, isAtHomeNode, isOwnerNameSet } from "state/node/selectors";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { isFeedGeneralLoading, isFeedGeneralReady } from "state/feeds/selectors";
import { Loading, SubscribeButton } from "ui/control";

interface Props {
    feedName: string;
    small?: boolean | null;
}

export default function FeedSubscribeButton({feedName, small}: Props) {
    const show = useSelector((state: ClientState) =>
        isOwnerNameSet(state) && !isAtHomeNode(state) && isConnectedToHome(state) && isHomeOwnerNameSet(state));
    const ownerName = useSelector(getOwnerName);
    const generalReady = useSelector((state: ClientState) => isFeedGeneralReady(state, feedName));
    const generalLoading = useSelector((state: ClientState) => isFeedGeneralLoading(state, feedName));
    const subscription = useSelector((state: ClientState) => getOwnerCard(state)?.subscription);

    if (ownerName == null || !show) {
        return null;
    }

    return (
        <>
            {(generalReady && (subscription?.loaded ?? false)) &&
                <SubscribeButton nodeName={ownerName} feedName={feedName} small={small}/>
            }
            {(generalLoading || subscription?.loading) && <Loading/>}
        </>
    );
}
