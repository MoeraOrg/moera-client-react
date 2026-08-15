import React, { memo } from 'react';
import { RenderElementProps } from 'slate-react';
import deepEqual from 'react-fast-compare';

import { VideoDuration } from "ui/control";
import { useMediaPreviewAttributes } from "ui/entry/media";
import ImagePlaceholder from "ui/entry/ImagePlaceholder";
import PreloadedImage from "ui/entry/PreloadedImage";
import { RelNodeName } from "util/rel-node-name";
import { MediaWithCaption } from "util/media-with-caption";
import { isVideoType } from "util/mime-type";

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
    } = useMediaPreviewAttributes(nodeName, media.localMedia ?? null, media.remoteMedia ?? null, width, height);

    const style: React.CSSProperties = {
        "--width": `${imageWidth}px`,
        "--height": `${imageHeight}px`,
        "--aspect-ratio": `${imageWidth / imageHeight}`
    } as any;

    return (
        <div className="figure-image-attached" {...attributes} contentEditable={false} onClick={onClick} style={style}>
            {children}
            {isVideoType(media.mimeType) &&
                <VideoDuration duration={media.duration}/>
            }
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
