import React from 'react';
import { useSelector } from 'react-redux';

import { VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { mediaImageTagAttributes } from "util/media-images";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    media: VerifiedMediaFile;
    nodeName: RelNodeName | string;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

export default function AttachedImage({media, nodeName, onClick}: Props) {
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, nodeName));
    const carte = useSelector(getCurrentViewMediaCarte);

    const {
        src, srcSet, sizes, width: imageWidth, height: imageHeight
    } = mediaImageTagAttributes(rootPage, media, carte, 150, 150, 150);

    return (
        <img className="thumbnail" alt="" src={src} srcSet={srcSet} sizes={sizes}
             width={imageWidth} height={imageHeight} draggable={false} onClick={onClick}/>
    );
}
