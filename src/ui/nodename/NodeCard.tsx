import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { format, formatDistanceToNow, formatISO, fromUnixTime } from 'date-fns';

import { NodeName } from "api";
import { AvatarImage } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeCard, isNodeCardAnyLoaded, isNodeCardAnyLoading } from "state/nodecards/selectors";
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

function NodeCard({nodeName, fullName, avatar, avatarNodeName, card, anyLoaded, anyLoading, homeOwnerName}: Props) {
    if (card == null || (!anyLoaded && !anyLoading)) {
        return (
            <div className="node-card">
                <div className="unknown">Unknown name</div>
            </div>
        );
    }

    const realFullName = card.details.profile.fullName ?? (fullName || NodeName.shorten(nodeName));
    const realAvatar =  card.details.profile.avatar ?? avatar ?? null;
    const realAvatarNodeName = card.details.profile.avatar != null ? nodeName : avatarNodeName ?? null;
    const gender = shortGender(card.details.profile.gender ?? null);
    const storiesTotal = card.stories.storiesTotal ?? "?";
    const storiesLastDate = card.stories.lastStoryCreatedAt != null
        ? fromUnixTime(card.stories.lastStoryCreatedAt)
        : null;
    const subscribersTotal = card.people.subscribersTotal ?? "?";
    const subscriptionsTotal = card.people.subscriptionsTotal ?? "?";
    const {
        details: {profile: {title, fundraisers}},
        subscription: {subscribing, unsubscribing, subscriber, subscription}
    } = card;

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
                    <DonateButton name={nodeName} fullName={fullName ?? null} fundraisers={fundraisers ?? null}
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
                <CopyMentionButton nodeName={nodeName} fullName={card.details.profile.fullName ?? fullName ?? null}/>
                <SubscribeButton show={nodeName !== homeOwnerName} ready={card.subscription.loaded != null}
                                 subscribing={subscribing} unsubscribing={unsubscribing}
                                 nodeName={nodeName} feedName="timeline" subscriber={subscriber}
                                 subscription={subscription}/>
            </div>
            <Loading active={anyLoading}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        card: getNodeCard(state, ownProps.nodeName),
        anyLoaded: isNodeCardAnyLoaded(state, ownProps.nodeName),
        anyLoading: isNodeCardAnyLoading(state, ownProps.nodeName),
        homeOwnerName: getHomeOwnerName(state)
    })
);

export default connector(NodeCard);
