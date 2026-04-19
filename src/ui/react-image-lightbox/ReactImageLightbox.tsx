import React, { useEffect, useEffectEvent, useReducer, useRef, useState } from 'react';
import Modal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { useManagedTimeout, useParent } from "ui/hook";
import {
    ANIMATION_DURATION_MS,
    getTouches,
    InputPointer,
    isTargetMatchImage,
    LightboxRect,
    MAX_ZOOM_LEVEL,
    MIN_ZOOM_LEVEL,
    parseMouseEvent,
    parsePointerEvent,
    parseTouchPointer,
    SOURCE_ANY,
    SOURCE_MOUSE,
    SOURCE_POINTER,
    SOURCE_TOUCH
} from "./util";
import "./ReactImageLightbox.css";
import LightboxImage, { ImageInfo } from "ui/react-image-lightbox/LightboxImage";

export type LightboxTriggerEvent = Event | React.SyntheticEvent;
export type LightboxImageSourceName = | "mainSrc" | "nextSrc" | "prevSrc";

export interface LightboxProps {
    imageCaption?: React.ReactNode;
    imageTitle?: string;
    mainSrc: string;
    nextSrc?: string | null;
    onImageLoad(
        imageSrc: string,
        srcType: LightboxImageSourceName,
        image: HTMLImageElement
    ): void;
    onMoveNextRequest(event?: LightboxTriggerEvent): void;
    onMovePrevRequest(event?: LightboxTriggerEvent): void;
    prevSrc?: string | null;
    toolbarButtons: React.ReactNode[];
    zIndex?: number;
}

type LoadErrorStatus = Partial<Record<LightboxImageSourceName, boolean>>;

interface ImageCacheEntry {
    height: number;
    loaded: boolean;
    width: number;
}

interface FitSize {
    height: number;
    width: number;
}

interface Point {
    x: number;
    y: number;
}

interface OffsetBounds {
    maxX: number;
    maxY: number;
    minX: number;
    minY: number;
}

interface PinchPointer {
    id: number | string;
    x: number;
    y: number;
}

interface SourceDescriptor {
    keyEnding: string;
    name: LightboxImageSourceName;
}

const noop = (): void => {};

// Size ratio between previous and next zoom levels
const ZOOM_RATIO = 1.007;

// How much to increase/decrease the zoom level when the zoom buttons are clicked
const ZOOM_BUTTON_INCREMENT_SIZE = 100;

// Used to judge the amount of horizontal scroll needed to initiate a image move
const WHEEL_MOVE_X_THRESHOLD = 200;

// Used to judge the amount of vertical scroll needed to initiate a zoom action
const WHEEL_MOVE_Y_THRESHOLD = 1;

// Actions
const ACTION_NONE = 0;
const ACTION_MOVE = 1;
const ACTION_SWIPE = 2;
const ACTION_PINCH = 3;

// Minimal swipe distance
const MIN_SWIPE_DISTANCE = 200;

const IMAGE_PADDING_PX = 10;
const KEY_REPEAT_KEYUP_BONUS_MS = 40;
const KEY_REPEAT_LIMIT_MS = 180;

export default function ReactImageLightbox(props: LightboxProps) {
    const {
        imageTitle,
        nextSrc,
        mainSrc,
        prevSrc,
        toolbarButtons,
        imageCaption,
        zIndex,
        onMovePrevRequest,
        onMoveNextRequest,
    } = props;
    const {hide} = useParent();
    const {t} = useTranslation();

    // Lightbox is closing
    // When Lightbox is mounted, it opens with the reverse of the closing animation.
    const [isClosing, setIsClosing] = useState(true);

    // Component parts should animate (e.g., when images are moving, or image is being zoomed)
    const [shouldAnimate, setShouldAnimate] = useState(false);

    // Zoom level of image
    const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM_LEVEL);

    // Horizontal image offset from center
    const [offsetX, setOffsetX] = useState(0);

    // Vertical image offset from center
    const [offsetY, setOffsetY] = useState(0);

    // image load error for srcType
    const [loadErrorStatus, setLoadErrorStatus] = useState<LoadErrorStatus>({});
    const [, forceUpdate] = useReducer((value: number) => value + 1, 0);

    const outerEl = useRef<HTMLDivElement | null>(null);
    const zoomInBtn = useRef<HTMLButtonElement | null>(null);
    const zoomOutBtn = useRef<HTMLButtonElement | null>(null);
    const caption = useRef<HTMLDivElement | null>(null);

    const propsRef = useRef(props);
    propsRef.current = props;

    const currentActionRef = useRef(ACTION_NONE);
    const eventsSourceRef = useRef(SOURCE_ANY);
    const pointerListRef = useRef<InputPointer[]>([]);
    const preventInnerCloseRef = useRef(false);
    const keyPressedRef = useRef(false);
    const imageCacheRef = useRef<Record<string, ImageCacheEntry>>({});
    const lastKeyDownTimeRef = useRef(0);
    const scrollXRef = useRef(0);
    const scrollYRef = useRef(0);
    const moveStartXRef = useRef(0);
    const moveStartYRef = useRef(0);
    const moveStartOffsetXRef = useRef(0);
    const moveStartOffsetYRef = useRef(0);
    const swipeStartXRef = useRef(0);
    const swipeStartYRef = useRef(0);
    const swipeEndXRef = useRef(0);
    const swipeEndYRef = useRef(0);
    const pinchTouchListRef = useRef<PinchPointer[] | null>(null);
    const pinchDistanceRef = useRef(0);
    const keyCounterRef = useRef(0);
    const moveRequestedRef = useRef(false);
    const previousPropsRef = useRef(props);

    const getSrcTypes = (): SourceDescriptor[] => [
        {
            name: "mainSrc",
            keyEnding: `i${keyCounterRef.current}`
        },
        {
            name: "nextSrc",
            keyEnding: `i${keyCounterRef.current + 1}`
        },
        {
            name: "prevSrc",
            keyEnding: `i${keyCounterRef.current - 1}`
        }
    ];

    const getZoomMultiplier = (nextZoomLevel = zoomLevel): number =>
        ZOOM_RATIO ** nextZoomLevel;

    const getLightboxRect = (): LightboxRect => {
        if (outerEl.current) {
            return outerEl.current.getBoundingClientRect();
        }

        return {
            width: window.innerWidth,
            height: window.innerHeight,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    };

    const animating = shouldAnimate || isClosing;

    const isImageLoaded = (imageSrc?: string | null): imageSrc is string =>
        Boolean(
            imageSrc
            && imageSrc in imageCacheRef.current
            && imageCacheRef.current[imageSrc].loaded
        );

    const getFitSizes = (width: number, height: number): FitSize => {
        const boxSize = getLightboxRect();
        let maxHeight = boxSize.height - IMAGE_PADDING_PX * 2;
        let maxWidth = boxSize.width - IMAGE_PADDING_PX * 2;

        maxHeight = Math.min(maxHeight, height);
        maxWidth = Math.min(maxWidth, width);

        const maxRatio = maxWidth / maxHeight;
        const srcRatio = width / height;

        if (maxRatio > srcRatio) {
            return {
                width: (width * maxHeight) / height,
                height: maxHeight
            };
        }

        return {
            width: maxWidth,
            height: (height * maxWidth) / width
        };
    };

    const getImageInfo = (imageSrc: string | null | undefined): ImageInfo | null => {
        if (!isImageLoaded(imageSrc)) {
            return null;
        }

        const fitSizes = getFitSizes(
            imageCacheRef.current[imageSrc].width,
            imageCacheRef.current[imageSrc].height
        );

        return {
            src: imageSrc,
            height: imageCacheRef.current[imageSrc].height,
            width: imageCacheRef.current[imageSrc].width,
            targetHeight: fitSizes.height,
            targetWidth: fitSizes.width
        };
    };

    const nextImageInfo = getImageInfo(nextSrc);
    const mainImageInfo = getImageInfo(mainSrc);
    const prevImageInfo = getImageInfo(prevSrc);

    const getMaxOffsets = (nextZoomLevel = zoomLevel): OffsetBounds => {
        if (mainImageInfo === null) {
            return {maxX: 0, minX: 0, maxY: 0, minY: 0};
        }

        const boxSize = getLightboxRect();
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

    const changeZoom = (nextLevel: number, clientX?: number, clientY?: number): void => {
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

        if (mainImageInfo === null) {
            return;
        }

        const currentZoomMultiplier = getZoomMultiplier();
        const nextZoomMultiplier = getZoomMultiplier(nextZoomLevel);

        const boxRect = getLightboxRect();
        const pointerX = typeof clientX !== "undefined" ? clientX - boxRect.left : boxRect.width / 2;
        const pointerY = typeof clientY !== "undefined" ? clientY - boxRect.top : boxRect.height / 2;

        const currentImageOffsetX = (boxRect.width - mainImageInfo.width * currentZoomMultiplier) / 2;
        const currentImageOffsetY = (boxRect.height - mainImageInfo.height * currentZoomMultiplier) / 2;

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

        const nextImageOffsetX =
            (boxRect.width - mainImageInfo.width * nextZoomMultiplier) / 2;
        const nextImageOffsetY =
            (boxRect.height - mainImageInfo.height * nextZoomMultiplier) / 2;

        let nextOffsetX = nextImageOffsetX - nextImageRealOffsetX;
        let nextOffsetY = nextImageOffsetY - nextImageRealOffsetY;

        if (currentActionRef.current !== ACTION_PINCH) {
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

    const preventInnerCloseTimeout = useManagedTimeout();

    const setPreventInnerClose = (): void => {
        preventInnerCloseTimeout.clear();
        preventInnerCloseRef.current = true;
        preventInnerCloseTimeout.set(() => {
            preventInnerCloseRef.current = false;
        }, 100);
    };

    const handleMoveStart = ({x: clientX, y: clientY}: InputPointer): void => {
        currentActionRef.current = ACTION_MOVE;
        moveStartXRef.current = clientX;
        moveStartYRef.current = clientY;
        moveStartOffsetXRef.current = offsetX;
        moveStartOffsetYRef.current = offsetY;
    };

    const handleMove = ({x: clientX, y: clientY}: InputPointer): void => {
        const newOffsetX = moveStartXRef.current - clientX + moveStartOffsetXRef.current;
        const newOffsetY = moveStartYRef.current - clientY + moveStartOffsetYRef.current;
        if (offsetX !== newOffsetX || offsetY !== newOffsetY) {
            setOffsetX(newOffsetX);
            setOffsetY(newOffsetY);
        }
    };

    const animationTimeout = useManagedTimeout();

    const handleMoveEnd = (): void => {
        currentActionRef.current = ACTION_NONE;
        moveStartXRef.current = 0;
        moveStartYRef.current = 0;
        moveStartOffsetXRef.current = 0;
        moveStartOffsetYRef.current = 0;

        const maxOffsets = getMaxOffsets();
        const nextOffsetX = Math.max(
            maxOffsets.minX,
            Math.min(maxOffsets.maxX, offsetX)
        );
        const nextOffsetY = Math.max(
            maxOffsets.minY,
            Math.min(maxOffsets.maxY, offsetY)
        );
        if (
            nextOffsetX !== offsetX
            || nextOffsetY !== offsetY
        ) {
            setOffsetX(nextOffsetX);
            setOffsetY(nextOffsetY);
            setShouldAnimate(true);
            animationTimeout.set(() => {
                setShouldAnimate(false);
            }, ANIMATION_DURATION_MS);
        }
    };

    const handleSwipeStart = ({x: clientX, y: clientY}: InputPointer): void => {
        currentActionRef.current = ACTION_SWIPE;
        swipeStartXRef.current = clientX;
        swipeStartYRef.current = clientY;
        swipeEndXRef.current = clientX;
        swipeEndYRef.current = clientY;
    };

    const handleSwipe = ({x: clientX, y: clientY}: InputPointer): void => {
        swipeEndXRef.current = clientX;
        swipeEndYRef.current = clientY;
    };

    const requestMove = (direction: "next" | "prev", event?: LightboxTriggerEvent): void => {
        if (!keyPressedRef.current) {
            setShouldAnimate(true);
            animationTimeout.set(
                () => setShouldAnimate(false),
                ANIMATION_DURATION_MS
            );
        }
        keyPressedRef.current = false;

        moveRequestedRef.current = true;
        setZoomLevel(MIN_ZOOM_LEVEL);
        setOffsetX(0);
        setOffsetY(0);

        if (direction === "prev") {
            keyCounterRef.current -= 1;
            onMovePrevRequest(event);
        } else {
            keyCounterRef.current += 1;
            onMoveNextRequest(event);
        }
    };

    const requestMoveNext = (event?: LightboxTriggerEvent): void => {
        requestMove("next", event);
    };

    const requestMovePrev = (event?: LightboxTriggerEvent): void => {
        requestMove("prev", event);
    };

    const handleSwipeEnd = (event?: LightboxTriggerEvent | null): void => {
        const xDiff = swipeEndXRef.current - swipeStartXRef.current;
        const xDiffAbs = Math.abs(xDiff);
        const yDiffAbs = Math.abs(swipeEndYRef.current - swipeStartYRef.current);

        currentActionRef.current = ACTION_NONE;
        swipeStartXRef.current = 0;
        swipeStartYRef.current = 0;
        swipeEndXRef.current = 0;
        swipeEndYRef.current = 0;

        if (!event || animating || xDiffAbs < yDiffAbs * 1.5) {
            return;
        }

        if (xDiffAbs < MIN_SWIPE_DISTANCE) {
            const boxRect = getLightboxRect();
            if (xDiffAbs < boxRect.width / 4) {
                return;
            }
        }

        if (xDiff > 0 && propsRef.current.prevSrc) {
            event.preventDefault();
            requestMovePrev();
        } else if (xDiff < 0 && propsRef.current.nextSrc) {
            event.preventDefault();
            requestMoveNext();
        }
    };

    const calculatePinchDistance = (
        pointerList = pinchTouchListRef.current ?? []
    ): number => {
        if (pointerList.length < 2) {
            return 0;
        }

        return Math.sqrt(
            (pointerList[0].x - pointerList[1].x) ** 2
            + (pointerList[0].y - pointerList[1].y) ** 2
        );
    };

    const calculatePinchCenter = (pointerList = pinchTouchListRef.current ?? []): Point => ({
        x: pointerList[0].x - (pointerList[0].x - pointerList[1].x) / 2,
        y: pointerList[0].y - (pointerList[0].y - pointerList[1].y) / 2
    });

    const handlePinchStart = (pointerList: InputPointer[]): void => {
        currentActionRef.current = ACTION_PINCH;
        pinchTouchListRef.current = pointerList.map(({id, x, y}) => ({id, x, y}));
        pinchDistanceRef.current = calculatePinchDistance(pinchTouchListRef.current);
    };

    const handlePinch = (pointerList: InputPointer[]): void => {
        pinchTouchListRef.current = (pinchTouchListRef.current ?? []).map(oldPointer => {
            for (let i = 0; i < pointerList.length; i += 1) {
                if (pointerList[i].id === oldPointer.id) {
                    return {
                        id: pointerList[i].id,
                        x: pointerList[i].x,
                        y: pointerList[i].y
                    };
                }
            }

            return oldPointer;
        });

        const newDistance = calculatePinchDistance(pinchTouchListRef.current);
        const nextZoomLevel = zoomLevel + newDistance - pinchDistanceRef.current;

        pinchDistanceRef.current = newDistance;
        const {x: clientX, y: clientY} = calculatePinchCenter(pinchTouchListRef.current);
        changeZoom(nextZoomLevel, clientX, clientY);
    };

    const handlePinchEnd = (): void => {
        currentActionRef.current = ACTION_NONE;
        pinchTouchListRef.current = null;
        pinchDistanceRef.current = 0;
    };

    const handleEnd = (event?: LightboxTriggerEvent | null): void => {
        switch (currentActionRef.current) {
            case ACTION_MOVE:
                handleMoveEnd();
                break;
            case ACTION_SWIPE:
                handleSwipeEnd(event);
                break;
            case ACTION_PINCH:
                handlePinchEnd();
                break;
            default:
                break;
        }
    };

    const decideMoveOrSwipe = (pointer: InputPointer): void => {
        if (zoomLevel <= MIN_ZOOM_LEVEL) {
            handleSwipeStart(pointer);
        } else {
            handleMoveStart(pointer);
        }
    };

    const multiPointerStart = (event: LightboxTriggerEvent): void => {
        handleEnd(null);
        switch (pointerListRef.current.length) {
            case 1:
                event.preventDefault();
                decideMoveOrSwipe(pointerListRef.current[0]);
                break;
            case 2:
                event.preventDefault();
                handlePinchStart(pointerListRef.current);
                break;
            default:
                break;
        }
    };

    const multiPointerMove = (
        event: LightboxTriggerEvent,
        pointerList: InputPointer[]
    ): void => {
        switch (currentActionRef.current) {
            case ACTION_MOVE:
                event.preventDefault();
                handleMove(pointerList[0]);
                break;
            case ACTION_SWIPE:
                event.preventDefault();
                handleSwipe(pointerList[0]);
                break;
            case ACTION_PINCH:
                event.preventDefault();
                handlePinch(pointerList);
                break;
            default:
                break;
        }
    };

    const multiPointerEnd = (event: LightboxTriggerEvent): void => {
        if (currentActionRef.current !== ACTION_NONE) {
            setPreventInnerClose();
            handleEnd(event);
        }
        switch (pointerListRef.current.length) {
            case 0:
                eventsSourceRef.current = SOURCE_ANY;
                break;
            case 1:
                event.preventDefault();
                decideMoveOrSwipe(pointerListRef.current[0]);
                break;
            case 2:
                event.preventDefault();
                handlePinchStart(pointerListRef.current);
                break;
            default:
                break;
        }
    };

    const shouldHandleEvent = (source: number): boolean => {
        if (eventsSourceRef.current === source) {
            return true;
        }
        if (eventsSourceRef.current === SOURCE_ANY) {
            eventsSourceRef.current = source;
            return true;
        }
        switch (source) {
            case SOURCE_MOUSE:
                return false;
            case SOURCE_TOUCH:
                eventsSourceRef.current = SOURCE_TOUCH;
                pointerListRef.current = pointerListRef.current.filter(
                    ({source: pointerSource}) => pointerSource === eventsSourceRef.current
                );
                return true;
            case SOURCE_POINTER:
                if (eventsSourceRef.current === SOURCE_MOUSE) {
                    eventsSourceRef.current = SOURCE_POINTER;
                    pointerListRef.current = pointerListRef.current.filter(
                        ({source: pointerSource}) => pointerSource === eventsSourceRef.current
                    );
                    return true;
                }
                return false;
            default:
                return false;
        }
    };

    const addPointer = (pointer: InputPointer): void => {
        pointerListRef.current.push(pointer);
    };

    const removePointer = (pointer: InputPointer): void => {
        pointerListRef.current = pointerListRef.current.filter(
            ({id}) => id !== pointer.id
        );
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (shouldHandleEvent(SOURCE_MOUSE) && isTargetMatchImage(event.target)) {
            addPointer(parseMouseEvent(event));
            multiPointerStart(event);
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (shouldHandleEvent(SOURCE_MOUSE)) {
            multiPointerMove(event, [parseMouseEvent(event)]);
        }
    };

    const handleMouseUp = useEffectEvent((event: MouseEvent): void => {
        if (shouldHandleEvent(SOURCE_MOUSE)) {
            removePointer(parseMouseEvent(event));
            multiPointerEnd(event);
        }
    });

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseUp]);

    const handlePointerEvent = useEffectEvent((event: PointerEvent): void => {
        if (shouldHandleEvent(SOURCE_POINTER)) {
            switch (event.type) {
                case "pointerdown":
                    if (isTargetMatchImage(event.target)) {
                        addPointer(parsePointerEvent(event));
                        multiPointerStart(event);
                    }
                    break;
                case "pointermove":
                    multiPointerMove(event, [parsePointerEvent(event)]);
                    break;
                case "pointerup":
                case "pointercancel":
                    removePointer(parsePointerEvent(event));
                    multiPointerEnd(event);
                    break;
                default:
                    break;
            }
        }
    });

    useEffect(() => {
        window.addEventListener("pointerdown", handlePointerEvent);
        window.addEventListener("pointermove", handlePointerEvent);
        window.addEventListener("pointerup", handlePointerEvent);
        window.addEventListener("pointercancel", handlePointerEvent);
        return () => {
            window.removeEventListener("pointerdown", handlePointerEvent);
            window.removeEventListener("pointermove", handlePointerEvent);
            window.removeEventListener("pointerup", handlePointerEvent);
            window.removeEventListener("pointercancel", handlePointerEvent);
        };
    }, [handlePointerEvent]);

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>): void => {
        if (shouldHandleEvent(SOURCE_TOUCH) && isTargetMatchImage(event.target)) {
            getTouches(event.changedTouches).forEach(eventTouch =>
                addPointer(parseTouchPointer(eventTouch))
            );
            multiPointerStart(event);
        }
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>): void => {
        if (shouldHandleEvent(SOURCE_TOUCH)) {
            multiPointerMove(
                event,
                getTouches(event.changedTouches).map(eventTouch =>
                    parseTouchPointer(eventTouch)
                )
            );
        }
    };

    const handleTouchEnd = useEffectEvent((event: TouchEvent): void => {
        if (shouldHandleEvent(SOURCE_TOUCH)) {
            getTouches(event.changedTouches).forEach(touch =>
                removePointer(parseTouchPointer(touch))
            );
            multiPointerEnd(event);
        }
    });

    useEffect(() => {
        window.addEventListener("touchend", handleTouchEnd);
        window.addEventListener("touchcancel", handleTouchEnd);
        return () => {
            window.removeEventListener("touchend", handleTouchEnd);
            window.removeEventListener("touchcancel", handleTouchEnd);
        };
    }, [handleTouchEnd]);

    const resizeTimeout = useManagedTimeout();

    const handleWindowResize = useEffectEvent((): void => {
        resizeTimeout.clear();
        resizeTimeout.set(() => {
            forceUpdate();
        }, 100);
    });

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, [handleWindowResize]);

    const handleZoomInButtonClick = (): void => {
        const nextZoomLevel = zoomLevel + ZOOM_BUTTON_INCREMENT_SIZE;
        changeZoom(nextZoomLevel);
        if (nextZoomLevel === MAX_ZOOM_LEVEL && zoomOutBtn.current) {
            zoomOutBtn.current.focus();
        }
    };

    const handleZoomOutButtonClick = (): void => {
        const nextZoomLevel = zoomLevel - ZOOM_BUTTON_INCREMENT_SIZE;
        changeZoom(nextZoomLevel);
        if (nextZoomLevel === MIN_ZOOM_LEVEL && zoomInBtn.current) {
            zoomInBtn.current.focus();
        }
    };

    const handleCaptionMousewheel = (event: React.WheelEvent<HTMLDivElement>): void => {
        event.stopPropagation();

        if (!caption.current) {
            return;
        }

        const {height} = caption.current.getBoundingClientRect();
        const {scrollHeight, scrollTop} = caption.current;
        if (
            (event.deltaY > 0 && height + scrollTop >= scrollHeight)
            || (event.deltaY < 0 && scrollTop <= 0)
        ) {
            event.preventDefault();
        }
    };

    const mainSrcReadyTimeout = useManagedTimeout();
    const nextSrcReadyTimeout = useManagedTimeout();
    const prevSrcReadyTimeout = useManagedTimeout();
    const imageReadyTimeouts = {
        mainSrc: mainSrcReadyTimeout,
        nextSrc: nextSrcReadyTimeout,
        prevSrc: prevSrcReadyTimeout
    };

    const loadImage = (
        srcType: LightboxImageSourceName,
        imageSrc: string,
        done: (error?: Event) => void
    ): void => {
        if (isImageLoaded(imageSrc)) {
            imageReadyTimeouts[srcType].set(() => {
                done();
            }, 1);
            return;
        }

        const inMemoryImage = new Image();

        inMemoryImage.addEventListener("error", errorEvent => {
            setLoadErrorStatus(prevState => ({...prevState, [srcType]: true}));

            done(errorEvent);
        }, {once: true});

        inMemoryImage.addEventListener("load", () => {
            propsRef.current.onImageLoad(imageSrc, srcType, inMemoryImage);

            imageCacheRef.current[imageSrc] = {
                loaded: true,
                width: inMemoryImage.width,
                height: inMemoryImage.height
            };

            done();
        }, {once: true});

        inMemoryImage.src = imageSrc;
    };

    const loadAllImages = useEffectEvent((nextProps = propsRef.current): void => {
        const generateLoadDoneCallback = (
            srcType: LightboxImageSourceName,
            imageSrc: string
        ) => (err?: Event): void => {
            if (err) {
                return;
            }

            if (propsRef.current[srcType] !== imageSrc) {
                return;
            }

            forceUpdate();
        };

        getSrcTypes().forEach(srcType => {
            const type = srcType.name;

            if (nextProps[type] && loadErrorStatus[type]) {
                setLoadErrorStatus(prevState => ({...prevState, [type]: false}));
            }

            if (nextProps[type] && !isImageLoaded(nextProps[type])) {
                loadImage(
                    type,
                    nextProps[type],
                    generateLoadDoneCallback(type, nextProps[type])
                );
            }
        });
    });

    useEffect(() => {
        setIsClosing(false);
        loadAllImages();
    }, [loadAllImages]);

    const closeTimeout = useManagedTimeout();

    const requestClose = (event?: LightboxTriggerEvent): void => {
        if (!event || event.type === "keydown") {
            hide();
            return;
        }

        setIsClosing(true);
        closeTimeout.set(() => hide(), ANIMATION_DURATION_MS);
    };

    const closeIfClickInner = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (
            !preventInnerCloseRef.current
            && event.target instanceof Element
            && /\bril-inner\b/.test(event.target.getAttribute("class") ?? "")
        ) {
            requestClose(event);
        }
    };

    const handleKeyInput = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        event.stopPropagation();

        if (animating) {
            return;
        }

        if (event.type === "keyup") {
            lastKeyDownTimeRef.current -= KEY_REPEAT_KEYUP_BONUS_MS;
            return;
        }

        const currentTime = Date.now();
        if (
            currentTime - lastKeyDownTimeRef.current < KEY_REPEAT_LIMIT_MS
            && event.key !== "Escape" && event.key !== "Esc"
        ) {
            return;
        }
        lastKeyDownTimeRef.current = currentTime;

        switch (event.key) {
            case "Escape":
            case "Esc":
                event.preventDefault();
                requestClose(event);
                break;
            case "ArrowLeft":
                if (!prevSrc) {
                    return;
                }

                event.preventDefault();
                keyPressedRef.current = true;
                requestMovePrev(event);
                break;
            case "ArrowRight":
                if (!nextSrc) {
                    return;
                }

                event.preventDefault();
                keyPressedRef.current = true;
                requestMoveNext(event);
                break;
            default:
        }
    };

    const resetScrollTimeout = useManagedTimeout();
    const wheelActionTimeout = useManagedTimeout();

    const handleOuterMousewheel = (event: React.WheelEvent<HTMLDivElement>): void => {
        event.stopPropagation();

        const xThreshold = WHEEL_MOVE_X_THRESHOLD;
        let actionDelay = 0;
        const imageMoveDelay = 500;

        resetScrollTimeout.clear();
        resetScrollTimeout.set(() => {
            scrollXRef.current = 0;
            scrollYRef.current = 0;
        }, 300);

        if (wheelActionTimeout.isActive() || animating) {
            return;
        }

        if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
            scrollYRef.current = 0;
            scrollXRef.current += event.deltaX;

            const bigLeapX = xThreshold / 2;
            if (scrollXRef.current >= xThreshold || event.deltaX >= bigLeapX) {
                requestMoveNext(event);
                actionDelay = imageMoveDelay;
                scrollXRef.current = 0;
            } else if (
                scrollXRef.current <= -1 * xThreshold
                || event.deltaX <= -1 * bigLeapX
            ) {
                requestMovePrev(event);
                actionDelay = imageMoveDelay;
                scrollXRef.current = 0;
            }
        }

        if (actionDelay !== 0) {
            wheelActionTimeout.set(noop, actionDelay);
        }
    };

    const handleImageMouseWheel = (event: React.WheelEvent<HTMLElement>): void => {
        if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
            event.stopPropagation();
            if (Math.abs(event.deltaY) < WHEEL_MOVE_Y_THRESHOLD) {
                return;
            }

            scrollXRef.current = 0;
            scrollYRef.current += event.deltaY;

            changeZoom(
                zoomLevel - event.deltaY,
                event.clientX,
                event.clientY
            );
        }
    };

    const handleImageDoubleClick = (event: React.MouseEvent<HTMLElement>): void => {
        if (zoomLevel > MIN_ZOOM_LEVEL) {
            changeZoom(MIN_ZOOM_LEVEL, event.clientX, event.clientY);
        } else {
            changeZoom(
                zoomLevel + ZOOM_BUTTON_INCREMENT_SIZE,
                event.clientX,
                event.clientY
            );
        }
    };

    useEffect(() => {
        const prevProps = previousPropsRef.current;
        let sourcesChanged = false;
        const prevSrcDict: Record<string, true> = {};
        const nextSrcDict: Record<string, true> = {};

        getSrcTypes().forEach(srcType => {
            if (prevProps[srcType.name] !== props[srcType.name]) {
                sourcesChanged = true;

                const prevSrc = prevProps[srcType.name];
                const nextSrc = props[srcType.name];
                if (prevSrc) {
                    prevSrcDict[prevSrc] = true;
                }
                if (nextSrc) {
                    nextSrcDict[nextSrc] = true;
                }
            }
        });

        if (sourcesChanged || moveRequestedRef.current) {
            Object.keys(prevSrcDict).forEach(prevSrc => {
                if (
                    !(prevSrc in nextSrcDict)
                    && prevSrc in imageCacheRef.current
                ) {
                    imageCacheRef.current[prevSrc].loaded = false;
                }
            });

            moveRequestedRef.current = false;
            loadAllImages(props);
        }

        previousPropsRef.current = props;
    }, [loadAllImages, props]);

    const boxSize = getLightboxRect();
    const zoomMultiplier = getZoomMultiplier();

    const keyEndings = getSrcTypes().reduce<Record<LightboxImageSourceName, string>>((result, {name, keyEnding}) => {
        result[name] = keyEnding;
        return result;
    }, {} as Record<LightboxImageSourceName, string>);

    return (
        <Modal
            isOpen
            onRequestClose={requestClose}
            onAfterOpen={() => {
                if (outerEl.current) {
                    outerEl.current.focus();
                }
            }}
            style={{
                overlay: {
                    zIndex: zIndex ?? 1000,
                    backgroundColor: "transparent",
                },
                content: {
                    backgroundColor: "transparent",
                    overflow: "hidden",
                    border: "none",
                    borderRadius: 0,
                    padding: 0,
                    inset: 0,
                }
            }}
            contentLabel={t("lightbox")}
            appElement={document.body}
        >
            <div
                className={cx("ril-outer", "ril__outer", "ril__outerAnimating", {
                    "ril-closing": isClosing,
                    "ril__outerClosing": isClosing
                })}
                style={{
                    transition: `opacity ${ANIMATION_DURATION_MS}ms`,
                    animationDuration: `${ANIMATION_DURATION_MS}ms`,
                    animationDirection: isClosing ? "normal" : "reverse"
                }}
                ref={outerEl}
                onWheel={handleOuterMousewheel}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                tabIndex={-1}
                onKeyDown={handleKeyInput}
                onKeyUp={handleKeyInput}
            >
                <div className="ril-inner ril__inner" onClick={closeIfClickInner}>
                    {nextSrc &&
                        <LightboxImage
                            imageInfo={nextImageInfo}
                            loadError={loadErrorStatus["nextSrc"]}
                            title={imageTitle}
                            boxRect={boxSize}
                            zoomLevel={zoomLevel}
                            className="ril-image-next ril__imageNext"
                            animating={animating}
                            transforms={{
                                x: boxSize.width
                            }}
                            onDoubleClick={handleImageDoubleClick}
                            onWheel={handleImageMouseWheel}
                            key={nextSrc + keyEndings["nextSrc"]}
                        />
                    }
                    {mainSrc &&
                        <LightboxImage
                            imageInfo={mainImageInfo}
                            loadError={loadErrorStatus["mainSrc"]}
                            title={imageTitle}
                            boxRect={boxSize}
                            zoomLevel={zoomLevel}
                            className="ril-image-current"
                            animating={animating}
                            transforms={{
                                x: -1 * offsetX,
                                y: -1 * offsetY,
                                zoom: zoomMultiplier
                            }}
                            onDoubleClick={handleImageDoubleClick}
                            onWheel={handleImageMouseWheel}
                            key={mainSrc + keyEndings["mainSrc"]}
                        />
                    }
                    {prevSrc &&
                        <LightboxImage
                            imageInfo={prevImageInfo}
                            loadError={loadErrorStatus["prevSrc"]}
                            title={imageTitle}
                            boxRect={boxSize}
                            zoomLevel={zoomLevel}
                            className="ril-image-prev ril__imagePrev"
                            animating={animating}
                            transforms={{
                                x: -1 * boxSize.width
                            }}
                            onDoubleClick={handleImageDoubleClick}
                            onWheel={handleImageMouseWheel}
                            key={prevSrc + keyEndings["prevSrc"]}
                        />
                    }
                </div>

                {prevSrc && (
                    <button
                        type="button"
                        className="ril-prev-button ril__navButtons ril__navButtonPrev"
                        key="prev"
                        aria-label={t("previous-image")}
                        title={t("previous-image")}
                        onClick={!animating ? requestMovePrev : undefined}
                    />
                )}

                {nextSrc && (
                    <button
                        type="button"
                        className="ril-next-button ril__navButtons ril__navButtonNext"
                        key="next"
                        aria-label={t("next-image")}
                        title={t("next-image")}
                        onClick={!animating ? requestMoveNext : undefined}
                    />
                )}

                <div className="ril-toolbar ril__toolbar">
                    <ul className="ril-toolbar-left ril__toolbarSide ril__toolbarLeftSide">
                        <li className="ril-toolbar__item ril__toolbarItem">
                            <span className="ril-toolbar__item__child ril__toolbarItemChild">
                                {imageTitle}
                            </span>
                        </li>
                    </ul>

                    <ul className="ril-toolbar-right ril__toolbarSide ril__toolbarRightSide">
                        {toolbarButtons && toolbarButtons.map((button, i) => (
                            <li
                                key={`button_${i + 1}`}
                                className="ril-toolbar__item ril__toolbarItem"
                            >
                                {button}
                            </li>
                        ))}

                        <li className="ril-toolbar__item ril__toolbarItem">
                            <button
                                type="button"
                                aria-label={t("zoom-in")}
                                title={t("zoom-in")}
                                className={cx(
                                    "ril__toolbarItemChild",
                                    "ril__builtinButton",
                                    "ril__zoomInButton",
                                    {
                                        "ril__builtinButtonDisabled": zoomLevel === MAX_ZOOM_LEVEL
                                    }
                                )}
                                ref={zoomInBtn}
                                disabled={animating || zoomLevel === MAX_ZOOM_LEVEL}
                                onClick={
                                    !animating && zoomLevel !== MAX_ZOOM_LEVEL
                                        ? handleZoomInButtonClick
                                        : undefined
                                }
                            />
                        </li>

                        <li className="ril-toolbar__item ril__toolbarItem">
                            <button
                                type="button"
                                aria-label={t("zoom-out")}
                                title={t("zoom-out")}
                                className={cx(
                                    "ril__toolbarItemChild",
                                    "ril__builtinButton",
                                    "ril__zoomOutButton",
                                    {
                                        "ril__builtinButtonDisabled": zoomLevel === MIN_ZOOM_LEVEL
                                    }
                                )}
                                ref={zoomOutBtn}
                                disabled={animating || zoomLevel === MIN_ZOOM_LEVEL}
                                onClick={
                                    !animating && zoomLevel !== MIN_ZOOM_LEVEL
                                        ? handleZoomOutButtonClick
                                        : undefined
                                }
                            />
                        </li>

                        <li className="ril-toolbar__item ril__toolbarItem">
                            <button
                                type="button"
                                aria-label={t("close")}
                                title={t("close")}
                                className="ril-close ril-toolbar__item__child ril__toolbarItemChild ril__builtinButton ril__closeButton"
                                onClick={!animating ? requestClose : undefined}
                            />
                        </li>
                    </ul>
                </div>

                {imageCaption &&
                    <div
                        onWheel={handleCaptionMousewheel}
                        onMouseDown={event => event.stopPropagation()}
                        className="ril-caption ril__caption"
                        ref={caption}
                    >
                        <div className="ril-caption-content ril__captionContent">
                            {imageCaption}
                        </div>
                    </div>
                }
            </div>
        </Modal>
    );
}
