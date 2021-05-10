import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Avatar } from "ui/control";

export default function AvatarSelectorItem({avatar, onSelect, onDelete}) {
    const sortable = useSortable({id: avatar.id});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
    };

    const onClick = () => onSelect(avatar);
    const onDeleteClick = () => onDelete(avatar.id);

    return (
        <>
            {onDelete &&
                <div className="delete" title="Delete" onClick={onDeleteClick}>
                    <span className="fa-layers fa-fw">
                        <FontAwesomeIcon icon="times" color="white"/>
                        <FontAwesomeIcon icon="times-circle"/>
                    </span>
                </div>
            }
            <div ref={sortable.setNodeRef} style={sortableStyle} {...sortable.attributes} {...sortable.listeners}>
                <Avatar avatar={avatar} size={100} shape="design" draggable={false} onClick={onClick}/>
            </div>
        </>
    );
}
