import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { getNodeCard, isNodeCardToBeLoaded } from "state/nodecards/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import SubscribeButton from "ui/control/SubscribeButton";
import { Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import { mentionName, shortGender } from "util/misc";
import "./NodeCard.css";

const NodeCard = ({nodeName, fullName, card, cardNotLoaded, homeOwnerName}) => {
    if (cardNotLoaded) {
        return (
            <div className="node-card">
                <div className="unknown">Unknown name</div>
            </div>
        );
    }

    const realFullName = card.fullName != null ? card.fullName : fullName;
    const gender = shortGender(card.gender);
    const subscribersTotal = card.subscribersTotal != null ? card.subscribersTotal : "?";
    const subscriptionsTotal = card.subscriptionsTotal != null ? card.subscriptionsTotal : "?";
    const subscribed = card.subscribed ?? false;
    const {title, subscribing, unsubscribing, subscriberId} = card;
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
                <SubscribeButton show={nodeName !== homeOwnerName} ready={card.subscribed != null}
                                 subscribed={subscribed} subscribing={subscribing} unsubscribing={unsubscribing}
                                 nodeName={nodeName} feedName="timeline" subscriberId={subscriberId}/>
            </div>
            <Loading active={card.loading}/>
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
        cardNotLoaded: isNodeCardToBeLoaded(state, ownProps.nodeName),
        homeOwnerName: getHomeOwnerName(state)
    })
)(NodeCard);
