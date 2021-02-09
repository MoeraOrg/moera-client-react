import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { getNodeCard } from "state/nodecards/selectors";
import { Loading } from "ui/control";
import { mentionName } from "util/misc";
import "./NodeCard.css";

const NodeCard = ({nodeName, fullName, card}) => {
    const realFullName = card != null && card.fullName != null ? card.fullName : fullName;
    const subscribersTotal = card != null && card.subscribersTotal != null ? card.subscribersTotal : "?";
    const subscriptionsTotal = card != null && card.subscriptionsTotal != null ? card.subscriptionsTotal : "?";
    return (
        <div className="node-card">
            {realFullName && <div className="full-name">{realFullName}</div>}
            <div className="name">{mentionName(nodeName)}</div>
            <div className="people">
                <span className="counter">
                    <em>{subscribersTotal}</em> {subscribersTotal === 1 ? "subscriber" : "subscribers"}
                </span>
                <span className="counter">
                    <em>{subscriptionsTotal}</em> {subscriptionsTotal === 1 ? "subscription" : "subscriptions"}
                </span>
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
        card: getNodeCard(state, ownProps.nodeName)
    })
)(NodeCard);
