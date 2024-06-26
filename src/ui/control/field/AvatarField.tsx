import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useField } from 'formik';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { AvatarInfo } from "api";
import { ClientState } from "state/state";
import { homeAvatarsLoad } from "state/home/actions";
import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import { useButtonPopper } from "ui/hook";
import { Avatar, Loading, useModalDialog } from "ui/control";
import "./AvatarField.css";

interface Props {
    name: string;
    size: number;
    disabled?: boolean;
}

export function AvatarField({name, size, disabled}: Props) {
    const avatarsLoading = useSelector((state: ClientState) => state.home.avatars.loading);
    const avatarsLoaded = useSelector((state: ClientState) => state.home.avatars.loaded);
    const avatars = useSelector((state: ClientState) => state.home.avatars.avatars);
    const avatarDefault = useSelector(getHomeOwnerAvatar);
    const homeOwnerName = useSelector(getHomeOwnerName);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [, {value}, {setValue}] = useField<AvatarInfo | null>(name);

    const {overlayId: parentOverlayId} = useModalDialog();
    const {
        visible, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles,
        placement, zIndex
    } = useButtonPopper("bottom-start", {parentOverlayId});

    const onClick = (event: React.MouseEvent) => {
        if (disabled) {
            return;
        }
        if (!avatarsLoaded && !avatarsLoading) {
            dispatch(homeAvatarsLoad());
        }
        if (value || avatarDefault) {
            onToggle(event);
        }
    };

    const onSelect = (avatar: AvatarInfo) => () => setValue(avatar);

    return (
        <div className={cx("avatar-field", {"disabled": !value && !avatarDefault})}>
            <div ref={setButtonRef} aria-label={t("select")} onClick={onClick}>
                <div className="icon"><FontAwesomeIcon icon={faChevronDown}/></div>
                <Avatar avatar={value} ownerName={homeOwnerName} size={size}/>
            </div>
            {visible &&
                <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                     className={`fade popover shadow-sm bs-popover-${placement} show`}>
                    <div className="selector">
                        {avatarsLoaded ?
                            avatars.map(avatar =>
                                <div key={avatar.id}
                                     className={cx("item", {"active": value && avatar.mediaId === value.mediaId})}>
                                    <Avatar avatar={avatar} ownerName={homeOwnerName} size={100} shape="design"
                                            onClick={onSelect(avatar)}/>
                                </div>
                            )
                        :
                            (avatarsLoading ? <Loading/> : null)
                        }
                    </div>
                    <div ref={setArrowRef} style={arrowStyles} className="popover-arrow"/>
                </div>
            }
        </div>
    );
}
