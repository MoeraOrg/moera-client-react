import React from 'react';
import { connect } from 'react-redux';

import { NodeName } from "api";
import { getOwnerFullName, getOwnerName } from "state/owner/selectors";
import { mentionName } from "util/misc";
import "./FeedTitle.css";

const FeedTitle = ({nodeName, fullName}) => (
    <div className="feed-title">
        <div className="full-name">{fullName ?? NodeName.shorten(nodeName)}</div>
        <div className="mention">{mentionName(nodeName)}</div>
    </div>
);

export default connect(
    state => ({
        nodeName: getOwnerName(state),
        fullName: getOwnerFullName(state)
    })
)(FeedTitle);
