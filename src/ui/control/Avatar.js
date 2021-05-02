import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import avatarPlaceholder from "./avatar.png";
import "./Avatar.css";

export function Avatar({avatar, size, className, draggable, rootPage, onClick}) {
    const {src, alt, shape} = avatar ? {
        src: `${rootPage}/media/${avatar.path}`,
        alt: "Avatar",
        shape: avatar.shape
    } : {
        src: avatarPlaceholder,
        alt: "Avatar placeholder",
        shape: "circle"
    };

    return (
        <img src={src} alt={alt} width={size} height={size} draggable={draggable} onClick={onClick}
             className={cx("avatar", `avatar-${shape}`, className)}/>
    );
}

Avatar.propTypes = {
    avatar: PropType.shape({
        path: PropType.string,
        shape: PropType.string
    }),
    size: PropType.number,
    className: PropType.string,
    draggable: PropType.bool,
    rootPage: PropType.string,
    onClick: PropType.func
}
Avatar.defaultProps = {
    draggable: true
}
