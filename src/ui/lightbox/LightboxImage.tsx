// Based on react-image-lightbox 5.1.4 by Chris Fritz (MIT License).

import React, { CSSProperties } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { Loading } from "ui/control";
import { useLightbox } from "ui/lightbox/lightbox-context";
import { ImageInfo } from "ui/lightbox/lightbox-image-loader";
import { useLightboxWindow } from "ui/lightbox/lightbox-window-context";
import {
    ANIMATION_DURATION_MS,
    isTargetMainImage,
    MIN_ZOOM_LEVEL,
    WHEEL_MOVE_Y_THRESHOLD,
    ZOOM_BUTTON_INCREMENT_SIZE
} from "ui/lightbox/util";
import "./LightboxImage.css";

interface Props {
    imageInfo: ImageInfo | null;
    className?: string;
    transforms: Partial<TransformInput>;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function LightboxImage({imageInfo, className, transforms, onClick}: Props) {
    const {animating, boxSize, zoomLevel, changeZoom} = useLightbox();
    const {resetWheelScroll} = useLightboxWindow();
    const {t} = useTranslation();

    const handleDoubleClick = (event: React.MouseEvent<HTMLImageElement>): void => {
        if (!isTargetMainImage(event.currentTarget)) {
            return;
        }

        if (zoomLevel > MIN_ZOOM_LEVEL) {
            changeZoom(MIN_ZOOM_LEVEL, event.clientX, event.clientY);
        } else {
            changeZoom(zoomLevel + ZOOM_BUTTON_INCREMENT_SIZE, event.clientX, event.clientY);
        }
    };

    const handleMouseWheel = (event: React.WheelEvent<HTMLImageElement>): void => {
        if (!isTargetMainImage(event.currentTarget)) {
            return;
        }

        if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
            event.stopPropagation();
            if (Math.abs(event.deltaY) < WHEEL_MOVE_Y_THRESHOLD) {
                return;
            }

            resetWheelScroll();
            changeZoom(zoomLevel - event.deltaY, event.clientX, event.clientY);
        }
    };

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
            <div className={cx(className, "lightbox-image")} style={imageStyle}>
                <div className="lightbox-loading-container">
                    <Loading large/>
                </div>
            </div>
        );
    }

    if (imageInfo.error) {
        return (
            <div className={cx(className, "lightbox-image")} style={imageStyle}>
                <div className="lightbox-error-container">
                    {t("couldnt-load-image")}
                </div>
            </div>
        );
    }

    return (
        <img
            className={cx(className, "lightbox-image")}
            onClick={onClick}
            onDoubleClick={handleDoubleClick}
            onWheel={handleMouseWheel}
            onDragStart={event => event.preventDefault()}
            style={imageStyle}
            src={imageInfo.src}
            alt={t("image")}
            draggable={false}
        />
    );
}

interface TransformInput {
    targetWidth: number;
    width: number;
    x?: number;
    y?: number;
    zoom?: number;
}

function getTransform({x = 0, y = 0, zoom = 1, width, targetWidth}: TransformInput): CSSProperties {
    let nextX = x;
    if (width > window.innerWidth) {
        nextX += (window.innerWidth - width) / 2;
    }
    const scaleFactor = zoom * (targetWidth / width);

    return {
        transform: `translate3d(${nextX}px,${y}px,0) scale3d(${scaleFactor},${scaleFactor},1)`
    };
}
