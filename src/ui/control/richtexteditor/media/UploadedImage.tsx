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
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import AttachedImage from "ui/control/richtexteditor/media/AttachedImage";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import "./UploadedImage.css";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";

interface Props {
    media: VerifiedMediaFile;
    nodeName: RelNodeName | string;
    dragged?: boolean | null;
    showMenu?: boolean | null;
}

export default function UploadedImage({media, nodeName, dragged = false, showMenu = true}: Props) {
    const sortable = useSortable({id: media.id});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition ?? undefined,
    };
    const {deleteImage} = useRichTextEditorMedia();
    const {embedImage} = useRichTextEditorCommands();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const {overlayId: parentOverlayId} = useModalDialog();

    const onEdit = () => {
        if (!dragged) {
            dispatch(openImageEditDialog(nodeName, media, parentOverlayId));
        }
    }

    return (
        <div className={cx("rich-text-editor-uploaded-image", {"dragged": dragged})}>
            {showMenu &&
                <DropdownMenu items={[
                    {
                        title: t("edit"),
                        nodeName: REL_CURRENT,
                        href: "/",
                        onClick: onEdit,
                        show: media.postingId != null
                    },
                    {
                        title: t("insert-into-text"),
                        nodeName: REL_CURRENT,
                        href: "/",
                        onClick: () => embedImage(media),
                        show: true
                    },
                    {
                        divider: true
                    },
                    {
                        title: t("delete"),
                        nodeName: REL_CURRENT,
                        href: "/",
                        onClick: () => deleteImage(media.id),
                        show: true
                    }
                ]}>
                    <Icon icon={msMoreVert} width={12} height={12}/>
                </DropdownMenu>
            }
            <div ref={sortable.setNodeRef} style={sortableStyle}{...sortable.attributes} {...sortable.listeners}>
                <AttachedImage media={media} nodeName={nodeName} onClick={onEdit}/>
            </div>
        </div>
    );
}
