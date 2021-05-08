import React from 'react';
import { connect } from 'react-redux';

import { NodeName } from "api";
import { getOwnerAvatar, getOwnerFullName, getOwnerName, getOwnerTitle } from "state/owner/selectors";
import { Avatar } from "ui/control";
import { mentionName } from "util/misc";
import "./FeedTitle.css";

const FeedTitle = ({nodeName, fullName, title, avatar}) => (
    <div id="feed-title">
        <div className="panel">
            <Avatar avatar={avatar} size={100}/>
            <div className="body">
                <div className="full-name">{fullName || NodeName.shorten(nodeName)}</div>
                <div className="mention">{mentionName(nodeName)}</div>
                {title && <div className="title">{title}</div>}
            </div>
        </div>
    </div>
);

export default connect(
    state => ({
        nodeName: getOwnerName(state),
        fullName: getOwnerFullName(state),
        title: getOwnerTitle(state),
        avatar: getOwnerAvatar(state)
    })
)(FeedTitle);
