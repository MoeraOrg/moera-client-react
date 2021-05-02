import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Avatar } from "ui/control";

export default function AvatarSelectorItem({avatar, rootPage, onSelect, onDelete}) {
    const sortable = useSortable({id: avatar.id});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
    };

    const onClick = useCallback(() => onSelect(avatar), [onSelect, avatar]);
    const onDeleteClick = useCallback(() => onDelete(avatar.id), [onDelete, avatar]);

    return (
        <div ref={sortable.setNodeRef} style={sortableStyle} {...sortable.attributes} {...sortable.listeners}>
            {onDelete &&
                <div className="delete" title="Delete" onClick={onDeleteClick}>
                    <FontAwesomeIcon icon="times-circle"/>
                </div>
            }
            <Avatar avatar={avatar} size={100} draggable={false} rootPage={rootPage} onClick={onClick}/>
        </div>
    );
}
