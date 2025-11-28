import React from 'react';
import cx from 'classnames';

import { AvatarImage, NodeName } from "api";
import { Avatar } from "ui/control/Avatar";
import Jump from "ui/navigation/Jump";
import "./NameSuggestion.css";

interface Props {
    className?: string;
    index: number;
    nodeName?: string | null;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    onClick?: (index: number) => () => void;
}

export const NameSuggestion = ({className, index, nodeName, fullName, avatar, onClick}: Props) => (
    <Jump
        dataIndex={index}
        className={cx("name-suggestion", className)}
        nodeName={nodeName ?? undefined}
        href="/"
        onNear={onClick ? onClick(index) : undefined}
        onFar={onClick ? onClick(index) : undefined}
    >
        <div className="avatar-cell">
            <Avatar avatar={avatar} ownerName={nodeName} size={40}/>
        </div>
        <div className="body">
            <span className="full-name">{fullName || NodeName.shorten(nodeName)}</span><br/>
            <span className="name">{NodeName.shorten(nodeName)}</span>
        </div>
    </Jump>
);
