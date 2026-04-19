import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { Loading } from "ui/control";
import { ANIMATION_DURATION_MS, getTransform, LightboxRect, MIN_ZOOM_LEVEL, type TransformInput } from "./util";

export interface ImageInfo {
    height: number;
    src: string;
    targetHeight: number;
    targetWidth: number;
    width: number;
}

interface Props {
    imageInfo: ImageInfo | null;
    loadError: boolean | undefined;
    title?: string;
    boxRect: LightboxRect;
    zoomLevel: number;
    className?: string;
    animating: boolean;
    transforms: Partial<TransformInput>;
    onDoubleClick: (event: React.MouseEvent<HTMLElement>) => void;
    onWheel: (event: React.WheelEvent<HTMLElement>) => void;
}

export default function LightboxImage({
    imageInfo, loadError, title, boxRect, zoomLevel, className, animating, transforms, onDoubleClick, onWheel
}: Props) {
    const {t} = useTranslation();

    const transitionStyle: React.CSSProperties = animating ? {transition: `transform ${ANIMATION_DURATION_MS}ms`} : {};

    const imageStyle: React.CSSProperties = {
        ...transitionStyle,
        ...getTransform({
            width: imageInfo?.width ?? boxRect.width,
            targetWidth: imageInfo?.targetWidth ?? boxRect.width,
            ...transforms
        })
    };

    if (zoomLevel > MIN_ZOOM_LEVEL) {
        imageStyle.cursor = "move";
    }

    if (imageInfo === null && loadError) {
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
    if (imageInfo === null) {
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

    return (
        <img
            className={cx(className, "ril__image")}
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
