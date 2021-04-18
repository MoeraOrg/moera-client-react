import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useField } from 'formik';

import { Avatar } from "ui/control";
import AvatarEditDialog from "ui/profile/edit/AvatarEditDialog";
import { profileOpenAvatarEditDialog } from "state/profile/actions";
import "./AvatarEditor.css";

const AvatarEditor = ({name, rootPage, profileOpenAvatarEditDialog}) => {
    const [, {value}, {setValue}] = useField(name);

    const onCreate = useCallback(
        avatar => setValue(avatar),
        [setValue]);
    const onClick = useCallback(
        () => profileOpenAvatarEditDialog(onCreate),
        [profileOpenAvatarEditDialog, onCreate])
    return (
        <>
            <div className="avatar-editor" onClick={onClick}>
                <div className="icon"><FontAwesomeIcon icon="pen"/></div>
                <Avatar avatar={value} rootPage={rootPage}/>
            </div>
            <AvatarEditDialog/>
        </>
    );
};

export default connect(
    null,
    { profileOpenAvatarEditDialog }
)(AvatarEditor);
