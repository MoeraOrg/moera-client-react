import React, {useEffect, useReducer, useRef, useState} from "react";

import {
    getHighestSafeWindowContext,
    getWindowHeight,
    getWindowWidth,
    translate
} from "./util";
import {
    ACTION_MOVE,
    ACTION_NONE,
    ACTION_PINCH,
    ACTION_SWIPE,
    KEYS,
    MAX_ZOOM_LEVEL,
    MIN_SWIPE_DISTANCE,
    MIN_ZOOM_LEVEL,
    SOURCE_ANY,
    SOURCE_MOUSE,
    SOURCE_POINTER,
    SOURCE_TOUCH,
    WHEEL_MOVE_X_THRESHOLD,
    WHEEL_MOVE_Y_THRESHOLD,
    ZOOM_BUTTON_INCREMENT_SIZE,
    ZOOM_RATIO
} from "./constant";
import "./ReactImageLightbox.css";

type TimeoutId = ReturnType<typeof globalThis.setTimeout>;
type LightboxTriggerEvent = Event | React.SyntheticEvent;
type LightboxImageSourceName =
    | "mainSrc"
    | "mainSrcThumbnail"
    | "nextSrc"
    | "nextSrcThumbnail"
    | "prevSrc"
    | "prevSrcThumbnail";
type LightboxPrimarySourceName = "mainSrc" | "nextSrc" | "prevSrc";

interface ReactModalStyle {
    overlay?: React.CSSProperties;
    content?: React.CSSProperties;
}

interface ReactModalProps extends Record<string, unknown> {
    appElement?: HTMLElement;
    children?: React.ReactNode;
    contentLabel?: string;
    isOpen: boolean;
    onAfterOpen?: () => void;
    onRequestClose?: (event?: LightboxTriggerEvent) => void;
    style?: ReactModalStyle;
}

interface LightboxProps {
    animationDisabled?: boolean;
    animationDuration?: number;
    animationOnKeyInput?: boolean;
    clickOutsideToClose?: boolean;
    closeLabel?: string;
    discourageDownloads?: boolean;
    enableZoom?: boolean;
    imageCaption?: React.ReactNode;
    imageCrossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>["crossOrigin"] | null;
    imageLoadErrorMessage?: React.ReactNode;
    imagePadding?: number;
    imageTitle?: React.ReactNode;
    keyRepeatKeyupBonus?: number;
    keyRepeatLimit?: number;
    loader?: React.ReactNode | undefined;
    mainSrc: string;
    mainSrcThumbnail?: string | null;
    nextLabel?: string;
    nextSrc?: string | null;
    nextSrcThumbnail?: string | null;
    onAfterOpen?: () => void;
    onCloseRequest(event?: LightboxTriggerEvent): void;
    onImageLoad?(
        imageSrc: string,
        srcType: LightboxImageSourceName,
        image: HTMLImageElement
    ): void;
    onImageLoadError?(
        imageSrc: string,
        srcType: LightboxImageSourceName,
        errorEvent: Event
    ): void;
    onMoveNextRequest?(event?: LightboxTriggerEvent): void;
    onMovePrevRequest?(event?: LightboxTriggerEvent): void;
    prevLabel?: string;
    prevSrc?: string | null;
    prevSrcThumbnail?: string | null;
    reactModalProps?: Record<string, unknown>;
    reactModalStyle?: ReactModalStyle;
    toolbarButtons?: React.ReactNode[] | null;
    wrapperClassName?: string;
    zoomInLabel?: string;
    zoomOutLabel?: string;
}

interface LightboxState {
    isClosing: boolean;
    loadErrorStatus: Partial<Record<LightboxImageSourceName, boolean>>;
    offsetX: number;
    offsetY: number;
    shouldAnimate: boolean;
    zoomLevel: number;
}

interface InputPointer {
    id: number | string;
    source: number;
    x: number;
    y: number;
}

interface ImageCacheEntry {
    height: number;
    loaded: boolean;
    width: number;
}

interface FitSize {
    height: number;
    width: number;
}

interface ImageInfo {
    height: number;
    src: string;
    targetHeight: number;
    targetWidth: number;
    width: number;
}

interface Point {
    x: number;
    y: number;
}

interface LightboxRect {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
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

interface TransformInput {
    targetWidth: number;
    width: number;
    x?: number;
    y?: number;
    zoom?: number;
}

interface CoordinateEventLike {
    clientX: number;
    clientY: number;
}

interface TouchPointerLike extends CoordinateEventLike {
    identifier: number;
}

interface ActionsRefValue {
    handleMouseUp: (event: MouseEvent) => void;
    handlePointerEvent: (event: PointerEvent) => void;
    handleTouchEnd: (event: TouchEvent) => void;
    handleWindowResize: () => void;
    loadAllImages: (nextProps?: LightboxPropsWithDefaults) => void;
}

interface TouchListLike {
    item(index: number): TouchPointerLike | null;
    length: number;
}

const Modal = require("react-modal") as React.ComponentType<ReactModalProps>;

const thumbnailSourceTypes: Record<LightboxPrimarySourceName, Extract<LightboxImageSourceName, `${string}Thumbnail`>> = {
    mainSrc: "mainSrcThumbnail",
    nextSrc: "nextSrcThumbnail",
    prevSrc: "prevSrcThumbnail"
};

const noopAfterOpen = (): void => {};
const noopImageLoad = (): void => {};
const noopImageLoadError = (): void => {};
const noopMoveRequest = (): void => {};
const noopMouseUp = (_event: MouseEvent): void => {};
const noopPointerEvent = (_event: PointerEvent): void => {};
const noopTouchEnd = (_event: TouchEvent): void => {};

type LightboxDefaultProps = {
    animationDisabled: boolean;
    animationDuration: number;
    animationOnKeyInput: boolean;
    clickOutsideToClose: boolean;
    closeLabel: string;
    discourageDownloads: boolean;
    enableZoom: boolean;
    imageCaption: React.ReactNode;
    imageCrossOrigin: React.ImgHTMLAttributes<HTMLImageElement>["crossOrigin"] | null;
    imageLoadErrorMessage: React.ReactNode;
    imagePadding: number;
    imageTitle: React.ReactNode;
    keyRepeatKeyupBonus: number;
    keyRepeatLimit: number;
    loader: React.ReactNode | undefined;
    mainSrcThumbnail: string | null;
    nextLabel: string;
    nextSrc: string | null;
    nextSrcThumbnail: string | null;
    onAfterOpen: () => void;
    onImageLoad: (
        imageSrc: string,
        srcType: LightboxImageSourceName,
        image: HTMLImageElement
    ) => void;
    onImageLoadError: (
        imageSrc: string,
        srcType: LightboxImageSourceName,
        errorEvent: Event
    ) => void;
    onMoveNextRequest: (event?: LightboxTriggerEvent) => void;
    onMovePrevRequest: (event?: LightboxTriggerEvent) => void;
    prevLabel: string;
    prevSrc: string | null;
    prevSrcThumbnail: string | null;
    reactModalProps: Record<string, unknown>;
    reactModalStyle: ReactModalStyle;
    toolbarButtons: React.ReactNode[] | null;
    wrapperClassName: string;
    zoomInLabel: string;
    zoomOutLabel: string;
};

const defaultProps: LightboxDefaultProps = {
    animationDisabled: false,
    animationDuration: 300,
    animationOnKeyInput: false,
    clickOutsideToClose: true,
    closeLabel: "Close lightbox",
    discourageDownloads: false,
    enableZoom: true,
    imageCaption: null,
    imageCrossOrigin: null,
    imageLoadErrorMessage: "This image failed to load",
    imagePadding: 10,
    imageTitle: null,
    keyRepeatKeyupBonus: 40,
    keyRepeatLimit: 180,
    loader: undefined,
    mainSrcThumbnail: null,
    nextLabel: "Next image",
    nextSrc: null,
    nextSrcThumbnail: null,
    onAfterOpen: noopAfterOpen,
    onImageLoad: noopImageLoad,
    onImageLoadError: noopImageLoadError,
    onMoveNextRequest: noopMoveRequest,
    onMovePrevRequest: noopMoveRequest,
    prevLabel: "Previous image",
    prevSrc: null,
    prevSrcThumbnail: null,
    reactModalProps: {},
    reactModalStyle: {},
    toolbarButtons: null,
    wrapperClassName: "",
    zoomInLabel: "Zoom in",
    zoomOutLabel: "Zoom out"
};

type LightboxPropsWithDefaults =
    Omit<LightboxProps, keyof LightboxDefaultProps>
    & LightboxDefaultProps;

const hasTrueValue = (object: Partial<Record<LightboxImageSourceName, boolean>>): boolean =>
    Object.values(object).some(Boolean);

function isTargetMatchImage(target: EventTarget | null): boolean {
    return target instanceof Element
        && /\bril-image-current\b/.test(target.getAttribute("class") ?? "");
}

function parseMouseEvent(mouseEvent: CoordinateEventLike): InputPointer {
    return {
        id: "mouse",
        source: SOURCE_MOUSE,
        x: Math.trunc(mouseEvent.clientX),
        y: Math.trunc(mouseEvent.clientY)
    };
}

function parseTouchPointer(touchPointer: TouchPointerLike): InputPointer {
    return {
        id: touchPointer.identifier,
        source: SOURCE_TOUCH,
        x: Math.trunc(touchPointer.clientX),
        y: Math.trunc(touchPointer.clientY)
    };
}

function parsePointerEvent(pointerEvent: PointerEvent): InputPointer {
    return {
        id: pointerEvent.pointerId,
        source: SOURCE_POINTER,
        x: Math.trunc(pointerEvent.clientX),
        y: Math.trunc(pointerEvent.clientY)
    };
}

function getTouches(touchList: TouchListLike): TouchPointerLike[] {
    return Array.from({length: touchList.length}, (_, index) => touchList.item(index)).filter(
        (touch): touch is TouchPointerLike => touch !== null
    );
}

function getTransform({x = 0, y = 0, zoom = 1, width, targetWidth}: TransformInput): React.CSSProperties {
    let nextX = x;
    const windowWidth = getWindowWidth();
    if (width > windowWidth) {
        nextX += (windowWidth - width) / 2;
    }
    const scaleFactor = zoom * (targetWidth / width);

    return {
        transform: `translate3d(${nextX}px,${y}px,0) scale3d(${scaleFactor},${scaleFactor},1)`
    };
}

export default function ReactImageLightbox(incomingProps: LightboxProps) {
    const props = {
        ...defaultProps,
        ...incomingProps
    } as LightboxPropsWithDefaults;

    const [state, setLightboxState] = useState<LightboxState>({
        //-----------------------------
        // Animation
        //-----------------------------

        // Lightbox is closing
        // When Lightbox is mounted, if animation is enabled it will open with the reverse of the closing animation
        isClosing: !props.animationDisabled,

        // Component parts should animate (e.g., when images are moving, or image is being zoomed)
        shouldAnimate: false,

        //-----------------------------
        // Zoom settings
        //-----------------------------
        // Zoom level of image
        zoomLevel: MIN_ZOOM_LEVEL,

        //-----------------------------
        // Image position settings
        //-----------------------------
        // Horizontal offset from center
        offsetX: 0,

        // Vertical offset from center
        offsetY: 0,

        // image load error for srcType
        loadErrorStatus: {}
    });
    const {zoomLevel, offsetX, offsetY, isClosing, loadErrorStatus} = state;
    const [, forceUpdate] = useReducer((value: number) => value + 1, 0);

    const outerEl = useRef<HTMLDivElement | null>(null);
    const zoomInBtn = useRef<HTMLButtonElement | null>(null);
    const zoomOutBtn = useRef<HTMLButtonElement | null>(null);
    const caption = useRef<HTMLDivElement | null>(null);

    const propsRef = useRef(props);
    propsRef.current = props;

    const stateRef = useRef(state);
    stateRef.current = state;

    const didUnmountRef = useRef(false);
    const listenersRef = useRef<Record<string, EventListener>>({});
    const windowContextRef = useRef<Window | null>(null);
    const timeoutsRef = useRef<TimeoutId[]>([]);
    const currentActionRef = useRef(ACTION_NONE);
    const eventsSourceRef = useRef(SOURCE_ANY);
    const pointerListRef = useRef<InputPointer[]>([]);
    const preventInnerCloseRef = useRef(false);
    const preventInnerCloseTimeoutRef = useRef<TimeoutId | null>(null);
    const keyPressedRef = useRef(false);
    const imageCacheRef = useRef<Record<string, ImageCacheEntry>>({});
    const lastKeyDownTimeRef = useRef(0);
    const resizeTimeoutRef = useRef<TimeoutId | null>(null);
    const wheelActionTimeoutRef = useRef<TimeoutId | null>(null);
    const resetScrollTimeoutRef = useRef<TimeoutId | null>(null);
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
    const mountedAnimationDisabledRef = useRef(props.animationDisabled);
    const previousPropsRef = useRef(props);
    const actionsRef = useRef<ActionsRefValue>({
        handleMouseUp: noopMouseUp,
        handlePointerEvent: noopPointerEvent,
        handleTouchEnd: noopTouchEnd,
        handleWindowResize: noopAfterOpen,
        loadAllImages: () => {}
    });

    const setState = (
        update: Partial<LightboxState> | ((prevState: LightboxState) => Partial<LightboxState>)
    ): void => {
        setLightboxState(prevState => ({
            ...prevState,
            ...(typeof update === "function" ? update(prevState) : update)
        }));
    };

    const setManagedTimeout = (func: () => void, time: number): TimeoutId => {
        const id = globalThis.setTimeout(() => {
            timeoutsRef.current = timeoutsRef.current.filter(tid => tid !== id);
            func();
        }, time);
        timeoutsRef.current.push(id);
        return id;
    };

    const clearManagedTimeout = (id: TimeoutId | null): void => {
        if (id === null) {
            return;
        }

        timeoutsRef.current = timeoutsRef.current.filter(tid => tid !== id);
        globalThis.clearTimeout(id);
    };

    const getSrcTypes = (): SourceDescriptor[] => [
        {
            name: "mainSrc",
            keyEnding: `i${keyCounterRef.current}`
        },
        {
            name: "mainSrcThumbnail",
            keyEnding: `t${keyCounterRef.current}`
        },
        {
            name: "nextSrc",
            keyEnding: `i${keyCounterRef.current + 1}`
        },
        {
            name: "nextSrcThumbnail",
            keyEnding: `t${keyCounterRef.current + 1}`
        },
        {
            name: "prevSrc",
            keyEnding: `i${keyCounterRef.current - 1}`
        },
        {
            name: "prevSrcThumbnail",
            keyEnding: `t${keyCounterRef.current - 1}`
        }
    ];

    const getZoomMultiplier = (nextZoomLevel = stateRef.current.zoomLevel): number =>
        ZOOM_RATIO ** nextZoomLevel;

    const getLightboxRect = (): LightboxRect => {
        if (outerEl.current) {
            return outerEl.current.getBoundingClientRect();
        }

        return {
            width: getWindowWidth(),
            height: getWindowHeight(),
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        };
    };

    const isAnimating = (): boolean =>
        stateRef.current.shouldAnimate || stateRef.current.isClosing;

    const isImageLoaded = (imageSrc?: string | null): imageSrc is string =>
        Boolean(
            imageSrc
            && imageSrc in imageCacheRef.current
            && imageCacheRef.current[imageSrc].loaded
        );

    const getFitSizes = (width: number, height: number, stretch = false): FitSize => {
        const boxSize = getLightboxRect();
        let maxHeight = boxSize.height - propsRef.current.imagePadding * 2;
        let maxWidth = boxSize.width - propsRef.current.imagePadding * 2;

        if (!stretch) {
            maxHeight = Math.min(maxHeight, height);
            maxWidth = Math.min(maxWidth, width);
        }

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

    const getBestImageForType = (srcType: LightboxPrimarySourceName): ImageInfo | null => {
        let imageSrc = propsRef.current[srcType];
        let fitSizes: FitSize;

        if (isImageLoaded(imageSrc)) {
            fitSizes = getFitSizes(
                imageCacheRef.current[imageSrc].width,
                imageCacheRef.current[imageSrc].height
            );
        } else {
            const thumbnailType = thumbnailSourceTypes[srcType];
            const thumbnailSrc = propsRef.current[thumbnailType];
            if (!isImageLoaded(thumbnailSrc)) {
                return null;
            }

            imageSrc = thumbnailSrc;
            fitSizes = getFitSizes(
                imageCacheRef.current[imageSrc].width,
                imageCacheRef.current[imageSrc].height,
                true
            );
        }

        return {
            src: imageSrc,
            height: imageCacheRef.current[imageSrc].height,
            width: imageCacheRef.current[imageSrc].width,
            targetHeight: fitSizes.height,
            targetWidth: fitSizes.width
        };
    };

    const getMaxOffsets = (nextZoomLevel = stateRef.current.zoomLevel): OffsetBounds => {
        const currentImageInfo = getBestImageForType("mainSrc");
        if (currentImageInfo === null) {
            return {maxX: 0, minX: 0, maxY: 0, minY: 0};
        }

        const boxSize = getLightboxRect();
        const zoomMultiplier = getZoomMultiplier(nextZoomLevel);

        let maxX = 0;
        if (zoomMultiplier * currentImageInfo.width - boxSize.width < 0) {
            maxX = (boxSize.width - zoomMultiplier * currentImageInfo.width) / 2;
        } else {
            maxX = (zoomMultiplier * currentImageInfo.width - boxSize.width) / 2;
        }

        let maxY = 0;
        if (zoomMultiplier * currentImageInfo.height - boxSize.height < 0) {
            maxY = (boxSize.height - zoomMultiplier * currentImageInfo.height) / 2;
        } else {
            maxY = (zoomMultiplier * currentImageInfo.height - boxSize.height) / 2;
        }

        return {
            maxX,
            maxY,
            minX: -1 * maxX,
            minY: -1 * maxY
        };
    };

    const changeZoom = (nextLevel: number, clientX?: number, clientY?: number): void => {
        if (!propsRef.current.enableZoom) {
            return;
        }

        const nextZoomLevel = Math.max(
            MIN_ZOOM_LEVEL,
            Math.min(MAX_ZOOM_LEVEL, nextLevel)
        );
        const currentState = stateRef.current;

        if (nextZoomLevel === currentState.zoomLevel) {
            return;
        }

        if (nextZoomLevel === MIN_ZOOM_LEVEL) {
            setState({
                zoomLevel: nextZoomLevel,
                offsetX: 0,
                offsetY: 0
            });

            return;
        }

        const imageBaseSize = getBestImageForType("mainSrc");
        if (imageBaseSize === null) {
            return;
        }

        const currentZoomMultiplier = getZoomMultiplier();
        const nextZoomMultiplier = getZoomMultiplier(nextZoomLevel);

        const boxRect = getLightboxRect();
        const pointerX =
            typeof clientX !== "undefined"
                ? clientX - boxRect.left
                : boxRect.width / 2;
        const pointerY =
            typeof clientY !== "undefined"
                ? clientY - boxRect.top
                : boxRect.height / 2;

        const currentImageOffsetX =
            (boxRect.width - imageBaseSize.width * currentZoomMultiplier) / 2;
        const currentImageOffsetY =
            (boxRect.height - imageBaseSize.height * currentZoomMultiplier) / 2;

        const currentImageRealOffsetX = currentImageOffsetX - currentState.offsetX;
        const currentImageRealOffsetY = currentImageOffsetY - currentState.offsetY;

        const currentPointerXRelativeToImage =
            (pointerX - currentImageRealOffsetX) / currentZoomMultiplier;
        const currentPointerYRelativeToImage =
            (pointerY - currentImageRealOffsetY) / currentZoomMultiplier;

        const nextImageRealOffsetX =
            pointerX - currentPointerXRelativeToImage * nextZoomMultiplier;
        const nextImageRealOffsetY =
            pointerY - currentPointerYRelativeToImage * nextZoomMultiplier;

        const nextImageOffsetX =
            (boxRect.width - imageBaseSize.width * nextZoomMultiplier) / 2;
        const nextImageOffsetY =
            (boxRect.height - imageBaseSize.height * nextZoomMultiplier) / 2;

        let nextOffsetX = nextImageOffsetX - nextImageRealOffsetX;
        let nextOffsetY = nextImageOffsetY - nextImageRealOffsetY;

        if (currentActionRef.current !== ACTION_PINCH) {
            const maxOffsets = getMaxOffsets();
            if (currentState.zoomLevel > nextZoomLevel) {
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

        setState({
            zoomLevel: nextZoomLevel,
            offsetX: nextOffsetX,
            offsetY: nextOffsetY
        });
    };

    const setPreventInnerClose = (): void => {
        if (preventInnerCloseTimeoutRef.current) {
            clearManagedTimeout(preventInnerCloseTimeoutRef.current);
        }
        preventInnerCloseRef.current = true;
        preventInnerCloseTimeoutRef.current = setManagedTimeout(() => {
            preventInnerCloseRef.current = false;
            preventInnerCloseTimeoutRef.current = null;
        }, 100);
    };

    const handleMoveStart = ({x: clientX, y: clientY}: InputPointer): void => {
        if (!propsRef.current.enableZoom) {
            return;
        }
        currentActionRef.current = ACTION_MOVE;
        moveStartXRef.current = clientX;
        moveStartYRef.current = clientY;
        moveStartOffsetXRef.current = stateRef.current.offsetX;
        moveStartOffsetYRef.current = stateRef.current.offsetY;
    };

    const handleMove = ({x: clientX, y: clientY}: InputPointer): void => {
        const currentState = stateRef.current;
        const newOffsetX =
            moveStartXRef.current - clientX + moveStartOffsetXRef.current;
        const newOffsetY =
            moveStartYRef.current - clientY + moveStartOffsetYRef.current;
        if (
            currentState.offsetX !== newOffsetX
            || currentState.offsetY !== newOffsetY
        ) {
            setState({
                offsetX: newOffsetX,
                offsetY: newOffsetY
            });
        }
    };

    const handleMoveEnd = (): void => {
        currentActionRef.current = ACTION_NONE;
        moveStartXRef.current = 0;
        moveStartYRef.current = 0;
        moveStartOffsetXRef.current = 0;
        moveStartOffsetYRef.current = 0;

        const currentState = stateRef.current;
        const maxOffsets = getMaxOffsets();
        const nextOffsetX = Math.max(
            maxOffsets.minX,
            Math.min(maxOffsets.maxX, currentState.offsetX)
        );
        const nextOffsetY = Math.max(
            maxOffsets.minY,
            Math.min(maxOffsets.maxY, currentState.offsetY)
        );
        if (
            nextOffsetX !== currentState.offsetX
            || nextOffsetY !== currentState.offsetY
        ) {
            setState({
                offsetX: nextOffsetX,
                offsetY: nextOffsetY,
                shouldAnimate: true
            });
            setManagedTimeout(() => {
                setState({shouldAnimate: false});
            }, propsRef.current.animationDuration);
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
        const nextState: Partial<LightboxState> = {
            zoomLevel: MIN_ZOOM_LEVEL,
            offsetX: 0,
            offsetY: 0
        };

        if (
            !propsRef.current.animationDisabled
            && (!keyPressedRef.current || propsRef.current.animationOnKeyInput)
        ) {
            nextState.shouldAnimate = true;
            setManagedTimeout(
                () => setState({shouldAnimate: false}),
                propsRef.current.animationDuration
            );
        }
        keyPressedRef.current = false;

        moveRequestedRef.current = true;

        if (direction === "prev") {
            keyCounterRef.current -= 1;
            setState(nextState);
            propsRef.current.onMovePrevRequest(event);
        } else {
            keyCounterRef.current += 1;
            setState(nextState);
            propsRef.current.onMoveNextRequest(event);
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

        if (!event || isAnimating() || xDiffAbs < yDiffAbs * 1.5) {
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
        if (!propsRef.current.enableZoom) {
            return;
        }
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
        const nextZoomLevel =
            stateRef.current.zoomLevel + newDistance - pinchDistanceRef.current;

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
        if (stateRef.current.zoomLevel <= MIN_ZOOM_LEVEL) {
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

    const handleMouseUp = (event: MouseEvent): void => {
        if (shouldHandleEvent(SOURCE_MOUSE)) {
            removePointer(parseMouseEvent(event));
            multiPointerEnd(event);
        }
    };

    const handlePointerEvent = (event: PointerEvent): void => {
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
    };

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

    const handleTouchEnd = (event: TouchEvent): void => {
        if (shouldHandleEvent(SOURCE_TOUCH)) {
            getTouches(event.changedTouches).forEach(touch =>
                removePointer(parseTouchPointer(touch))
            );
            multiPointerEnd(event);
        }
    };

    const handleWindowResize = (): void => {
        clearManagedTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = setManagedTimeout(() => {
            forceUpdate();
        }, 100);
    };

    const handleZoomInButtonClick = (): void => {
        const nextZoomLevel =
            stateRef.current.zoomLevel + ZOOM_BUTTON_INCREMENT_SIZE;
        changeZoom(nextZoomLevel);
        if (nextZoomLevel === MAX_ZOOM_LEVEL && zoomOutBtn.current) {
            zoomOutBtn.current.focus();
        }
    };

    const handleZoomOutButtonClick = (): void => {
        const nextZoomLevel =
            stateRef.current.zoomLevel - ZOOM_BUTTON_INCREMENT_SIZE;
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

    const loadImage = (
        srcType: LightboxImageSourceName,
        imageSrc: string,
        done: (error?: Event) => void
    ): void => {
        if (isImageLoaded(imageSrc)) {
            setManagedTimeout(() => {
                done();
            }, 1);
            return;
        }

        const inMemoryImage = new Image();

        if (propsRef.current.imageCrossOrigin) {
            inMemoryImage.crossOrigin = propsRef.current.imageCrossOrigin;
        }

        inMemoryImage.addEventListener("error", errorEvent => {
            propsRef.current.onImageLoadError(imageSrc, srcType, errorEvent);

            setState(prevState => ({
                loadErrorStatus: {...prevState.loadErrorStatus, [srcType]: true}
            }));

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

    const loadAllImages = (nextProps = propsRef.current): void => {
        const generateLoadDoneCallback = (
            srcType: LightboxImageSourceName,
            imageSrc: string
        ) => (err?: Event): void => {
            if (err) {
                return;
            }

            if (propsRef.current[srcType] !== imageSrc || didUnmountRef.current) {
                return;
            }

            forceUpdate();
        };

        getSrcTypes().forEach(srcType => {
            const type = srcType.name;
            const currentState = stateRef.current;

            if (nextProps[type] && currentState.loadErrorStatus[type]) {
                setState(prevState => ({
                    loadErrorStatus: {...prevState.loadErrorStatus, [type]: false}
                }));
            }

            if (nextProps[type] && !isImageLoaded(nextProps[type])) {
                loadImage(
                    type,
                    nextProps[type],
                    generateLoadDoneCallback(type, nextProps[type])
                );
            }
        });
    };

    const requestClose = (event?: LightboxTriggerEvent): void => {
        const closeLightbox = (): void => propsRef.current.onCloseRequest(event);

        if (
            !event
            || propsRef.current.animationDisabled
            || (event.type === "keydown" && !propsRef.current.animationOnKeyInput)
        ) {
            closeLightbox();
            return;
        }

        setState({isClosing: true});
        setManagedTimeout(closeLightbox, propsRef.current.animationDuration);
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

        if (isAnimating()) {
            return;
        }

        if (event.type === "keyup") {
            lastKeyDownTimeRef.current -= propsRef.current.keyRepeatKeyupBonus;
            return;
        }

        const keyCode = event.which || event.keyCode;
        const currentTime = Date.now();
        if (
            currentTime - lastKeyDownTimeRef.current
                < propsRef.current.keyRepeatLimit
            && keyCode !== KEYS.ESC
        ) {
            return;
        }
        lastKeyDownTimeRef.current = currentTime;

        switch (keyCode) {
            case KEYS.ESC:
                event.preventDefault();
                requestClose(event);
                break;
            case KEYS.LEFT_ARROW:
                if (!propsRef.current.prevSrc) {
                    return;
                }

                event.preventDefault();
                keyPressedRef.current = true;
                requestMovePrev(event);
                break;
            case KEYS.RIGHT_ARROW:
                if (!propsRef.current.nextSrc) {
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

        clearManagedTimeout(resetScrollTimeoutRef.current);
        resetScrollTimeoutRef.current = setManagedTimeout(() => {
            scrollXRef.current = 0;
            scrollYRef.current = 0;
        }, 300);

        if (wheelActionTimeoutRef.current !== null || isAnimating()) {
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
            wheelActionTimeoutRef.current = setManagedTimeout(() => {
                wheelActionTimeoutRef.current = null;
            }, actionDelay);
        }
    };

    const handleImageMouseWheel = (event: React.WheelEvent<HTMLElement>): void => {
        const yThreshold = WHEEL_MOVE_Y_THRESHOLD;

        if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
            event.stopPropagation();
            if (Math.abs(event.deltaY) < yThreshold) {
                return;
            }

            scrollXRef.current = 0;
            scrollYRef.current += event.deltaY;

            changeZoom(
                stateRef.current.zoomLevel - event.deltaY,
                event.clientX,
                event.clientY
            );
        }
    };

    const handleImageDoubleClick = (event: React.MouseEvent<HTMLElement>): void => {
        if (stateRef.current.zoomLevel > MIN_ZOOM_LEVEL) {
            changeZoom(MIN_ZOOM_LEVEL, event.clientX, event.clientY);
        } else {
            changeZoom(
                stateRef.current.zoomLevel + ZOOM_BUTTON_INCREMENT_SIZE,
                event.clientX,
                event.clientY
            );
        }
    };

    actionsRef.current = {
        handleWindowResize,
        handleMouseUp,
        handleTouchEnd,
        handlePointerEvent,
        loadAllImages
    };

    useEffect(() => {
        if (!mountedAnimationDisabledRef.current) {
            setState({isClosing: false});
        }

        const windowContext = getHighestSafeWindowContext();
        windowContextRef.current = windowContext;

        listenersRef.current = {
            resize: () => actionsRef.current.handleWindowResize(),
            mouseup: event => actionsRef.current.handleMouseUp(event as MouseEvent),
            touchend: event => actionsRef.current.handleTouchEnd(event as TouchEvent),
            touchcancel: event => actionsRef.current.handleTouchEnd(event as TouchEvent),
            pointerdown: event => actionsRef.current.handlePointerEvent(event as PointerEvent),
            pointermove: event => actionsRef.current.handlePointerEvent(event as PointerEvent),
            pointerup: event => actionsRef.current.handlePointerEvent(event as PointerEvent),
            pointercancel: event => actionsRef.current.handlePointerEvent(event as PointerEvent)
        };
        Object.keys(listenersRef.current).forEach(type => {
            windowContext.addEventListener(type, listenersRef.current[type]);
        });

        actionsRef.current.loadAllImages();

        return () => {
            didUnmountRef.current = true;
            Object.keys(listenersRef.current).forEach(type => {
                windowContext.removeEventListener(type, listenersRef.current[type]);
            });
            timeoutsRef.current.forEach(tid => globalThis.clearTimeout(tid));
        };
    }, []);

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
    });

    const {
        animationDisabled,
        animationDuration,
        clickOutsideToClose,
        discourageDownloads,
        enableZoom,
        imageTitle,
        nextSrc,
        prevSrc,
        toolbarButtons,
        reactModalStyle,
        onAfterOpen,
        imageCrossOrigin,
        reactModalProps,
        loader,
        wrapperClassName,
        prevLabel,
        nextLabel,
        zoomInLabel,
        zoomOutLabel,
        closeLabel,
        imageCaption,
        imageLoadErrorMessage
    } = props;

    const boxSize = getLightboxRect();
    let transitionStyle: React.CSSProperties = {};

    if (!animationDisabled && isAnimating()) {
        transitionStyle = {
            ...transitionStyle,
            transition: `transform ${animationDuration}ms`
        };
    }

    const keyEndings = getSrcTypes().reduce<Record<LightboxImageSourceName, string>>((result, {name, keyEnding}) => {
        result[name] = keyEnding;
        return result;
    }, {} as Record<LightboxImageSourceName, string>);

    const images: React.ReactElement[] = [];
    const addImage = (
        srcType: LightboxPrimarySourceName,
        imageClass: string,
        transforms: Partial<TransformInput>
    ): void => {
        if (!props[srcType]) {
            return;
        }
        const bestImageInfo = getBestImageForType(srcType);

        const imageStyle: React.CSSProperties = {
            ...transitionStyle,
            ...getTransform({
                width: bestImageInfo?.width ?? boxSize.width,
                targetWidth: bestImageInfo?.targetWidth ?? boxSize.width,
                ...transforms
            })
        };

        if (zoomLevel > MIN_ZOOM_LEVEL) {
            imageStyle.cursor = "move";
        }

        if (bestImageInfo === null && hasTrueValue(loadErrorStatus)) {
            images.push(
                <div
                    className={`${imageClass} ril__image ril-errored`}
                    style={imageStyle}
                    key={props[srcType] + keyEndings[srcType]}
                >
                    <div className="ril__errorContainer">
                        {imageLoadErrorMessage}
                    </div>
                </div>
            );

            return;
        }
        if (bestImageInfo === null) {
            const loadingIcon =
                loader !== undefined ? (
                    loader
                ) : (
                    <div className="ril-loading-circle ril__loadingCircle ril__loadingContainer__icon">
                        {[...new Array(12)].map((_, index) => (
                            <div
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                className="ril-loading-circle-point ril__loadingCirclePoint"
                            />
                        ))}
                    </div>
                );

            images.push(
                <div
                    className={`${imageClass} ril__image ril-not-loaded`}
                    style={imageStyle}
                    key={props[srcType] + keyEndings[srcType]}
                >
                    <div className="ril__loadingContainer">{loadingIcon}</div>
                </div>
            );

            return;
        }

        const imageSrc = bestImageInfo.src;
        if (discourageDownloads) {
            imageStyle.backgroundImage = `url('${imageSrc}')`;
            images.push(
                <div
                    className={`${imageClass} ril__image ril__imageDiscourager`}
                    onDoubleClick={handleImageDoubleClick}
                    onWheel={handleImageMouseWheel}
                    style={imageStyle}
                    key={imageSrc + keyEndings[srcType]}
                >
                    <div className="ril-download-blocker ril__downloadBlocker" />
                </div>
            );
        } else {
            const crossOrigin = imageCrossOrigin ?? undefined;
            images.push(
                <img
                    {...(crossOrigin ? {crossOrigin} : {})}
                    className={`${imageClass} ril__image`}
                    onDoubleClick={handleImageDoubleClick}
                    onWheel={handleImageMouseWheel}
                    onDragStart={event => event.preventDefault()}
                    style={imageStyle}
                    src={imageSrc}
                    key={imageSrc + keyEndings[srcType]}
                    alt={typeof imageTitle === "string" ? imageTitle : translate("Image")}
                    draggable={false}
                />
            );
        }
    };

    const zoomMultiplier = getZoomMultiplier();
    addImage("nextSrc", "ril-image-next ril__imageNext", {
        x: boxSize.width
    });
    addImage("mainSrc", "ril-image-current", {
        x: -1 * offsetX,
        y: -1 * offsetY,
        zoom: zoomMultiplier
    });
    addImage("prevSrc", "ril-image-prev ril__imagePrev", {
        x: -1 * boxSize.width
    });

    const modalStyle: ReactModalStyle = {
        overlay: {
            zIndex: 1000,
            backgroundColor: "transparent",
            ...(reactModalStyle.overlay ?? {})
        },
        content: {
            backgroundColor: "transparent",
            overflow: "hidden",
            border: "none",
            borderRadius: 0,
            padding: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            ...(reactModalStyle.content ?? {})
        }
    };

    return (
        <Modal
            isOpen
            onRequestClose={clickOutsideToClose ? requestClose : undefined}
            onAfterOpen={() => {
                if (outerEl.current) {
                    outerEl.current.focus();
                }

                onAfterOpen();
            }}
            style={modalStyle}
            contentLabel={translate("Lightbox")}
            appElement={
                typeof globalThis.window !== "undefined"
                    ? globalThis.window.document.body
                    : undefined
            }
            {...reactModalProps}
        >
            <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                className={`ril-outer ril__outer ril__outerAnimating ${wrapperClassName} ${
                    isClosing ? "ril-closing ril__outerClosing" : ""
                }`}
                style={{
                    transition: `opacity ${animationDuration}ms`,
                    animationDuration: `${animationDuration}ms`,
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
                <div // eslint-disable-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
                    className="ril-inner ril__inner"
                    onClick={clickOutsideToClose ? closeIfClickInner : undefined}
                >
                    {images}
                </div>

                {prevSrc && (
                    <button
                        type="button"
                        className="ril-prev-button ril__navButtons ril__navButtonPrev"
                        key="prev"
                        aria-label={prevLabel}
                        title={prevLabel}
                        onClick={!isAnimating() ? requestMovePrev : undefined}
                    />
                )}

                {nextSrc && (
                    <button
                        type="button"
                        className="ril-next-button ril__navButtons ril__navButtonNext"
                        key="next"
                        aria-label={nextLabel}
                        title={nextLabel}
                        onClick={!isAnimating() ? requestMoveNext : undefined}
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

                        {enableZoom && (
                            <li className="ril-toolbar__item ril__toolbarItem">
                                <button
                                    type="button"
                                    key="zoom-in"
                                    aria-label={zoomInLabel}
                                    title={zoomInLabel}
                                    className={[
                                        "ril-zoom-in",
                                        "ril__toolbarItemChild",
                                        "ril__builtinButton",
                                        "ril__zoomInButton",
                                        ...(zoomLevel === MAX_ZOOM_LEVEL
                                            ? ["ril__builtinButtonDisabled"]
                                            : [])
                                    ].join(" ")}
                                    ref={zoomInBtn}
                                    disabled={isAnimating() || zoomLevel === MAX_ZOOM_LEVEL}
                                    onClick={
                                        !isAnimating() && zoomLevel !== MAX_ZOOM_LEVEL
                                            ? handleZoomInButtonClick
                                            : undefined
                                    }
                                />
                            </li>
                        )}

                        {enableZoom && (
                            <li className="ril-toolbar__item ril__toolbarItem">
                                <button
                                    type="button"
                                    key="zoom-out"
                                    aria-label={zoomOutLabel}
                                    title={zoomOutLabel}
                                    className={[
                                        "ril-zoom-out",
                                        "ril__toolbarItemChild",
                                        "ril__builtinButton",
                                        "ril__zoomOutButton",
                                        ...(zoomLevel === MIN_ZOOM_LEVEL
                                            ? ["ril__builtinButtonDisabled"]
                                            : [])
                                    ].join(" ")}
                                    ref={zoomOutBtn}
                                    disabled={isAnimating() || zoomLevel === MIN_ZOOM_LEVEL}
                                    onClick={
                                        !isAnimating() && zoomLevel !== MIN_ZOOM_LEVEL
                                            ? handleZoomOutButtonClick
                                            : undefined
                                    }
                                />
                            </li>
                        )}

                        <li className="ril-toolbar__item ril__toolbarItem">
                            <button
                                type="button"
                                key="close"
                                aria-label={closeLabel}
                                title={closeLabel}
                                className="ril-close ril-toolbar__item__child ril__toolbarItemChild ril__builtinButton ril__closeButton"
                                onClick={!isAnimating() ? requestClose : undefined}
                            />
                        </li>
                    </ul>
                </div>

                {imageCaption && (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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
                )}
            </div>
        </Modal>
    );
}

export type {
    LightboxImageSourceName,
    LightboxProps,
    LightboxTriggerEvent,
    ReactModalStyle
};
