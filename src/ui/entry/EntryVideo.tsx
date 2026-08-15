import React from 'react';
import cx from 'classnames';
import { createPlayer } from '@videojs/react';
import { MinimalVideoSkin, Video, videoFeatures } from '@videojs/react/video';
import '@videojs/react/video/minimal-skin.css';

import { PrivateMediaFileInfo, RemoteMediaInfo } from "api";
import { useMediaPreviewAttributes, useMediaPath } from "ui/entry/media";
import { RelNodeName } from "util/rel-node-name";

const Player = createPlayer({features: videoFeatures});

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
            <Player.Provider>
                <MinimalVideoSkin className="entry-video-player">
                    <Video src={src} poster={posterSrc ?? undefined} playsInline preload="metadata"/>
                </MinimalVideoSkin>
            </Player.Provider>
        </div>
    );
}
