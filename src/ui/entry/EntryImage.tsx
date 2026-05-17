import React from 'react';
import cx from 'classnames';

import { PrivateMediaFileInfo, RemoteMediaInfo } from "api";
import { openLightbox } from "state/lightbox/actions";
import { useDispatcher } from "ui/hook";
import Jump from "ui/navigation/Jump";
import { useMediaAttributes } from "ui/entry/media";
import ImagePlaceholder from "ui/entry/ImagePlaceholder";
import PreloadedImage from "ui/entry/PreloadedImage";
import { RelNodeName } from "util/rel-node-name";
import { urlWithParameters, ut } from "util/url";
import "./EntryImage.css";

interface Props {
    postingId?: string | null;
    commentId?: string | null;
    nodeName: RelNodeName | string;
    mediaFile: PrivateMediaFileInfo | null;
    remoteMedia: RemoteMediaInfo | null;
    width?: string | null;
    height?: string | null;
    alt?: string | null;
    title?: string | null;
    flex?: "row" | "column";
    count?: number;
}

export default function EntryImage({
    postingId, commentId, nodeName, mediaFile, remoteMedia, width, height, alt, title, flex, count
}: Props) {
    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt: imageAlt
    } = useMediaAttributes(nodeName, mediaFile, remoteMedia, width, height);
    const dispatch = useDispatcher();

    const mediaId = mediaFile?.id ?? remoteMedia?.mediaId;
    const href = urlWithParameters(ut`/post/${postingId}`, {comment: commentId, media: mediaId});

    const onNear = () => {
        if (postingId != null && mediaId != null) {
            dispatch(openLightbox(nodeName, postingId, commentId ?? null, mediaId));
        }
    }

    let style: React.CSSProperties | undefined = undefined;
    if (flex === "row") {
        style = {flex: imageWidth / imageHeight};
    } else if (flex === "column") {
        style = {flex: imageHeight / imageWidth};
    }

    return (
        <Jump nodeName={nodeName} href={href} onNear={onNear}
              className={cx("entry-image", {"counted": count != null && count > 0})} style={style}>
            {(count != null && count > 0) && <div className="count">+{count}</div>}
            {src != null ?
                <PreloadedImage src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight}
                                alt={alt ?? imageAlt ?? undefined} title={title ?? undefined}/>
            :
                <ImagePlaceholder width={imageWidth} height={imageHeight}/>
            }
        </Jump>
    );
}
