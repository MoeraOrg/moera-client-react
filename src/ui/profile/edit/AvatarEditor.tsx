import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useField } from 'formik';

import { AvatarInfo } from "api/node/api-types";
import { ClientState } from "state/state";
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

type Props = {
    name: string;
} & ConnectedProps<typeof connector>;

function AvatarEditor({name, avatarsLoading, avatarsLoaded, avatars, nodeName, profileAvatarsLoad, profileOpenAvatarEditDialog,
                       profileAvatarConfirmDelete, profileAvatarsReorder}: Props) {
    const [, {value}, {setValue}] = useField<AvatarInfo | null>(name);

    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles,
        placement
    } = useButtonPopper("bottom-start", {hideAlways: false});

    const onSelect = (avatar: AvatarInfo) => setValue(avatar);

    const onEdit = (event: React.MouseEvent) => {
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

    const onDeleted = (id: string) => {
        if (value?.id === id) {
            setValue(avatars.find(av => av.id !== id) ?? null)
        }
    }

    const onDelete = (id: string) => profileAvatarConfirmDelete(id, onDeleted);

    const onReorder = (activeId: string, overId: string) => profileAvatarsReorder(activeId, overId);

    return (
        <>
            <div className="avatar-editor">
                <div ref={setButtonRef} onClick={onEdit}>
                    <div className="icon"><FontAwesomeIcon icon="pen"/></div>
                    <Avatar avatar={value} ownerName={nodeName} size={200}/>
                </div>
                {visible &&
                    <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                         className={`fade popover bs-popover-${placement} shadow-sm show`}>
                        <AvatarSelector nodeName={nodeName} loading={avatarsLoading} loaded={avatarsLoaded}
                                        avatars={avatars} active={value} onSelect={onSelect} onNew={onNew}
                                        onDelete={onDelete} onReorder={onReorder}/>
                        <div ref={setArrowRef} style={arrowStyles} className="popover-arrow"/>
                    </div>
                }
            </div>
            <AvatarEditDialog/>
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        avatarsLoading: state.profile.avatars.loading,
        avatarsLoaded: state.profile.avatars.loaded,
        avatars: state.profile.avatars.avatars,
        nodeName: state.profile.nodeName
    }),
    { profileAvatarsLoad, profileOpenAvatarEditDialog, profileAvatarConfirmDelete, profileAvatarsReorder }
);

export default connector(AvatarEditor);
