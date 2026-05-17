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
    caption: string;
    onClick: () => any;
    children: any;
}

function VisualRenderFigureImpl({attributes, media, nodeName, width, height, caption, onClick, children}: Props) {
    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt
    } = useMediaAttributes(nodeName, media.localMedia ?? null, media.remoteMedia ?? null, width, height);
    return (
        <div className="figure-image-attached" {...attributes} contentEditable={false} onClick={onClick}>
            {children}
            <figure>
                {src != null ?
                    <PreloadedImage src={src} srcSet={srcSet} sizes={sizes}
                                    width={imageWidth} height={imageHeight} alt={alt ?? ""}/>
                :
                    <ImagePlaceholder width={imageWidth} height={imageHeight}/>
                }
                <figcaption>{caption}</figcaption>
            </figure>
        </div>
    );
}

const VisualRenderFigure = memo(VisualRenderFigureImpl, deepEqual);

export default VisualRenderFigure;
