import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { MediaAttachment, PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import EntryImage from "ui/posting/EntryImage";
import "./PostingGallery.css";

type Props = {
    postingId?: string;
    media: MediaAttachment[] | null;
} & ConnectedProps<typeof connector>;

function singleImageHeight(image: PrivateMediaFileInfo, feedWidth: number): number {
    const maxWidth = feedWidth - 25;
    return image.width <= maxWidth ? image.height : Math.round(image.height * maxWidth / image.width);
}

function PostingGallery({postingId, media, feedWidth}: Props) {
    if (media == null || media.length === 0) {
        return null;
    }

    const images = media.filter(ma => !ma.embedded).map(ma => ma.media);
    if (images.length === 0) {
        return null;
    }

    const orientation = images[0].height < images[0].width ? "vertical" : "horizontal";

    if (images.length === 1) {
        return (
            // FIXME React.CSSProperties does not include CSS variables
            <div className={`gallery single ${orientation}`}
                 style={{"--image-height": singleImageHeight(images[0], feedWidth) + "px"} as any}>
                <EntryImage postingId={postingId} mediaFile={images[0]}/>
            </div>
        );
    }

    if (images.length === 2) {
        return (
            <div className={`gallery ${orientation}`}>
                <EntryImage postingId={postingId} mediaFile={images[0]} flex="row"/>
                <EntryImage postingId={postingId} mediaFile={images[1]} flex="row"/>
            </div>
        );
    }

    const base = images.length > 6 ? 0 : images.length % 2;

    return (
        <div className={`gallery ${orientation}`}>
            <div className="gallery-row">
                <EntryImage postingId={postingId} mediaFile={images[0]} flex={base === 0 ? "row" : undefined}/>
                {base === 0 &&
                    <EntryImage postingId={postingId} mediaFile={images[1]} flex="row"/>
                }
            </div>
            <div className="gallery-row">
                <EntryImage postingId={postingId} mediaFile={images[2 - base]} flex="row"/>
                <EntryImage postingId={postingId} mediaFile={images[3 - base]} flex="row"/>
            </div>
            {images.length > 4 &&
                <div className="gallery-row">
                    <EntryImage postingId={postingId} mediaFile={images[4 - base]} flex="row"/>
                    <EntryImage postingId={postingId} mediaFile={images[5 - base]} flex="row"
                                count={images.length - 6}/>
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

export default connector(PostingGallery);
