import React from 'react';

import { PrivateMediaFileInfo, RemoteMediaInfo } from "api";
import { useIsTinyScreen } from "ui/hook";
import { useMediaPreviewAttributes } from "ui/entry/media";
import ImagePlaceholder from "ui/entry/ImagePlaceholder";
import PreloadedImage from "ui/entry/PreloadedImage";
import { RelNodeName } from "util/rel-node-name";
import { LeasedRemoteMediaInfo } from "util/media-with-caption";
import "./EntryLinkPreviewImage.css";

interface Props {
    nodeName: RelNodeName | string;
    mediaFile: PrivateMediaFileInfo | null;
    remoteMedia: RemoteMediaInfo | LeasedRemoteMediaInfo | null;
}

export default function EntryLinkPreviewImage({nodeName, mediaFile, remoteMedia}: Props) {
    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt
    } = useMediaPreviewAttributes(nodeName, mediaFile, remoteMedia);
    const tinyScreen = useIsTinyScreen();

    if (mediaFile == null && remoteMedia == null) {
        return null;
    }

    const vertical = tinyScreen ? imageHeight > imageWidth * 0.55 : imageHeight > imageWidth;

    return (
        src != null ?
            <PreloadedImage src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight} alt={alt}
                            className={vertical ? "vertical" : undefined}/>
        :
            <ImagePlaceholder width={imageWidth} height={imageHeight}/>
    );
}
