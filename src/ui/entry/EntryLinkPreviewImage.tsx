import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeRootPage } from "state/node/selectors";
import PreloadedImage from "ui/posting/PreloadedImage";
import { Browser } from "ui/browser";
import { Loading } from 'ui/control';
import { mediaImagePreview, mediaImageSize, mediaSizes, mediaSources } from "util/media-images";
import "./EntryLinkPreviewImage.css";

interface OwnProps {
    nodeName: string | null;
    mediaFile?: PrivateMediaFileInfo | null;
    loading: boolean;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function EntryLinkPreviewImage({mediaFile, loading, rootPage}: Props) {
    if (mediaFile == null) {
        if (loading) {
            return <div><Loading active={true}/></div>;
        }
        return null;
    }

    const mediaLocation = rootPage + "/media/" + mediaFile.path;
    const src = mediaImagePreview(mediaLocation, 800);
    const srcSet = mediaSources(mediaLocation, mediaFile.previews);
    const sizes = mediaSizes(mediaFile.previews ?? []);
    const [imageWidth, imageHeight] = mediaImageSize(800, null, null, mediaFile);
    const vertical = Browser.isTinyScreen() ? imageHeight > imageWidth * 0.55 : imageHeight > imageWidth;

    return (
        <PreloadedImage src={src} srcSet={srcSet} sizes={sizes} width={imageWidth} height={imageHeight}
                        className={vertical ? "vertical" : undefined}/>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        rootPage: props.nodeName ? getNamingNameNodeUri(state, props.nodeName) : getNodeRootPage(state)
    })
);

export default connector(EntryLinkPreviewImage);
