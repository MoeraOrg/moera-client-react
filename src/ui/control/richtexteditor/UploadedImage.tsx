import React from 'react';
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { VerifiedMediaFile } from "api";
import { openImageEditDialog } from "state/imageeditdialog/actions";
import { DropdownMenu } from "ui/control";
import AttachedImage from "ui/control/richtexteditor/AttachedImage";
import "./UploadedImage.css";

interface Props {
    media: VerifiedMediaFile;
    nodeName: string | null;
    dragged?: boolean | null;
    showMenu?: boolean | null;
    onDelete?: () => void;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

export default function UploadedImage({media, nodeName, dragged = false, showMenu = true, onDelete, onClick}: Props) {
    const sortable = useSortable({id: media.id});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition ?? undefined,
    };
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return (
        <div className={cx("rich-text-editor-uploaded-image", {"dragged": dragged})}>
            {showMenu &&
                <DropdownMenu items={[
                    {
                        title: t("edit-ellipsis"),
                        nodeName: "",
                        href: null,
                        onClick: () => dispatch(openImageEditDialog(nodeName, media)),
                        show: media.postingId != null
                    },
                    {
                        divider: true
                    },
                    {
                        title: t("delete"),
                        nodeName: "",
                        href: null,
                        onClick: onDelete!,
                        show: onDelete != null
                    }
                ]}>
                    <span className="fa-layers fa-fw">
                        <FontAwesomeIcon icon={faChevronDown} color="white"/>
                        <FontAwesomeIcon icon={faChevronCircleDown}/>
                    </span>
                </DropdownMenu>
            }
            <div ref={sortable.setNodeRef} style={sortableStyle}{...sortable.attributes} {...sortable.listeners}>
                <AttachedImage media={media} nodeName={nodeName} onClick={onClick}/>
            </div>
        </div>
    );
}
