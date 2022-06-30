import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { format, formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';

import { NodeName } from "api";
import { AvatarImage } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeCard, isNodeCardToBeLoaded } from "state/nodecards/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import CopyMentionButton from "ui/nodename/CopyMentionButton";
import SubscribeButton from "ui/control/SubscribeButton";
import { Avatar, DonateButton, Loading } from "ui/control";
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
    const storiesTotal = card.storiesTotal ?? "?";
    const storiesLastDate = card.lastStoryCreatedAt != null ? fromUnixTime(card.lastStoryCreatedAt) : null;
    const subscribersTotal = card.subscribersTotal ?? "?";
    const subscriptionsTotal = card.subscriptionsTotal ?? "?";
    const {loading, loaded, title, fundraisers, subscribing, unsubscribing, subscriber, subscription} = card;
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
                    <DonateButton name={nodeName} fullName={fullName ?? null} fundraisers={fundraisers}
                                  styles="small"/>
                </div>
            </div>
            <div className="stories">
                <span className="counter">
                    <em>{storiesTotal}</em> {storiesTotal === 1 ? "post" : "posts"}
                    {storiesLastDate &&
                        <>
                            , last{" "}
                            <time dateTime={formatISO(storiesLastDate)}
                                  title={format(storiesLastDate, "dd-MM-yyyy HH:mm")}>
                                {formatDistanceToNow(storiesLastDate, {addSuffix: true})}
                            </time>
                        </>
                    }
                </span>
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
                <SubscribeButton show={nodeName !== homeOwnerName} ready={loaded != null}
                                 subscribing={subscribing} unsubscribing={unsubscribing}
                                 nodeName={nodeName} feedName="timeline" subscriber={subscriber}
                                 subscription={subscription}/>
            </div>
            <Loading active={loading}/>
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
