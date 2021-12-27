import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { RichTextMedia } from "state/richtexteditor/actions";
import { DeleteButton } from "ui/control";
import AttachedImage from "ui/control/richtexteditor/AttachedImage";

interface Props {
    media: RichTextMedia;
    rootPage: string | null;
    onDeleteClick?: React.MouseEventHandler;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

export default function UploadedImage({media, rootPage, onDeleteClick, onClick}: Props) {
    const sortable = useSortable({id: media.id});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition ?? undefined,
    };

    return (
        <div className="rich-text-editor-uploaded-image" key={media.id}>
            <DeleteButton onClick={onDeleteClick}/>
            <div ref={sortable.setNodeRef} style={sortableStyle}{...sortable.attributes} {...sortable.listeners}>
                <AttachedImage media={media} rootPage={rootPage} onClick={onClick}/>
            </div>
        </div>
    );
}

