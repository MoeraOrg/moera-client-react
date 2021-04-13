import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Avatar } from "ui/control";
import AvatarEditDialog from "ui/profile/edit/AvatarEditDialog";
import { profileOpenAvatarEditDialog } from "state/profile/actions";
import "./AvatarEditor.css";

const AvatarEditor = ({avatar, rootPage, profileOpenAvatarEditDialog}) => (
    <div className="avatar-editor" onClick={profileOpenAvatarEditDialog}>
        <div className="icon"><FontAwesomeIcon icon="pen"/></div>
        <Avatar avatar={avatar} rootPage={rootPage}/>
        <AvatarEditDialog/>
    </div>
);

export default connect(
    null,
    { profileOpenAvatarEditDialog }
)(AvatarEditor);
