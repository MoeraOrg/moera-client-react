// Based on react-image-lightbox 5.1.4 by Chris Fritz (MIT License).

import React, { useEffect, useEffectEvent, useRef } from 'react';
import Modal from 'react-modal';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { useManagedTimeout } from "ui/hook";
import { msChevronLeft, msChevronRight } from "ui/material-symbols";
import LightboxCaption from "ui/lightbox/LightboxCaption";
import { useLightbox } from "ui/lightbox/lightbox-context";
import { LightboxWindowContext } from "ui/lightbox/lightbox-window-context";
import LightboxNavButton from "ui/lightbox/LightboxNavButton";
import LightboxToolbar from "ui/lightbox/LightboxToolbar";
import type { InputPointer } from "ui/lightbox/util";
import {
    ANIMATION_DURATION_MS,
    isTargetMainImage,
    MIN_ZOOM_LEVEL,
    parseMouseEvent,
    parsePointerEvent,
    parseTouchPointer,
    SOURCE_ANY,
    SOURCE_MOUSE,
    SOURCE_POINTER,
    SOURCE_TOUCH,
    WHEEL_MOVE_X_THRESHOLD
} from "ui/lightbox/util";
import "./Lightbox.css";

type LightboxTriggerEvent = Event | React.SyntheticEvent;

interface Point {
    x: number;
    y: number;
}

export interface OffsetBounds {
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

interface Props {
    children?: React.ReactNode;
    hasNext: boolean;
    hasPrev: boolean;
    imageCaption?: React.ReactNode;
    isClosing: boolean;
    offsetX: number;
    offsetY: number;
    statusText?: string;
    toolbarButtons: React.ReactNode[];
    zIndex?: number;
    getMaxOffsets(): OffsetBounds;
    onAnimationRequest(): void;
    onMoveNextRequest(event?: LightboxTriggerEvent, animate?: boolean): void;
    onMovePrevRequest(event?: LightboxTriggerEvent, animate?: boolean): void;
    onOffsetChange(offsetX: number, offsetY: number): void;
    onRequestClose(event?: LightboxTriggerEvent): void;
    ref: React.RefObject<HTMLDivElement | null>;
}

const noop = (): void => {};

// Actions
const ACTION_NONE = 0;
const ACTION_MOVE = 1;
const ACTION_SWIPE = 2;
const ACTION_PINCH = 3;

// Minimal swipe distance
const MIN_SWIPE_DISTANCE = 200;

const KEY_REPEAT_KEYUP_BONUS_MS = 40;
const KEY_REPEAT_LIMIT_MS = 180;

export default function LightboxWindow({
    children,
    hasNext,
    hasPrev,
    imageCaption,
    isClosing,
    offsetX,
    offsetY,
    statusText,
    toolbarButtons,
    zIndex,
    getMaxOffsets,
    onAnimationRequest,
    onMoveNextRequest,
    onMovePrevRequest,
    onOffsetChange,
    onRequestClose,
    ref,
}: Props) {
    const {t} = useTranslation();
    const {animating, boxSize, dyed, zoomLevel, changeZoom, toggleDyed} = useLightbox();

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

    const preventInnerCloseTimeout = useManagedTimeout();
    const ignoreImageClickTimeout = useManagedTimeout();
    const resetScrollTimeout = useManagedTimeout();
    const wheelActionTimeout = useManagedTimeout();

    const setPreventInnerClose = (): void => {
        preventInnerCloseTimeout.clear();
        preventInnerCloseRef.current = true;
        preventInnerCloseTimeout.set(() => {
            preventInnerCloseRef.current = false;
        }, 100);
    };

    const resetWheelScroll = (): void => {
        scrollXRef.current = 0;
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
            onOffsetChange(newOffsetX, newOffsetY);
        }
    };

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
            onOffsetChange(nextOffsetX, nextOffsetY);
            onAnimationRequest();
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
        const animate = !keyPressedRef.current;
        keyPressedRef.current = false;

        if (direction === "prev") {
            onMovePrevRequest(event, animate);
        } else {
            onMoveNextRequest(event, animate);
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

        if (xDiff > 0 && hasPrev) {
            event.preventDefault();
            requestMovePrev();
        } else if (xDiff < 0 && hasNext) {
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
        changeZoom(nextZoomLevel, clientX, clientY, {constrainOffsets: false});
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

    const handleImageClick = (): void => {
        if (ignoreImageClickTimeout.isActive()) {
            return;
        }

        toggleDyed();
    };

    const handleInnerClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (
            !preventInnerCloseRef.current
            && event.target instanceof Element
            && event.target.classList.contains("lightbox-inner")
        ) {
            onRequestClose(event);
            return;
        }

        if (isTargetMainImage(event.target)) {
            handleImageClick();
        }
    };

    const handleKeyInput = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === "Escape" || event.key === "Esc") {
            // will be handled by the overlay manager
            return;
        }

        event.stopPropagation();

        if (animating) {
            return;
        }

        if (event.type === "keyup") {
            lastKeyDownTimeRef.current -= KEY_REPEAT_KEYUP_BONUS_MS;
            return;
        }

        const currentTime = Date.now();
        if (currentTime - lastKeyDownTimeRef.current < KEY_REPEAT_LIMIT_MS) {
            return;
        }
        lastKeyDownTimeRef.current = currentTime;

        switch (event.key) {
            case "ArrowLeft":
                if (!hasPrev) {
                    return;
                }

                event.preventDefault();
                keyPressedRef.current = true;
                requestMovePrev(event);
                break;
            case "ArrowRight":
                if (!hasNext) {
                    return;
                }

                event.preventDefault();
                keyPressedRef.current = true;
                requestMoveNext(event);
                break;
            default:
        }
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

    return (
        <Modal
            isOpen
            onRequestClose={onRequestClose}
            onAfterOpen={() => {
                if (ref.current) {
                    ref.current.focus();
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
            <LightboxWindowContext.Provider value={{resetWheelScroll}}>
                <div
                    className={cx("lightbox-outer", "lightbox-outer-animating", {
                        "lightbox-outer-closing": isClosing,
                        "transparent": dyed
                    })}
                    style={{
                        transition: `opacity ${ANIMATION_DURATION_MS}ms`,
                        animationDuration: `${ANIMATION_DURATION_MS}ms`,
                        animationDirection: isClosing ? "normal" : "reverse"
                    }}
                    ref={ref}
                    onWheel={handleOuterMousewheel}
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    tabIndex={-1}
                    onKeyDown={handleKeyInput}
                    onKeyUp={handleKeyInput}
                >
                    <div className="lightbox-inner" onClick={handleInnerClick}>
                        {children}
                    </div>

                    {hasPrev &&
                        <LightboxNavButton
                            className="lightbox-nav-button-prev"
                            key="prev"
                            title={t("previous-image")}
                            icon={msChevronLeft}
                            onClick={requestMovePrev}
                        />
                    }

                    {hasNext &&
                        <LightboxNavButton
                            className="lightbox-nav-button-next"
                            key="next"
                            title={t("next-image")}
                            icon={msChevronRight}
                            onClick={requestMoveNext}
                        />
                    }

                    <LightboxToolbar
                        statusText={statusText}
                        toolbarButtons={toolbarButtons}
                        onClose={onRequestClose}
                    />

                    {imageCaption && <LightboxCaption>{imageCaption}</LightboxCaption>}
                </div>
            </LightboxWindowContext.Provider>
        </Modal>
    );
}
