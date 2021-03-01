import React from 'react';
import { connect } from 'react-redux';

import { NodeName } from "api";
import { getOwnerFullName, getOwnerName, getOwnerTitle } from "state/owner/selectors";
import { mentionName } from "util/misc";
import "./FeedTitle.css";

const FeedTitle = ({nodeName, fullName, title}) => (
    <div className="feed-title">
        <div className="panel">
            <span className="full-name">{fullName ?? NodeName.shorten(nodeName)}</span>
            <span className="mention">{mentionName(nodeName)}</span>
            {title && <><br/><span className="title">{title}</span></>}
        </div>
    </div>
);

export default connect(
    state => ({
        nodeName: getOwnerName(state),
        fullName: getOwnerFullName(state),
        title: getOwnerTitle(state)
    })
)(FeedTitle);
