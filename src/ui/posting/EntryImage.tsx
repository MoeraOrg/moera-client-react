import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { MediaFilePreviewInfo, PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeRootPage } from "state/node/selectors";

function toInt(s: string | null | undefined): number {
    if (s == null) {
        return 0;
    }
    const val = parseInt(s);
    return isFinite(val) ? val : 0;
}

const mediaPreview = (location: string, width: number): string => `${location}?width=${width}`;

function findLargerPreview(previews: MediaFilePreviewInfo[] | null | undefined,
                           width: number): MediaFilePreviewInfo | null {
    if (previews == null) {
        return null;
    }
    let larger: MediaFilePreviewInfo | null = null;
    previews.forEach(preview => {
        if (preview.targetWidth >= width && (larger == null || larger.targetWidth > preview.targetWidth)) {
            larger = preview;
        }
    });
    return larger;
}

function mediaSources(location: string, previews: MediaFilePreviewInfo[] | null | undefined): string {
    if (previews == null) {
        return "";
    }
    return previews.map(preview => {
        const url = preview.original ? location : mediaPreview(location, preview.targetWidth);
        return `${url} ${preview.width}w`;
    }).join(",");
}

function mediaSizes(previews: MediaFilePreviewInfo[] | null | undefined): string {
    const mobile = Math.min(350, findLargerPreview(previews, 350)?.width ?? 350);
    const regular = Math.min(900, findLargerPreview(previews, 900)?.width ?? 900);
    return `(max-width: 400px) ${mobile}px, ${regular}px`;
}

function imageSize(width: string | null | undefined, height: string | null | undefined,
                   mediaFile: PrivateMediaFileInfo): number[] {
    const iwidth = toInt(width);
    const iheight = toInt(height);
    const preview = findLargerPreview(mediaFile.previews, 900);
    const sizeX = preview != null ? preview.width : mediaFile.width;
    const sizeY = preview != null ? preview.height : mediaFile.height;
    let scale: number;
    if (iwidth === 0 && iheight === 0) {
        scale = 1;
    } else {
        const scaleX = iwidth !== 0 ? iwidth / sizeX : 1;
        const scaleY = iheight !== 0 ? iheight / sizeY : 1;
        scale = Math.min(scaleX, scaleY);
    }

    return [Math.round(scale * sizeX), Math.round(scale * sizeY)];
}

type Props = {
    rootPage: string | null;
    mediaFile: PrivateMediaFileInfo;
    width?: string | null;
    height?: string | null;
    alt?: string | null;
    title?: string | null;
} & ConnectedProps<typeof connector>;

function EntryImage({mediaFile, width, height, alt, title, rootPage}: Props) {
    const mediaLocation = rootPage + "/media/" + mediaFile.path;
    const src = mediaPreview(mediaLocation, 900);
    const srcSet = mediaSources(mediaLocation, mediaFile.previews);
    const sizes = mediaSizes(mediaFile.previews ?? []);
    const [imageWidth, imageHeight] = imageSize(width, height, mediaFile);
    return (
        <a href={mediaLocation}>
            <img src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight}
                 alt={alt ?? undefined} title={title ?? undefined} />
        </a>
    );
}

const connector = connect(
    (state: ClientState) => ({
        rootPage: getNodeRootPage(state)
    })
);

export default connector(EntryImage);
