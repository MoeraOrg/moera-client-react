import React from 'react';
import { useSelector } from 'react-redux';

import { MediaAttachment, PrivateMediaFileInfo } from "api";
import { getFeedWidth } from "state/settings/selectors";
import EntryImage from "ui/entry/EntryImage";
import EntryGalleryExpandButton from "ui/entry/EntryGalleryExpandButton";
import "./EntryGallery.css";

interface Props {
    postingId?: string;
    commentId?: string | null;
    nodeName: string | null;
    media: MediaAttachment[] | null;
    onCollapse?: () => void;
    onExpand?: () => void;
}

function singleImageHeight(image: PrivateMediaFileInfo, feedWidth: number, isComment: boolean): number {
    const maxWidth = isComment ? (feedWidth - 65) / 2 : feedWidth - 25;
    return image.width <= maxWidth ? image.height : Math.round(image.height * maxWidth / image.width);
}

function majorOrientation(images: PrivateMediaFileInfo[]) {
    let balance = 0;
    for (let i = 0; i < 6 && i < images.length; i++) {
        balance += images[i].height < images[i].width ? 1 : -1;
    }
    return balance >= 0 ? "vertical" : "horizontal";
}

export default function EntryGallery({postingId, commentId, nodeName, media, onCollapse, onExpand}: Props) {
    const feedWidth = useSelector(getFeedWidth);

    if (media == null || media.length === 0) {
        return null;
    }

    const images = media
        .filter(ma => !ma.embedded)
        .map(ma => ma.media)
        .filter((img): img is PrivateMediaFileInfo => img != null);
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

    const orientation = majorOrientation(images);

    switch (images.length) {
        case 1:
            return (
                // FIXME React.CSSProperties does not include CSS variables
                <div className={`gallery single ${orientation}`}
                     style={{"--image-height": singleImageHeight(images[0], feedWidth, commentId != null) + "px"} as any}>
                    {onCollapse && <EntryGalleryExpandButton onClick={onCollapse} collapse/>}
                    <Image mediaFile={images[0]}/>
                </div>
            );

        case 2:
            return (
                <div className={`gallery ${orientation}`}>
                    {onExpand && <EntryGalleryExpandButton onClick={onExpand}/>}
                    <Image mediaFile={images[0]} flex="row"/>
                    <Image mediaFile={images[1]} flex="row"/>
                </div>
            );

        case 3:
            return (
                <div className={`gallery ${orientation}`}>
                    {onExpand && <EntryGalleryExpandButton onClick={onExpand}/>}
                    <div className="gallery-row">
                        <Image mediaFile={images[0]}/>
                    </div>
                    <div className="gallery-row">
                        <Image mediaFile={images[1]} flex="row"/>
                        <Image mediaFile={images[2]} flex="row"/>
                    </div>
                </div>
            );

        case 4:
            return (
                <div className={`gallery ${orientation}`}>
                    {onExpand && <EntryGalleryExpandButton onClick={onExpand}/>}
                    <div className="gallery-row">
                        <Image mediaFile={images[0]} flex="row"/>
                        <Image mediaFile={images[1]} flex="row"/>
                    </div>
                    <div className="gallery-row">
                        <Image mediaFile={images[2]} flex="row"/>
                        <Image mediaFile={images[3]} flex="row"/>
                    </div>
                </div>
            );

        case 5:
            return (
                <div className={`gallery ${orientation}`}>
                    {onExpand && <EntryGalleryExpandButton onClick={onExpand}/>}
                    <div className="gallery-row">
                        <Image mediaFile={images[0]} flex="row"/>
                        <Image mediaFile={images[1]} flex="row"/>
                    </div>
                    <div className="gallery-row">
                        <Image mediaFile={images[2]} flex="row"/>
                        <Image mediaFile={images[3]} flex="row"/>
                        <Image mediaFile={images[4]} flex="row"/>
                    </div>
                </div>
            );

        default:
            return (
                <div className={`gallery ${orientation}`}>
                    {onExpand && <EntryGalleryExpandButton onClick={onExpand}/>}
                    <div className="gallery-row">
                        <Image mediaFile={images[0]} flex="row"/>
                        <Image mediaFile={images[1]} flex="row"/>
                    </div>
                    <div className="gallery-row">
                        <Image mediaFile={images[2]} flex="row"/>
                        <Image mediaFile={images[3]} flex="row"/>
                    </div>
                    <div className="gallery-row">
                        <Image mediaFile={images[4]} flex="row"/>
                        <Image mediaFile={images[5]} flex="row" count={images.length - 6}/>
                    </div>
                </div>
            );
    }
}
