import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { VerifiedMediaFile } from "api";
import { ClientState } from "state/state";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { mediaImagePreview, mediaImageSize } from "util/media-images";
import { urlWithParameters } from "util/url";

interface OwnProps {
    media: VerifiedMediaFile;
    nodeName: string | null;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function AttachedImage({media, rootPage, carte, onClick}: Props) {
    const auth = carte != null ? "carte:" + carte : null;
    const src = mediaImagePreview(urlWithParameters(rootPage + "/media/" + media.path, {auth}), 150);
    const [imageWidth, imageHeight] = mediaImageSize(150, 150, 150, media);

    return (
        <img className="thumbnail" alt="" src={src}
             width={imageWidth} height={imageHeight} draggable={false} onClick={onClick}/>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        rootPage: props.nodeName ? getNamingNameNodeUri(state, props.nodeName) : getNodeRootPage(state),
        carte: getCurrentViewMediaCarte(state)
    })
);

export default connector(AttachedImage);
