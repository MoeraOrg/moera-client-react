import React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { VerifiedMediaFile } from "api";
import { DropdownMenu } from "ui/control";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { mediaFileName } from "util/media-images";
import { REL_CURRENT } from "util/rel-node-name";

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
    const {deleteMedia, renameMedia} = useRichTextEditorMedia();
    const {t} = useTranslation();

    const onRename = () => {
        if (!dragged) {
            renameMedia(media.id, media.title ?? "");
        }
    }

    return (
        <div className={cx("attached-file", {"dragged": dragged})} ref={sortable.setNodeRef}
             style={sortableStyle} {...sortable.attributes} {...sortable.listeners}>
            <DropdownMenu items={[
                {
                    title: t("rename"),
                    nodeName: REL_CURRENT,
                    href: "/",
                    onClick: onRename,
                    show: true
                },
                {
                    divider: true
                },
                {
                    title: t("delete"),
                    nodeName: REL_CURRENT,
                    href: "/",
                    onClick: () => deleteMedia(media.id),
                    show: true
                }
            ]} menuContainer={document.getElementById("modal-root")} disabled={dragged ?? false}/>
            <div className="file-name" onClick={onRename}>{mediaFileName(media)}</div>
        </div>
    );
}
