import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { NodeName } from "api";
import { AvatarImage } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeCard, isNodeCardToBeLoaded } from "state/nodecards/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import CopyMentionButton from "ui/nodename/CopyMentionButton";
import SubscribeButton from "ui/control/SubscribeButton";
import { Avatar, Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import { mentionName, shortGender } from "util/misc";
import { Browser } from "ui/browser";
import "./NodeCard.css";

interface OwnProps {
    nodeName: string;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    avatarNodeName?: string;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function NodeCard({nodeName, fullName, avatar, avatarNodeName, card, cardNotLoaded, homeOwnerName}: Props) {
    if (cardNotLoaded || card == null) {
        return (
            <div className="node-card">
                <div className="unknown">Unknown name</div>
            </div>
        );
    }

    const realFullName = card.fullName ?? (fullName || NodeName.shorten(nodeName));
    const realAvatar =  card.avatar ?? avatar ?? null;
    const realAvatarNodeName = card.avatar != null ? nodeName : avatarNodeName ?? null;
    const gender = shortGender(card.gender);
    const subscribersTotal = card.subscribersTotal ?? "?";
    const subscriptionsTotal = card.subscriptionsTotal ?? "?";
    const subscribed = card.subscribed ?? false;
    const {title, subscribing, unsubscribing, subscriberId} = card;
    return (
        <div className="node-card">
            <div className="main">
                <Jump nodeName={nodeName} href="/profile" title="Profile" className="avatar-link">
                    <Avatar avatar={realAvatar} ownerName={nodeName} size={Browser.isTinyScreen() ? 64 : 100}
                            nodeName={realAvatarNodeName}/>
                </Jump>
                <div className="body">
                    {realFullName &&
                        <div>
                            <Jump className="full-name" nodeName={nodeName} href="/">{realFullName}</Jump>
                            {gender && <span className="gender">{gender}</span>}
                        </div>
                    }
                    <div>
                        <Jump className="name" nodeName={nodeName} href="/">{mentionName(nodeName)}</Jump>
                    </div>
                    {title && <div className="title">{title}</div>}
                </div>
            </div>
            <div className="people">
                <Jump className="counter" nodeName={nodeName} href="/people/subscribers">
                    <em>{subscribersTotal}</em> {subscribersTotal === 1 ? "subscriber" : "subscribers"}
                </Jump>
                <Jump className="counter" nodeName={nodeName} href="/people/subscriptions">
                    <em>{subscriptionsTotal}</em> {subscriptionsTotal === 1 ? "subscription" : "subscriptions"}
                </Jump>
            </div>
            <div className="buttons">
                <CopyMentionButton nodeName={nodeName} fullName={card.fullName ?? fullName ?? null}/>
                <SubscribeButton show={nodeName !== homeOwnerName} ready={card.subscribed != null}
                                 subscribed={subscribed} subscribing={subscribing} unsubscribing={unsubscribing}
                                 nodeName={nodeName} feedName="timeline" subscriberId={subscriberId}/>
            </div>
            <Loading active={card.loading}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        card: getNodeCard(state, ownProps.nodeName),
        cardNotLoaded: isNodeCardToBeLoaded(state, ownProps.nodeName),
        homeOwnerName: getHomeOwnerName(state)
    })
);

export default connector(NodeCard);
