import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { AvatarImage, AvatarInfo } from "api";
import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { profileOpenAvatarEditDialog, profileUpdate } from "state/profile/actions";
import { Avatar, Button, Wrapper } from "ui/control";
import "./ProfileAvatar.css";

const AvatarEditDialog = React.lazy(() => import("ui/settings/profile/avatar/AvatarEditDialog"));

interface Props {
    avatar: AvatarImage | null | undefined;
    ownerName: string | null | undefined; // Node that owns the avatar
    size: number;
}

export default function ProfileAvatar({avatar, ownerName, size}: Props) {
    const atHome = useSelector(isAtHomeNode);
    const showAvatarEditDialog = useSelector((state: ClientState) => state.profile.avatarEditDialog.show);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onSelect = (avatar: AvatarInfo) => {
        dispatch(profileUpdate({avatarId: avatar.id}));
    }

    const onNew = () => {
        dispatch(profileOpenAvatarEditDialog(onSelect));
    };

    const newAvatar = atHome && avatar == null;

    return (
        <Wrapper className={cx({"profile-avatar": newAvatar})}>
            <Avatar avatar={avatar} ownerName={ownerName} size={size}/>
            {newAvatar &&
                <Button variant="primary" size="sm" style={{left: (0.7 * size) + "px"}} onClick={onNew}>
                    {t("add-avatar")}
                </Button>
            }
            <Suspense fallback={null}>
                {newAvatar && showAvatarEditDialog && <AvatarEditDialog/>}
            </Suspense>
        </Wrapper>
    );
}
