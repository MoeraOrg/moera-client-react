import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useField } from 'formik';
import cx from 'classnames';

import { homeAvatarsLoad } from "state/home/actions";
import { useButtonPopper } from "ui/hook";
import { Avatar } from "ui/control/Avatar";
import { Loading } from "ui/control/Loading";
import "./AvatarField.css";

function AvatarFieldImpl({name, size, avatarsLoading, avatarsLoaded, avatars, homeAvatarsLoad}) {
    const [, {value}, {setValue}] = useField(name);

    const {
        visible, onToggle, setButtonRef, setPopperRef, setArrowRef, popperStyles, popperAttributes, arrowStyles
    } = useButtonPopper("bottom-start");

    const onClick = event => {
        if (!avatarsLoaded && !avatarsLoading) {
            homeAvatarsLoad();
        }
        if (value) {
            onToggle(event);
        }
    };

    const onSelect = avatar => () => setValue(avatar);

    return (
        <div className={cx("avatar-field", {"disabled": !value})}>
            <div ref={setButtonRef} onClick={onClick}>
                <div className="icon"><FontAwesomeIcon icon="chevron-down"/></div>
                <Avatar avatar={value} size={size}/>
            </div>
            {visible &&
                <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                     className="fade popover shadow-sm show">
                    <div className="selector">
                        {avatarsLoaded ?
                            avatars.map(avatar =>
                                <div key={avatar.id}
                                     className={cx("item", {"active": value && avatar.mediaId === value.mediaId})}>
                                    <Avatar avatar={avatar} size={100} shape="design" onClick={onSelect(avatar)}/>
                                </div>
                            )
                        :
                            <Loading active={avatarsLoading}/>
                        }
                    </div>
                    <div ref={setArrowRef} style={arrowStyles} className="arrow"/>
                </div>
            }
        </div>
    );
}

export const AvatarField = connect(
    state => ({
        avatarsLoading: state.home.avatars.loading,
        avatarsLoaded: state.home.avatars.loaded,
        avatars: state.home.avatars.avatars
    }),
    { homeAvatarsLoad }
)(AvatarFieldImpl);
