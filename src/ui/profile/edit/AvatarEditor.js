import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useField } from 'formik';

import { useButtonPopper } from "ui/hook";
import {
    profileAvatarConfirmDelete,
    profileAvatarsLoad,
    profileAvatarsReorder,
    profileOpenAvatarEditDialog
} from "state/profile/actions";
import { Avatar } from "ui/control";
import AvatarSelector from "ui/profile/edit/AvatarSelector";
import AvatarEditDialog from "ui/profile/edit/AvatarEditDialog";
import "./AvatarEditor.css";

function AvatarEditor({name, avatarsLoading, avatarsLoaded, avatars, profileAvatarsLoad, profileOpenAvatarEditDialog,
                       profileAvatarConfirmDelete, profileAvatarsReorder}) {
    const [, {value}, {setValue}] = useField(name);

    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles,
        placement
    } = useButtonPopper("bottom-start", {hideAlways: false});

    const onSelect = avatar => setValue(avatar);

    const onEdit = event => {
        if (!avatarsLoaded && !avatarsLoading) {
            profileAvatarsLoad();
        }
        if (value) {
            onToggle(event);
        } else {
            profileOpenAvatarEditDialog(onSelect);
        }
    };

    const onNew = () => {
        profileOpenAvatarEditDialog(onSelect);
        hide();
    };

    const onDeleted = id => {
        if (value.id === id) {
            setValue(avatars.find(av => av.id !== id) ?? null)
        }
    }

    const onDelete = id => profileAvatarConfirmDelete(id, onDeleted);

    const onReorder = (activeId, overId) => profileAvatarsReorder(activeId, overId);

    return (
        <>
            <div className="avatar-editor">
                <div ref={setButtonRef} onClick={onEdit}>
                    <div className="icon"><FontAwesomeIcon icon="pen"/></div>
                    <Avatar avatar={value} size={200}/>
                </div>
                {visible &&
                    <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                         className={`fade popover bs-popover-${placement} shadow-sm show`}>
                        <AvatarSelector loading={avatarsLoading} loaded={avatarsLoaded} avatars={avatars} active={value}
                                        onSelect={onSelect} onNew={onNew} onDelete={onDelete} onReorder={onReorder}/>
                        <div ref={setArrowRef} style={arrowStyles} className="arrow"/>
                    </div>
                }
            </div>
            <AvatarEditDialog/>
        </>
    );
}

export default connect(
    state => ({
        avatarsLoading: state.profile.avatars.loading,
        avatarsLoaded: state.profile.avatars.loaded,
        avatars: state.profile.avatars.avatars
    }),
    { profileAvatarsLoad, profileOpenAvatarEditDialog, profileAvatarConfirmDelete, profileAvatarsReorder }
)(AvatarEditor);
