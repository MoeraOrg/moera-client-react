import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { MediaAttachment } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeRootPage } from "state/node/selectors";
import PreloadedImage from "ui/posting/PreloadedImage";
import { mediaImagePreview, mediaImageSize, mediaSizes, mediaSources } from "util/media-images";
import "./EntryLinkPreviewImage.css";

interface OwnProps {
    nodeName: string | null;
    hash: string | null | undefined;
    media: MediaAttachment[] | null;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function EntryLinkPreviewImage({hash, media, rootPage}: Props) {
    if (hash == null || media == null) {
        return null;
    }
    const mediaFile = media.find(ma => ma.media?.hash === hash)?.media;
    if (mediaFile == null) {
        return null;
    }

    const mediaLocation = rootPage + "/media/" + mediaFile.path;
    const src = mediaImagePreview(mediaLocation, 800);
    const srcSet = mediaSources(mediaLocation, mediaFile.previews);
    const sizes = mediaSizes(mediaFile.previews ?? []);
    const [imageWidth, imageHeight] = mediaImageSize(800, null, null, mediaFile);

    return (
        <PreloadedImage src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight}/>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        rootPage: props.nodeName ? getNamingNameNodeUri(state, props.nodeName) : getNodeRootPage(state)
    })
);

export default connector(EntryLinkPreviewImage);
