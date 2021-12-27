import React from 'react';

import { RichTextMedia } from "state/richtexteditor/actions";
import { mediaImagePreview, mediaImageSize } from "util/media-images";

interface Props {
    media: RichTextMedia;
    rootPage: string | null;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

export default function AttachedImage({media, rootPage, onClick}: Props) {
    const src = mediaImagePreview(rootPage + "/media/" + media.path, 150);
    const [imageWidth, imageHeight] = mediaImageSize(150, 150, 150, media);

    return (
        <img className="rich-text-editor-uploaded-image-thumbnail" alt="" src={src}
             width={imageWidth} height={imageHeight} draggable={false} onClick={onClick}/>
    );
}
