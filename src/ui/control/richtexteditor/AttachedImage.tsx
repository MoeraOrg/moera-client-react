import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RichTextMedia } from "state/richtexteditor/actions";
import { ClientState } from "state/state";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { mediaImagePreview, mediaImageSize } from "util/media-images";

interface OwnProps {
    media: RichTextMedia;
    nodeName: string | null;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function AttachedImage({media, rootPage, onClick}: Props) {
    const src = mediaImagePreview(rootPage + "/media/" + media.path, 150);
    const [imageWidth, imageHeight] = mediaImageSize(150, 150, 150, media);

    return (
        <img className="thumbnail" alt="" src={src}
             width={imageWidth} height={imageHeight} draggable={false} onClick={onClick}/>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        rootPage: props.nodeName ? getNamingNameNodeUri(state, props.nodeName) : getNodeRootPage(state)
    })
);

export default connector(AttachedImage);
