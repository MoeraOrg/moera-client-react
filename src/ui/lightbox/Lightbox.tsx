// Based on react-image-lightbox 5.1.4 by Chris Fritz (MIT License).

import React, { useEffect, useState } from 'react';

import { useElementSize, useManagedTimeout, useParent, useWindowSize } from "ui/hook";
import LightboxImage from "ui/lightbox/LightboxImage";
import { LightboxContext } from "ui/lightbox/lightbox-context";
import type { LightboxChangeZoomOptions } from "ui/lightbox/lightbox-context";
import { useLightboxImageCache } from "ui/lightbox/lightbox-image-cache";
import { useLightboxImageLoader } from "ui/lightbox/lightbox-image-loader";
import LightboxWindow, { MoveDirection } from "ui/lightbox/LightboxWindow";
import type { OffsetBounds } from "ui/lightbox/LightboxWindow";
import {
    ANIMATION_DURATION_MS,
    MAX_ZOOM_LEVEL,
    MIN_ZOOM_LEVEL
} from "ui/lightbox/util";

export type LightboxTriggerEvent = Event | React.SyntheticEvent;

export interface LightboxProps {
    caption?: React.ReactNode;
    mainSrc: string;
    nextSrc?: string | null;
    onMoveNext(): void;
    onMovePrev(): void;
    prevSrc?: string | null;
    statusText?: string;
    toolbarButtons: React.ReactNode[];
    zIndex?: number;
}

// Size ratio between previous and next zoom levels
const ZOOM_RATIO = 1.007;

export default function Lightbox(props: LightboxProps) {
    const {
        nextSrc,
        mainSrc,
        prevSrc,
        statusText,
        toolbarButtons,
        caption,
        zIndex,
        onMovePrev,
        onMoveNext,
    } = props;
    const {hide} = useParent();

    // Lightbox is closing
    // When Lightbox is mounted, it opens with the reverse of the closing animation.
    const [isClosing, setIsClosing] = useState(true);

    // Component parts should animate (e.g., when images are moving, or image is being zoomed)
    const [shouldAnimate, setShouldAnimate] = useState(false);

    const animating = shouldAnimate || isClosing;

    // Horizontal image offset from center
    const [offsetX, setOffsetX] = useState(0);

    // Vertical image offset from center
    const [offsetY, setOffsetY] = useState(0);

    const [keyCounter, setKeyCounter] = useState<number>(0);
    const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM_LEVEL);
    const [dyed, setDyed] = useState<boolean>(false);

    const [outerElement, outerSize] = useElementSize<HTMLDivElement>();
    const windowSize = useWindowSize();
    const boxSize = outerSize.width !== 0 && outerSize.height !== 0 ? outerSize : windowSize;

    const animationTimeout = useManagedTimeout();
    const closeTimeout = useManagedTimeout();

    const imageCache = useLightboxImageCache();

    const nextImageInfo = useLightboxImageLoader(nextSrc, imageCache, boxSize);
    const mainImageInfo = useLightboxImageLoader(mainSrc, imageCache, boxSize);
    const prevImageInfo = useLightboxImageLoader(prevSrc, imageCache, boxSize);

    useEffect(() => setIsClosing(false), []);

    const getZoomMultiplier = (nextZoomLevel = zoomLevel): number =>
        ZOOM_RATIO ** nextZoomLevel;

    const getMaxOffsets = (nextZoomLevel = zoomLevel): OffsetBounds => {
        if (mainImageInfo == null || mainImageInfo.error) {
            return {maxX: 0, minX: 0, maxY: 0, minY: 0};
        }

        const zoomMultiplier = getZoomMultiplier(nextZoomLevel);

        let maxX;
        if (zoomMultiplier * mainImageInfo.width - boxSize.width < 0) {
            maxX = (boxSize.width - zoomMultiplier * mainImageInfo.width) / 2;
        } else {
            maxX = (zoomMultiplier * mainImageInfo.width - boxSize.width) / 2;
        }

        let maxY;
        if (zoomMultiplier * mainImageInfo.height - boxSize.height < 0) {
            maxY = (boxSize.height - zoomMultiplier * mainImageInfo.height) / 2;
        } else {
            maxY = (zoomMultiplier * mainImageInfo.height - boxSize.height) / 2;
        }

        return {
            maxX,
            maxY,
            minX: -1 * maxX,
            minY: -1 * maxY
        };
    };

    const changeZoom = (
        nextLevel: number,
        clientX?: number,
        clientY?: number,
        {constrainOffsets = true}: LightboxChangeZoomOptions = {}
    ): void => {
        const nextZoomLevel = Math.max(
            MIN_ZOOM_LEVEL,
            Math.min(MAX_ZOOM_LEVEL, nextLevel)
        );
        if (nextZoomLevel === zoomLevel) {
            return;
        }

        if (nextZoomLevel === MIN_ZOOM_LEVEL) {
            setZoomLevel(nextZoomLevel);
            setOffsetX(0);
            setOffsetY(0);

            return;
        }

        if (mainImageInfo == null || mainImageInfo.error) {
            return;
        }

        const currentZoomMultiplier = getZoomMultiplier();
        const nextZoomMultiplier = getZoomMultiplier(nextZoomLevel);

        const pointerX = typeof clientX !== "undefined" ? clientX : boxSize.width / 2;
        const pointerY = typeof clientY !== "undefined" ? clientY : boxSize.height / 2;

        const currentImageOffsetX = (boxSize.width - mainImageInfo.width * currentZoomMultiplier) / 2;
        const currentImageOffsetY = (boxSize.height - mainImageInfo.height * currentZoomMultiplier) / 2;

        const currentImageRealOffsetX = currentImageOffsetX - offsetX;
        const currentImageRealOffsetY = currentImageOffsetY - offsetY;

        const currentPointerXRelativeToImage =
            (pointerX - currentImageRealOffsetX) / currentZoomMultiplier;
        const currentPointerYRelativeToImage =
            (pointerY - currentImageRealOffsetY) / currentZoomMultiplier;

        const nextImageRealOffsetX =
            pointerX - currentPointerXRelativeToImage * nextZoomMultiplier;
        const nextImageRealOffsetY =
            pointerY - currentPointerYRelativeToImage * nextZoomMultiplier;

        const nextImageOffsetX = (boxSize.width - mainImageInfo.width * nextZoomMultiplier) / 2;
        const nextImageOffsetY = (boxSize.height - mainImageInfo.height * nextZoomMultiplier) / 2;

        let nextOffsetX = nextImageOffsetX - nextImageRealOffsetX;
        let nextOffsetY = nextImageOffsetY - nextImageRealOffsetY;

        if (constrainOffsets) {
            const maxOffsets = getMaxOffsets();
            if (zoomLevel > nextZoomLevel) {
                nextOffsetX = Math.max(
                    maxOffsets.minX,
                    Math.min(maxOffsets.maxX, nextOffsetX)
                );
                nextOffsetY = Math.max(
                    maxOffsets.minY,
                    Math.min(maxOffsets.maxY, nextOffsetY)
                );
            }
        }

        setZoomLevel(nextZoomLevel);
        setOffsetX(nextOffsetX);
        setOffsetY(nextOffsetY);
    };

    const requestAnimation = (): void => {
        setShouldAnimate(true);
        animationTimeout.set(
            () => setShouldAnimate(false),
            ANIMATION_DURATION_MS
        );
    };

    const changeOffset = (nextOffsetX: number, nextOffsetY: number): void => {
        setOffsetX(nextOffsetX);
        setOffsetY(nextOffsetY);
    };

    const requestMove = (direction: MoveDirection, animate = true): void => {
        if (animate) {
            requestAnimation();
        }

        setZoomLevel(MIN_ZOOM_LEVEL);
        setOffsetX(0);
        setOffsetY(0);

        if (direction === "prev") {
            setKeyCounter(current => current - 1);
            onMovePrev();
        } else {
            setKeyCounter(current => current + 1);
            onMoveNext();
        }
    };

    const requestClose = (event?: LightboxTriggerEvent): void => {
        if (!event || event.type === "keydown") {
            hide();
            return;
        }

        setIsClosing(true);
        closeTimeout.set(() => hide(), ANIMATION_DURATION_MS);
    };

    const toggleDyed = (): void => {
        setDyed(current => !current);
    };

    return (
        <LightboxContext.Provider
            value={{animating, boxSize, dyed, zoomLevel, changeZoom, toggleDyed}}
        >
            <LightboxWindow
                hasNext={!!nextSrc}
                hasPrev={!!prevSrc}
                caption={caption}
                isClosing={isClosing}
                offsetX={offsetX}
                offsetY={offsetY}
                statusText={statusText}
                toolbarButtons={toolbarButtons}
                zIndex={zIndex}
                getMaxOffsets={getMaxOffsets}
                onAnimationRequest={requestAnimation}
                onMove={requestMove}
                onOffsetChange={changeOffset}
                onRequestClose={requestClose}
                ref={outerElement}
            >
                {nextSrc &&
                    <LightboxImage
                        imageInfo={nextImageInfo}
                        className="lightbox-image-next"
                        transforms={{
                            x: boxSize.width
                        }}
                        key={`${nextSrc}i${keyCounter + 1}`}
                    />
                }
                {mainSrc &&
                    <LightboxImage
                        imageInfo={mainImageInfo}
                        className="lightbox-image-main"
                        transforms={{
                            x: -1 * offsetX,
                            y: -1 * offsetY,
                            zoom: getZoomMultiplier()
                        }}
                        key={`${mainSrc}i${keyCounter}`}
                    />
                }
                {prevSrc &&
                    <LightboxImage
                        imageInfo={prevImageInfo}
                        className="lightbox-image-prev"
                        transforms={{
                            x: -1 * boxSize.width
                        }}
                        key={`${prevSrc}i${keyCounter - 1}`}
                    />
                }
            </LightboxWindow>
        </LightboxContext.Provider>
    );
}
