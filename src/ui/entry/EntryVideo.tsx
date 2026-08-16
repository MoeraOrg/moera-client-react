import React from 'react';
import cx from 'classnames';

import { PrivateMediaFileInfo, RemoteMediaInfo } from "api";
import { VideoPlayer } from "ui/control";
import { useMediaPreviewAttributes, useMediaPath } from "ui/entry/media";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    nodeName: RelNodeName | string;
    mediaFile: PrivateMediaFileInfo | null;
    remoteMedia: RemoteMediaInfo | null;
    className?: string;
}

export default function EntryVideo({nodeName, mediaFile, remoteMedia, className}: Props) {
    const src = useMediaPath(nodeName, mediaFile, remoteMedia);
    const {src: posterSrc} = useMediaPreviewAttributes(nodeName, mediaFile, remoteMedia);

    return (
        <div className={cx(className, "entry-video")}>
            <VideoPlayer
                className="entry-video-player"
                src={src}
                poster={posterSrc ?? undefined}
            />
        </div>
    );
}
