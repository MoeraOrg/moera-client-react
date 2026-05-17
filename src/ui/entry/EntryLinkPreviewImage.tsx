import React from 'react';
import { useTranslation } from 'react-i18next';

import { PrivateMediaFileInfo, RemoteMediaInfo } from "api";
import { Loading } from 'ui/control';
import { useIsTinyScreen } from "ui/hook";
import { useMediaAttributes } from "ui/entry/media";
import ImagePlaceholder from "ui/entry/ImagePlaceholder";
import PreloadedImage from "ui/entry/PreloadedImage";
import { RelNodeName } from "util/rel-node-name";
import { LeasedRemoteMediaInfo } from "util/media-with-caption";
import "./EntryLinkPreviewImage.css";

interface Props {
    nodeName: RelNodeName | string;
    mediaFile: PrivateMediaFileInfo | null;
    remoteMedia: RemoteMediaInfo | LeasedRemoteMediaInfo | null;
    loading: boolean;
}

export default function EntryLinkPreviewImage({nodeName, mediaFile, remoteMedia, loading}: Props) {
    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt
    } = useMediaAttributes(nodeName, mediaFile, remoteMedia);
    const tinyScreen = useIsTinyScreen();
    const {t} = useTranslation();

    if (mediaFile == null && remoteMedia == null) {
        if (loading) {
            return <div className="image-loading">{t("loading-preview")} <Loading/></div>;
        }
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
