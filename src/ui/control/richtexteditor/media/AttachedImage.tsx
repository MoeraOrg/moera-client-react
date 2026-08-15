import React from 'react';

import { useMediaPreviewAttributes } from "ui/entry/media";
import ImagePlaceholder from "ui/entry/ImagePlaceholder";
import { Icon, msPlayArrowFilled } from "ui/material-symbols";
import { MediaWithCaption } from "util/media-with-caption";
import { isVideoType } from "util/mime-type";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    media: MediaWithCaption;
    nodeName: RelNodeName | string;
    dragging?: boolean;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

export default function AttachedImage({media, nodeName, dragging = false, onClick}: Props) {
    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt
    } = useMediaPreviewAttributes(nodeName, media.media ?? null, media.remoteMedia ?? null, 150, 150);

    const cursor: React.CSSProperties["cursor"] = dragging ? "grabbing" : (onClick ? "pointer" : "default");

    return (
        src != null ?
            <>
                <img className="thumbnail" alt={alt ?? ""} src={src} srcSet={srcSet} sizes={sizes}
                     width={imageWidth} height={imageHeight} draggable={false} style={{cursor}} onClick={onClick}/>
                {isVideoType(media.media?.mimeType) &&
                    <div className="play-icon"><Icon icon={msPlayArrowFilled} size={48}/></div>
                }
            </>
        :
            <ImagePlaceholder width={imageWidth} height={imageHeight}/>
    );
}
