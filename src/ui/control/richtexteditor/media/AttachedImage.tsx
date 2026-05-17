import React from 'react';

import { useMediaAttributes } from "ui/entry/media";
import ImagePlaceholder from "ui/entry/ImagePlaceholder";
import { MediaWithCaption } from "util/media-with-caption";
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
    } = useMediaAttributes(nodeName, media.media ?? null, media.remoteMedia ?? null, 150, 150);

    const cursor: React.CSSProperties["cursor"] = dragging ? "grabbing" : (onClick ? "pointer" : "default");

    return (
        src != null ?
            <img className="thumbnail" alt={alt ?? ""} src={src} srcSet={srcSet} sizes={sizes}
                 width={imageWidth} height={imageHeight} draggable={false} style={{cursor}} onClick={onClick}/>
        :
            <ImagePlaceholder width={imageWidth} height={imageHeight}/>
    );
}
