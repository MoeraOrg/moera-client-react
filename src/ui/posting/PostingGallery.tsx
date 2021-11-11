import React from 'react';

import { MediaAttachment } from "api/node/api-types";
import EntryImage from "ui/posting/EntryImage";
import "./PostingGallery.css";

interface Props {
    postingId?: string;
    media: MediaAttachment[] | null;
}

export default function PostingGallery({postingId, media}: Props) {
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
            <div className={`gallery single ${orientation}`} style={{"--image-height": images[0].height + "px"} as any}>
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
