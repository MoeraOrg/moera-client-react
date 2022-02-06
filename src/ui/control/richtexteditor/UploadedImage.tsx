import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { RichTextMedia } from "state/richtexteditor/actions";
import { openImageEditDialog } from "state/imageeditdialog/actions";
import { DropdownMenu } from "ui/control";
import AttachedImage from "ui/control/richtexteditor/AttachedImage";
import "./UploadedImage.css";

interface OwnProps {
    media: RichTextMedia;
    nodeName: string | null;
    dragged?: boolean | null;
    showMenu?: boolean | null;
    onDelete?: () => void;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function UploadedImage({media, nodeName, dragged = false, showMenu = true, onDelete, onClick,
                        openImageEditDialog}: Props) {
    const sortable = useSortable({id: media.id});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition ?? undefined,
    };

    return (
        <div className={cx("rich-text-editor-uploaded-image", {"dragged": dragged})}>
            {showMenu &&
                <DropdownMenu items={[
                    {
                        title: "Edit...",
                        href: null,
                        onClick: () => openImageEditDialog(nodeName, media),
                        show: media.postingId != null
                    },
                    {
                        divider: true
                    },
                    {
                        title: "Delete",
                        href: null,
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
                <AttachedImage media={media} nodeName={nodeName} onClick={onClick}/>
            </div>
        </div>
    );
}

const connector = connect(
    null,
    { openImageEditDialog }
);

export default connector(UploadedImage);
