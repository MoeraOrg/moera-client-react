import React from 'react';

import { MediaAttachment } from "api";
import EntryFile from "ui/entry/EntryFile";
import { RelNodeName } from "util/rel-node-name";
import "./EntryAttachments.css";

interface Props {
    nodeName: string | RelNodeName;
    media: MediaAttachment[] | null;
}

export default function EntryAttachments({nodeName, media}: Props) {
    if (media == null || media.length === 0) {
        return null;
    }

    const files = media
        .filter(ma => ma.media?.attachment ?? ma.remoteMedia?.attachment)
        .filter(ma => ma.media || ma.remoteMedia?.nodeName);
    if (files.length === 0) {
        return null;
    }

    return (
        <div>
            {files.map((file, index) =>
                <EntryFile
                    key={index}
                    nodeName={nodeName}
                    mediaFile={file.media ?? null}
                    remoteMedia={file.remoteMedia ?? null}
                />
            )}
        </div>
    );
}
