import React, { memo } from 'react';
import { RenderElementProps } from 'slate-react';
import deepEqual from 'react-fast-compare';

import { useMediaAttributes } from "ui/entry/media";
import ImagePlaceholder from "ui/entry/ImagePlaceholder";
import PreloadedImage from "ui/entry/PreloadedImage";
import { RelNodeName } from "util/rel-node-name";
import { MediaWithCaption } from "util/media-with-caption";

interface Props {
    attributes: RenderElementProps["attributes"];
    media: MediaWithCaption;
    nodeName: RelNodeName | string;
    width: number | null;
    height: number | null;
    onClick: () => any;
    children: any;
}

function VisualRenderImageImpl({attributes, media, nodeName, width, height, onClick, children}: Props) {
    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt
    } = useMediaAttributes(nodeName, media.localMedia ?? null, media.remoteMedia ?? null, width, height);
    return (
        <span className="image-attached" {...attributes} contentEditable={false} onClick={onClick}>
            {children}
            {src != null ?
                <PreloadedImage src={src} srcSet={srcSet} sizes={sizes}
                                width={imageWidth} height={imageHeight} alt={alt ?? ""}/>
            :
                <ImagePlaceholder width={imageWidth} height={imageHeight}/>
            }
        </span>
    );
}

const VisualRenderImage = memo(VisualRenderImageImpl, deepEqual);

export default VisualRenderImage;
