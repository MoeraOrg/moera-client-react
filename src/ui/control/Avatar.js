import React from 'react';
import cx from 'classnames';

import avatarPlaceholder from "./avatar.png";
import "./Avatar.css";

export function Avatar({avatar, size, className, rootPage, onClick}) {
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
        <img src={src} alt={alt} width={size} height={size} onClick={onClick}
             className={cx("avatar", `avatar-${shape}`, className)}/>
    );
}
