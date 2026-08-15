import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MediaAttachment } from "api";
import EntryFile from "ui/entry/EntryFile";
import { RelNodeName } from "util/rel-node-name";
import "./EntryAttachments.css";

interface Props {
    nodeName: string | RelNodeName;
    media: MediaAttachment[] | null;
    limit?: number;
}

export default function EntryAttachments({nodeName, media, limit}: Props) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const {t} = useTranslation();

    if (media == null || media.length === 0) {
        return null;
    }

    const files = media
        .filter(ma => ma.media?.attachment ?? ma.remoteMedia?.attachment)
        .filter(ma => ma.media || ma.remoteMedia?.nodeName);
    if (files.length === 0) {
        return null;
    }

    const onExpand = (e: React.MouseEvent) => {
        setExpanded(expanded => !expanded);
        e.preventDefault();
    };

    const max = expanded ? null : limit;

    return (
        <div>
            {files.map((file, index) =>
                (max == null || index < max) &&
                    <EntryFile
                        key={index}
                        nodeName={nodeName}
                        mediaFile={file.media ?? null}
                        remoteMedia={file.remoteMedia ?? null}
                    />
            )}
            {(limit != null && files.length > limit) &&
                <>
                    <br/>
                    <button className="entry-attachments-expand" onClick={onExpand}>
                        {max != null ? "+" : "-"}{t("count-files", {count: files.length - limit})}
                    </button>
                </>
            }
        </div>
    );
}
