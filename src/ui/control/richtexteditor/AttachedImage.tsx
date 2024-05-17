import React from 'react';
import { useSelector } from 'react-redux';

import { VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { mediaImageFindLargerPreview, mediaImagePreview, mediaImageSize } from "util/media-images";
import { urlWithParameters } from "util/url";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    media: VerifiedMediaFile;
    nodeName: RelNodeName | string;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

export default function AttachedImage({media, nodeName, onClick}: Props) {
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, nodeName));
    const carte = useSelector(getCurrentViewMediaCarte);

    let src: string;
    if (media.directPath) {
        const preview = mediaImageFindLargerPreview(media.previews, 150);
        src = rootPage + "/media/" + preview?.directPath ?? media.directPath;
    } else {
        const auth = carte != null ? "carte:" + carte : null;
        src = mediaImagePreview(urlWithParameters(rootPage + "/media/" + media.path, {auth}), 150);
    }
    const [imageWidth, imageHeight] = mediaImageSize(150, 150, 150, media);

    return (
        <img className="thumbnail" alt="" src={src}
             width={imageWidth} height={imageHeight} draggable={false} onClick={onClick}/>
    );
}
