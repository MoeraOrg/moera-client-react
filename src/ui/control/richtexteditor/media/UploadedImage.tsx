import React from 'react';
import { useDispatch } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { VerifiedMediaFile } from "api";
import { openImageEditDialog } from "state/imageeditdialog/actions";
import { Icon, msMoreVert } from "ui/material-symbols";
import { DropdownMenu, useModalDialog } from "ui/control";
import AttachedImage from "ui/control/richtexteditor/media/AttachedImage";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import "./UploadedImage.css";

interface Props {
    media: VerifiedMediaFile;
    nodeName: RelNodeName | string;
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

    const {overlayId: parentOverlayId} = useModalDialog();

    return (
        <div className={cx("rich-text-editor-uploaded-image", {"dragged": dragged})}>
            {showMenu &&
                <DropdownMenu items={[
                    {
                        title: t("edit-ellipsis"),
                        nodeName: REL_CURRENT,
                        href: "/",
                        onClick: () => dispatch(openImageEditDialog(nodeName, media, parentOverlayId)),
                        show: media.postingId != null
                    },
                    {
                        divider: true
                    },
                    {
                        title: t("delete"),
                        nodeName: REL_CURRENT,
                        href: "/",
                        onClick: onDelete!,
                        show: onDelete != null
                    }
                ]}>
                    <Icon icon={msMoreVert} width={12} height={12}/>
                </DropdownMenu>
            }
            <div ref={sortable.setNodeRef} style={sortableStyle}{...sortable.attributes} {...sortable.listeners}>
                <AttachedImage media={media} nodeName={nodeName} onClick={onClick}/>
            </div>
        </div>
    );
}
