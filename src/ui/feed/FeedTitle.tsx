import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerAvatar, getOwnerFullName, getOwnerName, getOwnerTitle } from "state/node/selectors";
import { Avatar, DonateButton } from "ui/control";
import Jump from "ui/navigation/Jump";
import { mentionName } from "util/misc";
import "./FeedTitle.css";

type Props = ConnectedProps<typeof connector>;

const FeedTitle = ({nodeName, fullName, title, avatar, fundraisers}: Props) => (
    <div id="feed-title">
        <div className="panel">
            <Jump href="/profile" title="Profile" className="avatar-link">
                <Avatar avatar={avatar} ownerName={nodeName} size={100}/>
            </Jump>
            <div className="body">
                <div className="full-name">
                    {fullName || NodeName.shorten(nodeName)}
                    <DonateButton name={nodeName} fullName={fullName} fundraisers={fundraisers ?? null} styles="icon"/>
                </div>
                <div className="mention">{mentionName(nodeName)}</div>
                {title && <div className="title">{title}</div>}
            </div>
        </div>
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        nodeName: getOwnerName(state),
        fullName: getOwnerFullName(state),
        title: getOwnerTitle(state),
        avatar: getOwnerAvatar(state),
        fundraisers: state.profile.profile.fundraisers
    })
);

export default connector(FeedTitle);
