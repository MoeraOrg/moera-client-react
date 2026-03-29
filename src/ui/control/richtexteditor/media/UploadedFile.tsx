import React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import mime from 'mime';

import { VerifiedMediaFile } from "api";
import { DropdownMenu } from "ui/control";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { REL_CURRENT } from "util/rel-node-name";
import "./UploadedFile.css";

interface Props {
    media: VerifiedMediaFile;
    dragged?: boolean | null;
}

export default function UploadedFile({media, dragged = false}: Props) {
    const sortable = useSortable({id: media.id});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition ?? undefined,
    };
    const {deleteImage} = useRichTextEditorMedia();
    const {t} = useTranslation();

    const fileName = media.title ? media.title + "." + mime.getExtension(media.mimeType) : media.path.split("/").pop();

    return (
        <div className={cx("rich-text-editor-uploaded-file", {"dragged": dragged})} ref={sortable.setNodeRef}
             style={sortableStyle} {...sortable.attributes} {...sortable.listeners}>
            <DropdownMenu items={[
                {
                    title: t("delete"),
                    nodeName: REL_CURRENT,
                    href: "/",
                    onClick: () => deleteImage(media.id),
                    show: true
                }
            ]} menuContainer={document.getElementById("modal-root")} disabled={dragged ?? false}/>
            <div className="file-name">{fileName}</div>
        </div>
    );
}
