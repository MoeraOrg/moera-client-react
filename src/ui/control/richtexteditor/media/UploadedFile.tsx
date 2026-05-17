import React from 'react';
import { useSelector } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { getHomeOwnerName } from "state/home/selectors";
import { isAtHomeNode } from "state/node/selectors";
import { DropdownMenu } from "ui/control";
import { useRichTextEditorMedia } from "ui/control/richtexteditor/media/rich-text-editor-media-context";
import { formatFileSize } from "util/info-quantity";
import { MediaWithCaption } from "util/media-with-caption";
import { mediaFileName } from "util/media-images";
import { REL_CURRENT } from "util/rel-node-name";

interface Props {
    media: MediaWithCaption;
    dragged?: boolean | null;
}

export default function UploadedFile({media, dragged = false}: Props) {
    const atHomeNode = useSelector(isAtHomeNode);
    const homeOwnerName = useSelector(getHomeOwnerName);

    const sortable = useSortable({id: media.mediaId ?? ""});
    const sortableStyle = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition ?? undefined,
    };
    const {deleteMedia, renameMedia} = useRichTextEditorMedia();
    const {t} = useTranslation();

    const onRename = () => {
        if (!dragged && media.mediaId != null) {
            renameMedia(media.mediaId, media.title ?? "");
        }
    }

    const fileName = mediaFileName(media);
    const fileLabel = media.size != null ? `${fileName}, ${formatFileSize(media.size)}` : fileName;

    return (
        <div className={cx("attached-file", {"dragged": dragged})} ref={sortable.setNodeRef}
             style={sortableStyle} {...sortable.attributes} {...sortable.listeners}>
            <DropdownMenu items={[
                {
                    title: t("rename"),
                    nodeName: REL_CURRENT,
                    href: "/",
                    onClick: onRename,
                    show: (atHomeNode && media.media != null) || media.remoteMedia?.nodeName === homeOwnerName
                },
                {
                    divider: true
                },
                {
                    title: t("delete"),
                    nodeName: REL_CURRENT,
                    href: "/",
                    onClick: () => media.mediaId && deleteMedia(media.mediaId),
                    show: true
                }
            ]} menuContainer={document.getElementById("modal-root")} disabled={dragged ?? false}/>
            <div className="file-name" onClick={onRename}>{fileLabel}</div>
        </div>
    );
}
