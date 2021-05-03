import React from 'react';
import { connect } from 'react-redux';

import { NodeName } from "api";
import { getOwnerAvatar, getOwnerFullName, getOwnerName, getOwnerTitle } from "state/owner/selectors";
import { mentionName } from "util/misc";
import "./FeedTitle.css";
import { Avatar } from "ui/control";
import { getNodeRootPage } from "state/node/selectors";

const FeedTitle = ({nodeName, fullName, title, avatar, rootPage}) => (
    <div id="feed-title">
        <div className="panel">
            <Avatar avatar={avatar} size={100} rootPage={rootPage}/>
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
        avatar: getOwnerAvatar(state),
        rootPage: getNodeRootPage(state)
    })
)(FeedTitle);
