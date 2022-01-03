import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { MediaFilePreviewInfo, PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeRootPage } from "state/node/selectors";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { openLightBox } from "state/lightbox/actions";
import Jump from "ui/navigation/Jump";
import PreloadedImage from "ui/posting/PreloadedImage";
import { mediaImageFindLargerPreview, mediaImagePreview, mediaImageSize } from "util/media-images";
import { ut } from "util/url";
import "./EntryImage.css";

function mediaSources(location: string, previews: MediaFilePreviewInfo[] | null | undefined): string {
    if (previews == null) {
        return "";
    }
    return previews.map(preview => {
        const url = preview.original ? location : mediaImagePreview(location, preview.targetWidth);
        return `${url} ${preview.width}w`;
    }).join(",");
}

function mediaSizes(previews: MediaFilePreviewInfo[] | null | undefined): string {
    const mobile = Math.min(350, mediaImageFindLargerPreview(previews, 350)?.width ?? 350);
    const regular = Math.min(900, mediaImageFindLargerPreview(previews, 900)?.width ?? 900);
    return `(max-width: 400px) ${mobile}px, ${regular}px`;
}

interface OwnProps {
    postingId?: string | null;
    commentId?: string | null;
    nodeName: string | null
    mediaFile: PrivateMediaFileInfo;
    width?: string | null;
    height?: string | null;
    alt?: string | null;
    title?: string | null;
    flex?: "row" | "column";
    count?: number;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function EntryImage({postingId, commentId, nodeName, mediaFile, width, height, alt, title, flex, count, rootPage,
                     openLightBox}: Props) {
    const mediaLocation = rootPage + "/media/" + mediaFile.path;
    const src = mediaImagePreview(mediaLocation, 900);
    const srcSet = mediaSources(mediaLocation, mediaFile.previews);
    const sizes = mediaSizes(mediaFile.previews ?? []);
    const [imageWidth, imageHeight] = mediaImageSize(900, width, height, mediaFile);

    const onNear = () => {
        if (postingId != null) {
            openLightBox(nodeName ?? "", postingId, commentId ?? null, mediaFile.id);
        }
    }

    const href = ut`/post/${postingId}?${commentId != null ? `commentId=${commentId}&` : ""}media=${mediaFile.id}`;

    let style: React.CSSProperties | undefined = undefined;
    if (flex === "row") {
        style = {flex: imageWidth / imageHeight};
    } else if (flex === "column") {
        style = {flex: imageHeight / imageWidth};
    }

    return (
        <Jump href={href} onNear={onNear} className={cx("entry-image", {"counted": count != null && count > 0})}
              style={style}>
            {(count != null && count > 0) && <div className="count">+{count}</div>}
            <PreloadedImage src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight}
                 alt={alt ?? undefined} title={title ?? undefined}/>
        </Jump>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        rootPage: props.nodeName ? getNamingNameNodeUri(state, props.nodeName) : getNodeRootPage(state)
    }),
    { openLightBox }
);

export default connector(EntryImage);
