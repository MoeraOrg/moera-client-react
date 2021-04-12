import React from 'react';

import avatarPlaceholder from "./avatar.png";
import "./Avatar.css";

export const Avatar = () => (
    <img src={avatarPlaceholder} alt="Avatar placeholder" className="avatar" width={200} height={200}/>
);
