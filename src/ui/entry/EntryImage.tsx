import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';

import { PrivateMediaFileInfo } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { openLightBox } from "state/lightbox/actions";
import Jump from "ui/navigation/Jump";
import PreloadedImage from "ui/posting/PreloadedImage";
import { mediaImageTagAttributes } from "util/media-images";
import { RelNodeName } from "util/rel-node-name";
import { urlWithParameters, ut } from "util/url";
import "./EntryImage.css";

interface Props {
    postingId?: string | null;
    commentId?: string | null;
    nodeName: RelNodeName | string;
    mediaFile: PrivateMediaFileInfo;
    width?: string | null;
    height?: string | null;
    alt?: string | null;
    title?: string | null;
    flex?: "row" | "column";
    count?: number;
}

export default function EntryImage({
    postingId, commentId, nodeName, mediaFile, width, height, alt, title, flex, count
}: Props) {
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, nodeName));
    const carte = useSelector(getCurrentViewMediaCarte);
    const dispatch = useDispatch();

    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight, alt: imageAlt
    } = mediaImageTagAttributes(rootPage, mediaFile, carte, 900, width, height);

    const onNear = () => {
        if (postingId != null) {
            dispatch(openLightBox(nodeName, postingId, commentId ?? null, mediaFile.id));
        }
    }

    const href = urlWithParameters(ut`/post/${postingId}`, {commentId, media: mediaFile.id});

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
            <PreloadedImage src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight}
                            alt={alt ?? imageAlt ?? undefined} title={title ?? undefined}/>
        </Jump>
    );
}
