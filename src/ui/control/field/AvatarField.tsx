import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useField } from 'formik';
import cx from 'classnames';

import { AvatarInfo } from "api";
import { ClientState } from "state/state";
import { homeAvatarsLoad } from "state/home/actions";
import { getHomeOwnerAvatar, getHomeOwnerName } from "state/home/selectors";
import { useButtonPopper } from "ui/hook";
import { Avatar } from "ui/control/Avatar";
import { Loading } from "ui/control/Loading";
import "./AvatarField.css";

type Props = {
    name: string;
    size: number;
} & ConnectedProps<typeof connector>;

function AvatarFieldImpl({name, size, avatarsLoading, avatarsLoaded, avatars, avatarDefault, homeOwnerName,
                          homeAvatarsLoad}: Props) {
    const [, {value}, {setValue}] = useField<AvatarInfo | null>(name);

    const {
        visible, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles,
        placement
    } = useButtonPopper("bottom-start");

    const onClick = (event: React.MouseEvent) => {
        if (!avatarsLoaded && !avatarsLoading) {
            homeAvatarsLoad();
        }
        if (value || avatarDefault) {
            onToggle(event);
        }
    };

    const onSelect = (avatar: AvatarInfo) => () => setValue(avatar);

    return (
        <div className={cx("avatar-field", {"disabled": !value && !avatarDefault})}>
            <div ref={setButtonRef} onClick={onClick}>
                <div className="icon"><FontAwesomeIcon icon="chevron-down"/></div>
                <Avatar avatar={value} ownerName={homeOwnerName} size={size}/>
            </div>
            {visible &&
                <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
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
                            <Loading active={avatarsLoading}/>
                        }
                    </div>
                    <div ref={setArrowRef} style={arrowStyles} className="popover-arrow"/>
                </div>
            }
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        avatarsLoading: state.home.avatars.loading,
        avatarsLoaded: state.home.avatars.loaded,
        avatars: state.home.avatars.avatars,
        avatarDefault: getHomeOwnerAvatar(state),
        homeOwnerName: getHomeOwnerName(state)
    }),
    { homeAvatarsLoad }
);

export const AvatarField = connector(AvatarFieldImpl);
