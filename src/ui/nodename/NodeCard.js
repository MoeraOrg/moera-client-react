import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { getNodeCard } from "state/nodecards/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import SubscribeButton from "ui/control/SubscribeButton";
import { Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import { mentionName, shortGender } from "util/misc";
import "./NodeCard.css";

const NodeCard = ({nodeName, fullName, card, homeOwnerName}) => {
    const realFullName = card != null && card.fullName != null ? card.fullName : fullName;
    const gender = card != null ? shortGender(card.gender) : null;
    const title = card != null ? card.title : null;
    const subscribersTotal = card != null && card.subscribersTotal != null ? card.subscribersTotal : "?";
    const subscriptionsTotal = card != null && card.subscriptionsTotal != null ? card.subscriptionsTotal : "?";
    const subscribed = card != null && (card.subscribed ?? false);
    const subscribing = card != null && card.subscribing;
    const unsubscribing = card != null && card.unsubscribing;
    const subscriberId = card != null ? card.subscriberId : null;
    return (
        <div className="node-card">
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
            <div className="people">
                <Jump className="counter" nodeName={nodeName} href="/people/subscribers">
                    <em>{subscribersTotal}</em> {subscribersTotal === 1 ? "subscriber" : "subscribers"}
                </Jump>
                <Jump className="counter" nodeName={nodeName} href="/people/subscriptions">
                    <em>{subscriptionsTotal}</em> {subscriptionsTotal === 1 ? "subscription" : "subscriptions"}
                </Jump>
            </div>
            <div className="buttons">
                <SubscribeButton show={nodeName !== homeOwnerName} ready={card != null && card.subscribed != null}
                                 subscribed={subscribed} subscribing={subscribing} unsubscribing={unsubscribing}
                                 nodeName={nodeName} feedName="timeline" subscriberId={subscriberId}/>
            </div>
            <Loading active={card == null || card.loading}/>
        </div>
    );
};

NodeCard.propTypes = {
    nodeName: PropType.string,
    fullName: PropType.string
};

export default connect(
    (state, ownProps) => ({
        card: getNodeCard(state, ownProps.nodeName),
        homeOwnerName: getHomeOwnerName(state)
    })
)(NodeCard);
