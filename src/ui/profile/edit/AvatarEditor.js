import React, { useCallback } from 'react';
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
import { getNodeRootPage } from "state/node/selectors";
import { Avatar } from "ui/control";
import AvatarSelector from "ui/profile/edit/AvatarSelector";
import AvatarEditDialog from "ui/profile/edit/AvatarEditDialog";
import "./AvatarEditor.css";

const AvatarEditor = ({name, rootPage, avatarsLoading, avatarsLoaded, avatars, profileAvatarsLoad,
                       profileOpenAvatarEditDialog, profileAvatarConfirmDelete, profileAvatarsReorder}) => {
    const [, {value}, {setValue}] = useField(name);

    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles
    } = useButtonPopper("bottom-start", {hideAlways: false});

    const onSelect = useCallback(
        avatar => setValue(avatar),
        [setValue]
    );
    const onEdit = useCallback(
        event => {
            if (!avatarsLoaded && !avatarsLoading) {
                profileAvatarsLoad();
            }
            if (value) {
                onToggle(event);
            } else {
                profileOpenAvatarEditDialog(onSelect);
            }
        },
        [value, avatarsLoading, avatarsLoaded, profileAvatarsLoad, profileOpenAvatarEditDialog, onSelect, onToggle]
    )
    const onNew = useCallback(
        () => {
            profileOpenAvatarEditDialog(onSelect);
            hide();
        },
        [onSelect, profileOpenAvatarEditDialog, hide]
    );
    const onDeleted = useCallback(
        id => {
            if (value.id === id) {
                setValue(avatars.find(av => av.id !== id) ?? null)
            }
        },
        [value, setValue, avatars]
    );
    const onDelete = useCallback(
        id => profileAvatarConfirmDelete(id, onDeleted),
        [profileAvatarConfirmDelete, onDeleted]
    );
    const onReorder = useCallback(
        (activeId, overId) => profileAvatarsReorder(activeId, overId),
        [profileAvatarsReorder]
    );

    return (
        <>
            <div className="avatar-editor">
                <div ref={setButtonRef} onClick={onEdit}>
                    <div className="icon"><FontAwesomeIcon icon="pen"/></div>
                    <Avatar avatar={value} size={200} rootPage={rootPage}/>
                </div>
                {visible &&
                    <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                         className="fade popover shadow-sm show">
                        <AvatarSelector loading={avatarsLoading} loaded={avatarsLoaded} avatars={avatars} active={value}
                                        rootPage={rootPage} onSelect={onSelect} onNew={onNew} onDelete={onDelete}
                                        onReorder={onReorder}/>
                        <div ref={setArrowRef} style={arrowStyles} className="arrow"/>
                    </div>
                }
            </div>
            <AvatarEditDialog/>
        </>
    );
};

export default connect(
    state => ({
        rootPage: getNodeRootPage(state),
        avatarsLoading: state.profile.avatars.loading,
        avatarsLoaded: state.profile.avatars.loaded,
        avatars: state.profile.avatars.avatars
    }),
    { profileAvatarsLoad, profileOpenAvatarEditDialog, profileAvatarConfirmDelete, profileAvatarsReorder }
)(AvatarEditor);
