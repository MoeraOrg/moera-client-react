import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { getOwnerCard, getOwnerName, isAtHomeNode, isOwnerNameSet } from "state/node/selectors";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { isFeedGeneralLoading, isFeedGeneralReady } from "state/feeds/selectors";
import { Loading, SubscribeButton } from "ui/control";
import { RelNodeName } from "util/rel-node-name";
import "./FeedSubscribeButton.css";

interface Props {
    nodeName: RelNodeName | string;
    feedName: string;
    sharing?: boolean;
}

export default function FeedSubscribeButton({nodeName, feedName, sharing}: Props) {
    const show = useSelector((state: ClientState) =>
        isOwnerNameSet(state) && !isAtHomeNode(state) && isConnectedToHome(state) && isHomeOwnerNameSet(state)
    );
    const ownerName = useSelector(getOwnerName);
    const generalReady = useSelector((state: ClientState) => isFeedGeneralReady(state, nodeName, feedName));
    const generalLoading = useSelector((state: ClientState) => isFeedGeneralLoading(state, nodeName, feedName));
    const subscription = useSelector((state: ClientState) => getOwnerCard(state)?.subscription);

    if (ownerName == null || !show) {
        return null;
    }

    return (
        <div className="feed-subscribe-button">
            {(generalReady && (subscription?.loaded ?? false)) &&
                <SubscribeButton nodeName={ownerName} feedName={feedName} sharing={sharing}/>
            }
            {(generalLoading || subscription?.loading) && <Loading/>}
        </div>
    );
}
