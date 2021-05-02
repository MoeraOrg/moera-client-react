import React, { useCallback } from 'react';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Avatar } from "ui/control";
import "./AvatarSelectorItem.css";

export default function AvatarSelectorItem({avatar, active, rootPage, onSelect, onDelete}) {
    const onClick = useCallback(() => onSelect(avatar), [onSelect, avatar]);
    const onDeleteClick = useCallback(() => onDelete(avatar.id), [onDelete, avatar]);
    return (
        <div className={cx("item", {"active": active && avatar.id === active.id})}>
            <div className="delete" title="Delete" onClick={onDeleteClick}>
                <FontAwesomeIcon icon="times-circle"/>
            </div>
            <Avatar avatar={avatar} size={100} rootPage={rootPage} onClick={onClick}/>
        </div>
    );
}
