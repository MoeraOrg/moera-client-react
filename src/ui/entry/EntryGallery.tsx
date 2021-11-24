import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { MediaAttachment, PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import EntryImage from "ui/entry/EntryImage";
import "./EntryGallery.css";

type Props = {
    postingId?: string;
    commentId?: string | null;
    nodeName: string | null;
    media: MediaAttachment[] | null;
} & ConnectedProps<typeof connector>;

function singleImageHeight(image: PrivateMediaFileInfo, feedWidth: number, isComment: boolean): number {
    const maxWidth = isComment ? (feedWidth - 65) / 2 : feedWidth - 25;
    return image.width <= maxWidth ? image.height : Math.round(image.height * maxWidth / image.width);
}

function EntryGallery({postingId, commentId, nodeName, media, feedWidth}: Props) {
    if (media == null || media.length === 0) {
        return null;
    }

    const images = media.filter(ma => !ma.embedded).map(ma => ma.media);
    if (images.length === 0) {
        return null;
    }

    interface ImageProps {
        mediaFile: PrivateMediaFileInfo;
        flex?: "row" | "column";
        count?: number;
    }

    const Image = ({mediaFile, flex, count}: ImageProps) => (
        <EntryImage postingId={postingId} commentId={commentId} nodeName={nodeName} mediaFile={mediaFile} flex={flex}
                    count={count}/>
    );

    const orientation = images[0].height < images[0].width ? "vertical" : "horizontal";

    if (images.length === 1) {
        return (
            // FIXME React.CSSProperties does not include CSS variables
            <div className={`gallery single ${orientation}`}
                 style={{"--image-height": singleImageHeight(images[0], feedWidth, commentId != null) + "px"} as any}>
                <Image mediaFile={images[0]}/>
            </div>
        );
    }

    if (images.length === 2) {
        return (
            <div className={`gallery ${orientation}`}>
                <Image mediaFile={images[0]} flex="row"/>
                <Image mediaFile={images[1]} flex="row"/>
            </div>
        );
    }

    const base = images.length > 6 ? 0 : images.length % 2;

    return (
        <div className={`gallery ${orientation}`}>
            <div className="gallery-row">
                <Image mediaFile={images[0]} flex={base === 0 ? "row" : undefined}/>
                {base === 0 &&
                    <Image mediaFile={images[1]} flex="row"/>
                }
            </div>
            <div className="gallery-row">
                <Image mediaFile={images[2 - base]} flex="row"/>
                <Image mediaFile={images[3 - base]} flex="row"/>
            </div>
            {images.length > 4 &&
                <div className="gallery-row">
                    <Image mediaFile={images[4 - base]} flex="row"/>
                    <Image mediaFile={images[5 - base]} flex="row" count={images.length - 6}/>
                </div>
            }
        </div>
    );
}

const connector = connect(
    (state: ClientState) => ({
        feedWidth: getSetting(state, "feed.width") as number
    })
);

export default connector(EntryGallery);
