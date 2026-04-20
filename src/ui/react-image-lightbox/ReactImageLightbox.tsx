// Based on react-image-lightbox 5.1.4 by Chris Fritz (MIT License).

import React, { useEffect, useEffectEvent, useRef, useState } from 'react';
import Modal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { useElementSize, useManagedTimeout, useParent, useWindowSize } from "ui/hook";
import { Icon, msChevronLeft, msChevronRight } from "ui/material-symbols";
import LightboxCaption from "ui/react-image-lightbox/LightboxCaption";
import LightboxImage from "ui/react-image-lightbox/LightboxImage";
import LightboxToolbar from "ui/react-image-lightbox/LightboxToolbar";
import { LightboxContext } from "ui/react-image-lightbox/lightbox-context";
import { useLightboxImageCache } from "ui/react-image-lightbox/lightbox-image-cache";
import { useLightboxImageLoader } from "ui/react-image-lightbox/lightbox-image-loader";
import {
    ANIMATION_DURATION_MS,
    InputPointer,
    isTargetMainImage,
    MAX_ZOOM_LEVEL,
    MIN_ZOOM_LEVEL,
    parseMouseEvent,
    parsePointerEvent,
    parseTouchPointer,
    SOURCE_ANY,
    SOURCE_MOUSE,
    SOURCE_POINTER,
    SOURCE_TOUCH,
    WHEEL_MOVE_X_THRESHOLD
} from "ui/react-image-lightbox/util";
import "./ReactImageLightbox.css";

export type LightboxTriggerEvent = Event | React.SyntheticEvent;

export interface LightboxProps {
    imageCaption?: React.ReactNode;
    mainSrc: string;
    nextSrc?: string | null;
    onMoveNextRequest(event?: LightboxTriggerEvent): void;
    onMovePrevRequest(event?: LightboxTriggerEvent): void;
    prevSrc?: string | null;
    statusText?: string;
    toolbarButtons: React.ReactNode[];
    zIndex?: number;
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

const noop = (): void => {};

// Size ratio between previous and next zoom levels
const ZOOM_RATIO = 1.007;

// Actions
const ACTION_NONE = 0;
const ACTION_MOVE = 1;
const ACTION_SWIPE = 2;
const ACTION_PINCH = 3;

// Minimal swipe distance
const MIN_SWIPE_DISTANCE = 200;

const KEY_REPEAT_KEYUP_BONUS_MS = 40;
const KEY_REPEAT_LIMIT_MS = 180;

export default function ReactImageLightbox(props: LightboxProps) {
    const {
        nextSrc,
        mainSrc,
        prevSrc,
        statusText,
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

    const animating = shouldAnimate || isClosing;

    // Horizontal image offset from center
    const [offsetX, setOffsetX] = useState(0);

    // Vertical image offset from center
    const [offsetY, setOffsetY] = useState(0);

    const currentActionRef = useRef(ACTION_NONE);
    const eventsSourceRef = useRef(SOURCE_ANY);
    const pointerListRef = useRef<InputPointer[]>([]);
    const preventInnerCloseRef = useRef(false);
    const keyPressedRef = useRef(false);
    const lastKeyDownTimeRef = useRef(0);
    const scrollXRef = useRef(0);
    const moveStartXRef = useRef(0);
    const moveStartYRef = useRef(0);
    const moveStartOffsetXRef = useRef(0);
    const moveStartOffsetYRef = useRef(0);
    const didPanImageRef = useRef(false);
    const swipeStartXRef = useRef(0);
    const swipeStartYRef = useRef(0);
    const swipeEndXRef = useRef(0);
    const swipeEndYRef = useRef(0);
    const pinchTouchListRef = useRef<PinchPointer[] | null>(null);
    const pinchDistanceRef = useRef(0);
    const [keyCounter, setKeyCounter] = useState<number>(0);

    const [outerElement, outerSize] = useElementSize<HTMLDivElement>();
    const windowSize = useWindowSize();
    const boxSize = outerSize.width !== 0 && outerSize.height !== 0 ? outerSize : windowSize;

    const imageCache = useLightboxImageCache();

    const nextImageInfo = useLightboxImageLoader(nextSrc, imageCache, boxSize);
    const mainImageInfo = useLightboxImageLoader(mainSrc, imageCache, boxSize);
    const prevImageInfo = useLightboxImageLoader(prevSrc, imageCache, boxSize);

    // Zoom level of image
    const [zoomLevel, setZoomLevel] = useState(MIN_ZOOM_LEVEL);

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
        didPanImageRef.current = false;
    };

    const handleMove = ({x: clientX, y: clientY}: InputPointer): void => {
        const newOffsetX = moveStartXRef.current - clientX + moveStartOffsetXRef.current;
        const newOffsetY = moveStartYRef.current - clientY + moveStartOffsetYRef.current;
        if (offsetX !== newOffsetX || offsetY !== newOffsetY) {
            didPanImageRef.current = true;
            setOffsetX(newOffsetX);
            setOffsetY(newOffsetY);
        }
    };

    const animationTimeout = useManagedTimeout();
    const ignoreImageClickTimeout = useManagedTimeout();

    const handleMoveEnd = (): void => {
        if (didPanImageRef.current) {
            ignoreImageClickTimeout.set(noop, 100);
        }
        didPanImageRef.current = false;
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

        setZoomLevel(MIN_ZOOM_LEVEL);
        setOffsetX(0);
        setOffsetY(0);

        if (direction === "prev") {
            setKeyCounter(current => current - 1);
            onMovePrevRequest(event);
        } else {
            setKeyCounter(current => current + 1);
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
            if (xDiffAbs < boxSize.width / 4) {
                return;
            }
        }

        if (xDiff > 0 && prevSrc) {
            event.preventDefault();
            requestMovePrev();
        } else if (xDiff < 0 && nextSrc) {
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
        if (shouldHandleEvent(SOURCE_MOUSE) && isTargetMainImage(event.target)) {
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
                    if (isTargetMainImage(event.target)) {
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
        if (shouldHandleEvent(SOURCE_TOUCH) && isTargetMainImage(event.target)) {
            Array.from(event.changedTouches).forEach(eventTouch =>
                addPointer(parseTouchPointer(eventTouch))
            );
            multiPointerStart(event);
        }
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>): void => {
        if (shouldHandleEvent(SOURCE_TOUCH)) {
            multiPointerMove(
                event,
                Array.from(event.changedTouches).map(eventTouch =>
                    parseTouchPointer(eventTouch)
                )
            );
        }
    };

    const handleTouchEnd = useEffectEvent((event: TouchEvent): void => {
        if (shouldHandleEvent(SOURCE_TOUCH)) {
            Array.from(event.changedTouches).forEach(touch =>
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

    useEffect(() => setIsClosing(false), []);

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
            && event.target.classList.contains("ril__inner")
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

    const resetWheelScroll = (): void => {
        scrollXRef.current = 0;
    };

    const handleOuterMousewheel = (event: React.WheelEvent<HTMLDivElement>): void => {
        event.stopPropagation();

        const xThreshold = WHEEL_MOVE_X_THRESHOLD;
        let actionDelay = 0;
        const imageMoveDelay = 500;

        resetScrollTimeout.clear();
        resetScrollTimeout.set(() => {
            resetWheelScroll();
        }, 300);

        if (wheelActionTimeout.isActive() || animating) {
            return;
        }

        if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
            scrollXRef.current += event.deltaX;

            const bigLeapX = xThreshold / 2;
            if (scrollXRef.current >= xThreshold || event.deltaX >= bigLeapX) {
                requestMoveNext(event);
                actionDelay = imageMoveDelay;
                resetWheelScroll();
            } else if (
                scrollXRef.current <= -1 * xThreshold
                || event.deltaX <= -1 * bigLeapX
            ) {
                requestMovePrev(event);
                actionDelay = imageMoveDelay;
                resetWheelScroll();
            }
        }

        if (actionDelay !== 0) {
            wheelActionTimeout.set(noop, actionDelay);
        }
    };

    const [dyed, setDyed] = useState<boolean>(false);

    const handleImageClick = () => {
        if (ignoreImageClickTimeout.isActive()) {
            return;
        }

        setDyed(dyed => !dyed);
    };

    return (
        <Modal
            isOpen
            onRequestClose={requestClose}
            onAfterOpen={() => {
                if (outerElement.current) {
                    outerElement.current.focus();
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
            <LightboxContext.Provider value={{animating, boxSize, zoomLevel, changeZoom, resetWheelScroll}}>
                <div
                    className={cx("ril__outer", "ril__outerAnimating", {
                        "ril__outerClosing": isClosing,
                        "transparent": dyed
                    })}
                    style={{
                        transition: `opacity ${ANIMATION_DURATION_MS}ms`,
                        animationDuration: `${ANIMATION_DURATION_MS}ms`,
                        animationDirection: isClosing ? "normal" : "reverse"
                    }}
                    ref={outerElement}
                    onWheel={handleOuterMousewheel}
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    tabIndex={-1}
                    onKeyDown={handleKeyInput}
                    onKeyUp={handleKeyInput}
                >
                    <div className="ril__inner" onClick={closeIfClickInner}>
                        {nextSrc &&
                            <LightboxImage
                                imageInfo={nextImageInfo}
                                className="ril__imageNext"
                                transforms={{
                                    x: boxSize.width
                                }}
                                key={`${nextSrc}i${keyCounter + 1}`}
                            />
                        }
                        {mainSrc &&
                            <LightboxImage
                                imageInfo={mainImageInfo}
                                className="ril__imageMain"
                                transforms={{
                                    x: -1 * offsetX,
                                    y: -1 * offsetY,
                                    zoom: getZoomMultiplier()
                                }}
                                onClick={handleImageClick}
                                key={`${mainSrc}i${keyCounter}`}
                            />
                        }
                        {prevSrc &&
                            <LightboxImage
                                imageInfo={prevImageInfo}
                                className="ril__imagePrev"
                                transforms={{
                                    x: -1 * boxSize.width
                                }}
                                key={`${prevSrc}i${keyCounter - 1}`}
                            />
                        }
                    </div>

                    {prevSrc && (
                        <button
                            type="button"
                            className="ril__navButtons ril__navButtonPrev"
                            key="prev"
                            aria-label={t("previous-image")}
                            title={t("previous-image")}
                            onClick={!animating ? requestMovePrev : undefined}
                        >
                            <Icon icon={msChevronLeft} size={40}/>
                        </button>
                    )}

                    {nextSrc && (
                        <button
                            type="button"
                            className="ril__navButtons ril__navButtonNext"
                            key="next"
                            aria-label={t("next-image")}
                            title={t("next-image")}
                            onClick={!animating ? requestMoveNext : undefined}
                        >
                            <Icon icon={msChevronRight} size={40}/>
                        </button>
                    )}

                    <LightboxToolbar
                        statusText={statusText}
                        toolbarButtons={toolbarButtons}
                        onClose={requestClose}
                    />

                    {imageCaption && <LightboxCaption>{imageCaption}</LightboxCaption>}
                </div>
            </LightboxContext.Provider>
        </Modal>
    );
}
