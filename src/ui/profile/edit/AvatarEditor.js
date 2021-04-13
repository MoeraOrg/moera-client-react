import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Avatar } from "ui/control";
import "./AvatarEditor.css";

const AvatarEditor = ({avatar, rootPage}) => (
    <div className="avatar-editor">
        <div className="icon"><FontAwesomeIcon icon="pen"/></div>
        <Avatar avatar={avatar} rootPage={rootPage}/>
    </div>
);

export default AvatarEditor;
