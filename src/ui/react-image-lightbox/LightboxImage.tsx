import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ElementSize } from "ui/hook";
import { Loading } from "ui/control";
import { ImageInfo } from "ui/react-image-lightbox/lightbox-image-loader";
import { ANIMATION_DURATION_MS, getTransform, MIN_ZOOM_LEVEL, type TransformInput } from "ui/react-image-lightbox/util";

interface Props {
    imageInfo: ImageInfo | null;
    title?: string;
    boxSize: ElementSize;
    zoomLevel: number;
    className?: string;
    animating: boolean;
    transforms: Partial<TransformInput>;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onDoubleClick: (event: React.MouseEvent<HTMLElement>) => void;
    onWheel: (event: React.WheelEvent<HTMLElement>) => void;
}

export default function LightboxImage({
    imageInfo, title, boxSize, zoomLevel, className, animating, transforms, onClick, onDoubleClick, onWheel
}: Props) {
    const {t} = useTranslation();

    const transitionStyle: React.CSSProperties = animating ? {transition: `transform ${ANIMATION_DURATION_MS}ms`} : {};

    const imageStyle: React.CSSProperties = {
        ...transitionStyle,
        ...getTransform({
            width: imageInfo?.width ?? boxSize.width,
            targetWidth: imageInfo?.targetWidth ?? boxSize.width,
            ...transforms
        })
    };

    if (zoomLevel > MIN_ZOOM_LEVEL) {
        imageStyle.cursor = "move";
    }

    if (imageInfo == null) {
        return (
            <div
                className={cx(className, "ril__image", "ril-not-loaded")}
                style={imageStyle}
            >
                <div className="ril__loadingContainer">
                    <Loading large/>
                </div>
            </div>
        );
    }

    if (imageInfo.error) {
        return (
            <div
                className={cx(className, "ril__image", "ril-errored")}
                style={imageStyle}
            >
                <div className="ril__errorContainer">
                    {t("couldnt-load-image")}
                </div>
            </div>
        );
    }

    return (
        <img
            className={cx(className, "ril__image")}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onWheel={onWheel}
            onDragStart={event => event.preventDefault()}
            style={imageStyle}
            src={imageInfo.src}
            alt={title ?? t("image")}
            draggable={false}
        />
    );
}
