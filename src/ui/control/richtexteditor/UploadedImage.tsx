import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { RichTextMedia } from "state/richtexteditor/actions";
import { DropdownMenu } from "ui/control";
import AttachedImage from "ui/control/richtexteditor/AttachedImage";
import "./UploadedImage.css";

interface Props {
    media: RichTextMedia;
    rootPage: string | null;
    dragged?: boolean | null;
    showMenu?: boolean | null;
    onDelete?: () => void;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

export default function UploadedImage({media, rootPage, dragged = false, showMenu = true, onDelete, onClick}: Props) {
    const sortable = useSortable({id: media.id});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition ?? undefined,
    };

    return (
        <div className={cx("rich-text-editor-uploaded-image", {"dragged": dragged})} key={media.id}>
            {showMenu &&
                <DropdownMenu items={[
                    {
                        title: "Delete",
                        onClick: onDelete!,
                        show: onDelete != null
                    }
                ]}>
                    <span className="fa-layers fa-fw">
                        <FontAwesomeIcon icon="chevron-down" color="white"/>
                        <FontAwesomeIcon icon="chevron-circle-down"/>
                    </span>
                </DropdownMenu>
            }
            <div ref={sortable.setNodeRef} style={sortableStyle}{...sortable.attributes} {...sortable.listeners}>
                <AttachedImage media={media} rootPage={rootPage} onClick={onClick}/>
            </div>
        </div>
    );
}

