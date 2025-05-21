import React from 'react';
import cx from 'classnames';

import { AvatarImage, NodeName } from "api";
import { Avatar } from "ui/control/Avatar";
import "./NameSuggestion.css";

interface Props {
    className?: string;
    index: number;
    nodeName?: string | null;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    onClick?: (index: number) => void;
}

export const NameSuggestion = ({className, index, nodeName, fullName, avatar, onClick}: Props) => (
    <div data-index={index} className={cx("name-suggestion", className)} onClick={() => onClick && onClick(index)}>
        <div className="avatar-cell">
            <Avatar avatar={avatar} ownerName={nodeName} size={40}/>
        </div>
        <div className="body">
            <span className="full-name">{fullName || NodeName.shorten(nodeName)}</span><br/>
            <span className="name">{NodeName.shorten(nodeName)}</span>
        </div>
    </div>
);
