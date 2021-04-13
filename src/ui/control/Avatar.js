import React from 'react';
import cx from 'classnames';

import avatarPlaceholder from "./avatar.png";
import "./Avatar.css";

export const Avatar = ({avatar, rootPage}) => (
    avatar ?
        <img src={`${rootPage}/media/${avatar.path}`} alt="Avatar" className={cx("avatar", `avatar-${avatar.shape}`)}
             width={avatar.width} height={avatar.height}/>
    :
        <img src={avatarPlaceholder} alt="Avatar placeholder" className="avatar avatar-circle"
             width={200} height={200}/>
);
