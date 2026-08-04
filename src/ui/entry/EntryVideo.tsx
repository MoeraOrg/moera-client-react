import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { createPlayer } from '@videojs/react';
import { MinimalVideoSkin, Video, videoFeatures } from '@videojs/react/video';
import '@videojs/react/video/minimal-skin.css';

import { PrivateMediaFileInfo, RemoteMediaInfo } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getRemoteMedia } from "state/remotemedia/selectors";
import { RelNodeName } from "util/rel-node-name";
import { resolveMediaUrl } from "util/media-url";

const Player = createPlayer({features: videoFeatures});

interface Props {
    nodeName: RelNodeName | string;
    mediaFile: PrivateMediaFileInfo | null;
    remoteMedia: RemoteMediaInfo | null;
    className?: string;
}

export default function EntryVideo({nodeName, mediaFile, remoteMedia, className}: Props) {
    const actualNodeName = (mediaFile != null ? nodeName : remoteMedia?.nodeName) ?? nodeName;
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, actualNodeName));
    const remoteMediaFile = useSelector((state: ClientState) =>
        getRemoteMedia(state, remoteMedia?.nodeName, remoteMedia?.mediaId, remoteMedia?.digest)
    );
    const actualMediaFile = mediaFile ?? remoteMediaFile;
    const path = actualMediaFile?.directPath ?? actualMediaFile?.path;

    const src = path != null ? resolveMediaUrl(rootPage, path) : undefined;

    return (
        <div className={cx(className, "entry-video")}>
            <Player.Provider>
                <MinimalVideoSkin className="entry-video-player">
                    <Video src={src} playsInline preload="metadata"/>
                </MinimalVideoSkin>
            </Player.Provider>
        </div>
    );
}
