import React from 'react';
import { useSelector } from 'react-redux';

import { MediaAttachment } from "api";
import { getFeedWidth } from "state/settings/selectors";
import EntryImage from "ui/entry/EntryImage";
import EntryGalleryExpandButton from "ui/entry/EntryGalleryExpandButton";
import { RelNodeName } from "util/rel-node-name";
import "./EntryGallery.css";

interface Props {
    postingId?: string;
    commentId?: string | null;
    nodeName: RelNodeName | string;
    media: MediaAttachment[] | null;
    onCollapse?: () => void;
    onExpand?: () => void;
}

function singleImageHeight(image: MediaAttachment, feedWidth: number, isComment: boolean): number {
    const maxWidth = isComment ? (feedWidth - 65) / 2 : feedWidth - 25;
    const width = image.media?.width ?? image.remoteMedia?.width ?? 0;
    const height = image.media?.height ?? image.remoteMedia?.height ?? 0;
    return width <= maxWidth ? height : Math.round(height * maxWidth / width);
}

function majorOrientation(images: MediaAttachment[]) {
    let balance = 0;
    for (let i = 0; i < 6 && i < images.length; i++) {
        const image = images[i];
        const width = image.media?.width ?? image.remoteMedia?.width ?? 0;
        const height = image.media?.height ?? image.remoteMedia?.height ?? 0;
        balance += height < width ? 1 : -1;
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
        .filter(ma => !(ma.media?.attachment ?? ma.remoteMedia?.attachment))
        .filter(ma => ma.media || ma.remoteMedia?.nodeName)
    if (images.length === 0) {
        return null;
    }

    interface ImageProps {
        image: MediaAttachment;
        flex?: "row" | "column";
        count?: number;
    }

    const Image = ({image, flex, count}: ImageProps) => (
        <EntryImage postingId={postingId} commentId={commentId} nodeName={nodeName} mediaFile={image.media ?? null}
                    remoteMedia={image.remoteMedia ?? null} flex={flex} count={count}/>
    );

    const orientation = majorOrientation(images);

    switch (images.length) {
        case 1:
            return (
                // FIXME React.CSSProperties does not include CSS variables
                <div className={`gallery single ${orientation}`}
                     style={{"--image-height": singleImageHeight(images[0], feedWidth, commentId != null) + "px"} as any}>
                    {onCollapse && <EntryGalleryExpandButton onClick={onCollapse} collapse/>}
                    <Image image={images[0]}/>
                </div>
            );

        case 2:
            return (
                <div className={`gallery ${orientation}`}>
                    {onExpand && <EntryGalleryExpandButton onClick={onExpand}/>}
                    <Image image={images[0]} flex="row"/>
                    <Image image={images[1]} flex="row"/>
                </div>
            );

        case 3:
            return (
                <div className={`gallery ${orientation}`}>
                    {onExpand && <EntryGalleryExpandButton onClick={onExpand}/>}
                    <div className="gallery-row">
                        <Image image={images[0]}/>
                    </div>
                    <div className="gallery-row">
                        <Image image={images[1]} flex="row"/>
                        <Image image={images[2]} flex="row"/>
                    </div>
                </div>
            );

        case 4:
            return (
                <div className={`gallery ${orientation}`}>
                    {onExpand && <EntryGalleryExpandButton onClick={onExpand}/>}
                    <div className="gallery-row">
                        <Image image={images[0]} flex="row"/>
                        <Image image={images[1]} flex="row"/>
                    </div>
                    <div className="gallery-row">
                        <Image image={images[2]} flex="row"/>
                        <Image image={images[3]} flex="row"/>
                    </div>
                </div>
            );

        case 5:
            return (
                <div className={`gallery ${orientation}`}>
                    {onExpand && <EntryGalleryExpandButton onClick={onExpand}/>}
                    <div className="gallery-row">
                        <Image image={images[0]} flex="row"/>
                        <Image image={images[1]} flex="row"/>
                    </div>
                    <div className="gallery-row">
                        <Image image={images[2]} flex="row"/>
                        <Image image={images[3]} flex="row"/>
                        <Image image={images[4]} flex="row"/>
                    </div>
                </div>
            );

        default:
            return (
                <div className={`gallery ${orientation}`}>
                    {onExpand && <EntryGalleryExpandButton onClick={onExpand}/>}
                    <div className="gallery-row">
                        <Image image={images[0]} flex="row"/>
                        <Image image={images[1]} flex="row"/>
                    </div>
                    <div className="gallery-row">
                        <Image image={images[2]} flex="row"/>
                        <Image image={images[3]} flex="row"/>
                    </div>
                    <div className="gallery-row">
                        <Image image={images[4]} flex="row"/>
                        <Image image={images[5]} flex="row" count={images.length - 6}/>
                    </div>
                </div>
            );
    }
}
