import React from 'react';
import { useSelector } from 'react-redux';

import { VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { mediaImagePreview, mediaImageSize } from "util/media-images";
import { urlWithParameters } from "util/url";

interface Props {
    media: VerifiedMediaFile;
    nodeName: string | null;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

export default function AttachedImage({media, nodeName, onClick}: Props) {
    const rootPage = useSelector((state: ClientState) =>
        nodeName ? getNamingNameNodeUri(state, nodeName) : getNodeRootPage(state));
    const carte = useSelector(getCurrentViewMediaCarte);

    const auth = carte != null ? "carte:" + carte : null;
    const src = mediaImagePreview(urlWithParameters(rootPage + "/media/" + media.path, {auth}), 150);
    const [imageWidth, imageHeight] = mediaImageSize(150, 150, 150, media);

    return (
        <img className="thumbnail" alt="" src={src}
             width={imageWidth} height={imageHeight} draggable={false} onClick={onClick}/>
    );
}
