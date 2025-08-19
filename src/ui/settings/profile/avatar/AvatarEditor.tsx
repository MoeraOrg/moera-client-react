import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useField } from 'formik';

import { AvatarInfo } from "api";
import { ClientState } from "state/state";
import { getOwnerName } from "state/node/selectors";
import {
    profileAvatarConfirmDelete,
    profileAvatarsLoad,
    profileAvatarsReorder,
    profileOpenAvatarEditDialog
} from "state/profile/actions";
import { useButtonPopper } from "ui/hook";
import { Avatar, Button } from "ui/control";
import { Icon, msEdit } from "ui/material-symbols";
import AvatarSelector from "ui/settings/profile/avatar/AvatarSelector";
import AvatarEditDialog from "ui/settings/profile/avatar/AvatarEditDialog";
import "./AvatarEditor.css";

interface Props {
    name: string;
    onChange?: (avatar: AvatarInfo) => void;
}

export default function AvatarEditor({name, onChange}: Props) {
    const avatarsLoading = useSelector((state: ClientState) => state.profile.avatars.loading);
    const avatarsLoaded = useSelector((state: ClientState) => state.profile.avatars.loaded);
    const avatars = useSelector((state: ClientState) => state.profile.avatars.avatars);
    const nodeName = useSelector(getOwnerName);
    const showAvatarEditDialog = useSelector((state: ClientState) => state.profile.avatarEditDialog.show);
    const dispatch = useDispatch();

    const [, {value}, {setValue}] = useField<AvatarInfo | null>(name);

    const {
        visible, hide, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles,
        placement, zIndex
    } = useButtonPopper("bottom-start", {closeOnSelect: false});

    const onSelect = (avatar: AvatarInfo) => {
        setValue(avatar)
            .then(() => onChange && onChange(avatar));
    }

    const onEdit = (event: React.MouseEvent) => {
        if (!avatarsLoaded && !avatarsLoading) {
            dispatch(profileAvatarsLoad());
        }
        if (value) {
            onToggle(event);
        } else {
            dispatch(profileOpenAvatarEditDialog(onSelect));
        }
    };

    const onNew = () => {
        dispatch(profileOpenAvatarEditDialog(onSelect));
        hide();
    };

    const onDeleted = (id: string) => {
        if (value?.id === id) {
            setValue(avatars.find(av => av.id !== id) ?? null)
        }
    }

    const onDelete = (id: string) => dispatch(profileAvatarConfirmDelete(id, onDeleted));

    const onReorder = (activeId: string, overId: string) => dispatch(profileAvatarsReorder(activeId, overId));

    return (
        <>
            <div className="avatar-editor">
                <div ref={setButtonRef} onClick={onEdit}>
                    <Button variant="silent-round" className="icon"><Icon icon={msEdit} size={20}/></Button>
                    <Avatar avatar={value} ownerName={nodeName} size={200}/>
                </div>
                {visible &&
                    <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                         className={`fade popover bs-popover-${placement} shadow-sm show`}>
                        <AvatarSelector nodeName={nodeName} loading={avatarsLoading} loaded={avatarsLoaded}
                                        avatars={avatars} active={value} onSelect={onSelect} onNew={onNew}
                                        onDelete={onDelete} onReorder={onReorder}/>
                        <div ref={setArrowRef} style={arrowStyles} className="popover-arrow"/>
                    </div>
                }
            </div>
            {showAvatarEditDialog && <AvatarEditDialog/>}
        </>
    );
}
