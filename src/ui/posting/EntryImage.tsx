import React, { MouseEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { MediaFilePreviewInfo, PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeRootPage } from "state/node/selectors";
import { openLightBox } from "state/lightbox/actions";
import { mediaImageFindLargerPreview, mediaImagePreview, mediaImageSize } from "util/media-images";

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

type Props = {
    postingId?: string | null;
    mediaFile: PrivateMediaFileInfo;
    width?: string | null;
    height?: string | null;
    alt?: string | null;
    title?: string | null;
} & ConnectedProps<typeof connector>;

function EntryImage({postingId, mediaFile, width, height, alt, title, rootPage, openLightBox}: Props) {
    const mediaLocation = rootPage + "/media/" + mediaFile.path;
    const src = mediaImagePreview(mediaLocation, 900);
    const srcSet = mediaSources(mediaLocation, mediaFile.previews);
    const sizes = mediaSizes(mediaFile.previews ?? []);
    const [imageWidth, imageHeight] = mediaImageSize(900, width, height, mediaFile);

    const onClick = (event: MouseEvent) => {
        if (postingId != null) {
            openLightBox(postingId, mediaFile.id);
            event.preventDefault();
        }
    }

    return (
        <a href={mediaLocation} onClick={onClick}>
            <img src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight}
                 alt={alt ?? undefined} title={title ?? undefined} />
        </a>
    );
}

const connector = connect(
    (state: ClientState) => ({
        rootPage: getNodeRootPage(state)
    }),
    { openLightBox }
);

export default connector(EntryImage);
