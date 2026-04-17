import React, {useEffect, useReducer, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import {
    translate,
    getWindowWidth,
    getWindowHeight,
    getHighestSafeWindowContext
} from "./util";
import {
    KEYS,
    MIN_ZOOM_LEVEL,
    MAX_ZOOM_LEVEL,
    ZOOM_RATIO,
    WHEEL_MOVE_X_THRESHOLD,
    WHEEL_MOVE_Y_THRESHOLD,
    ZOOM_BUTTON_INCREMENT_SIZE,
    ACTION_NONE,
    ACTION_MOVE,
    ACTION_SWIPE,
    ACTION_PINCH,
    SOURCE_ANY,
    SOURCE_MOUSE,
    SOURCE_TOUCH,
    SOURCE_POINTER,
    MIN_SWIPE_DISTANCE
} from "./constant";
import "./style.css";

function isTargetMatchImage(target) {
    return target && /ril-image-current/.test(target.className);
}

function parseMouseEvent(mouseEvent) {
    return {
        id: "mouse",
        source: SOURCE_MOUSE,
        x: parseInt(mouseEvent.clientX, 10),
        y: parseInt(mouseEvent.clientY, 10)
    };
}

function parseTouchPointer(touchPointer) {
    return {
        id: touchPointer.identifier,
        source: SOURCE_TOUCH,
        x: parseInt(touchPointer.clientX, 10),
        y: parseInt(touchPointer.clientY, 10)
    };
}

function parsePointerEvent(pointerEvent) {
    return {
        id: pointerEvent.pointerId,
        source: SOURCE_POINTER,
        x: parseInt(pointerEvent.clientX, 10),
        y: parseInt(pointerEvent.clientY, 10)
    };
}

function getTransform({x = 0, y = 0, zoom = 1, width, targetWidth}) {
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

function ReactImageLightbox(props) {
    const [state, setLightboxState] = useState({
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
    const [, forceUpdate] = useReducer(value => value + 1, 0);

    const outerEl = useRef(null);
    const zoomInBtn = useRef(null);
    const zoomOutBtn = useRef(null);
    const caption = useRef(null);

    const propsRef = useRef(props);
    propsRef.current = props;

    const stateRef = useRef(state);
    stateRef.current = state;

    const didUnmountRef = useRef(false);
    const listenersRef = useRef({});
    const windowContextRef = useRef(null);
    const timeoutsRef = useRef([]);
    const currentActionRef = useRef(ACTION_NONE);
    const eventsSourceRef = useRef(SOURCE_ANY);
    const pointerListRef = useRef([]);
    const preventInnerCloseRef = useRef(false);
    const preventInnerCloseTimeoutRef = useRef(null);
    const keyPressedRef = useRef(false);
    const imageCacheRef = useRef({});
    const lastKeyDownTimeRef = useRef(0);
    const resizeTimeoutRef = useRef(null);
    const wheelActionTimeoutRef = useRef(null);
    const resetScrollTimeoutRef = useRef(null);
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
    const pinchTouchListRef = useRef(null);
    const pinchDistanceRef = useRef(0);
    const keyCounterRef = useRef(0);
    const moveRequestedRef = useRef(false);
    const mountedAnimationDisabledRef = useRef(props.animationDisabled);
    const previousPropsRef = useRef(props);
    const actionsRef = useRef({});

    const setState = update => {
        setLightboxState(prevState => ({
            ...prevState,
            ...(typeof update === "function" ? update(prevState) : update)
        }));
    };

    const setManagedTimeout = (func, time) => {
        const id = setTimeout(() => {
            timeoutsRef.current = timeoutsRef.current.filter(tid => tid !== id);
            func();
        }, time);
        timeoutsRef.current.push(id);
        return id;
    };

    const clearManagedTimeout = id => {
        timeoutsRef.current = timeoutsRef.current.filter(tid => tid !== id);
        clearTimeout(id);
    };

    const getSrcTypes = () => [
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

    const getZoomMultiplier = (nextZoomLevel = stateRef.current.zoomLevel) =>
        ZOOM_RATIO ** nextZoomLevel;

    const getLightboxRect = () => {
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

    const isAnimating = () =>
        stateRef.current.shouldAnimate || stateRef.current.isClosing;

    const isImageLoaded = imageSrc =>
        imageSrc &&
        imageSrc in imageCacheRef.current &&
        imageCacheRef.current[imageSrc].loaded;

    const getFitSizes = (width, height, stretch) => {
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

    const getBestImageForType = srcType => {
        let imageSrc = propsRef.current[srcType];
        let fitSizes = {};

        if (isImageLoaded(imageSrc)) {
            fitSizes = getFitSizes(
                imageCacheRef.current[imageSrc].width,
                imageCacheRef.current[imageSrc].height
            );
        } else if (isImageLoaded(propsRef.current[`${srcType}Thumbnail`])) {
            imageSrc = propsRef.current[`${srcType}Thumbnail`];
            fitSizes = getFitSizes(
                imageCacheRef.current[imageSrc].width,
                imageCacheRef.current[imageSrc].height,
                true
            );
        } else {
            return null;
        }

        return {
            src: imageSrc,
            height: imageCacheRef.current[imageSrc].height,
            width: imageCacheRef.current[imageSrc].width,
            targetHeight: fitSizes.height,
            targetWidth: fitSizes.width
        };
    };

    const getMaxOffsets = (nextZoomLevel = stateRef.current.zoomLevel) => {
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

    const changeZoom = (nextLevel, clientX, clientY) => {
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

    const setPreventInnerClose = () => {
        if (preventInnerCloseTimeoutRef.current) {
            clearManagedTimeout(preventInnerCloseTimeoutRef.current);
        }
        preventInnerCloseRef.current = true;
        preventInnerCloseTimeoutRef.current = setManagedTimeout(() => {
            preventInnerCloseRef.current = false;
            preventInnerCloseTimeoutRef.current = null;
        }, 100);
    };

    const handleMoveStart = ({x: clientX, y: clientY}) => {
        if (!propsRef.current.enableZoom) {
            return;
        }
        currentActionRef.current = ACTION_MOVE;
        moveStartXRef.current = clientX;
        moveStartYRef.current = clientY;
        moveStartOffsetXRef.current = stateRef.current.offsetX;
        moveStartOffsetYRef.current = stateRef.current.offsetY;
    };

    const handleMove = ({x: clientX, y: clientY}) => {
        const currentState = stateRef.current;
        const newOffsetX =
            moveStartXRef.current - clientX + moveStartOffsetXRef.current;
        const newOffsetY =
            moveStartYRef.current - clientY + moveStartOffsetYRef.current;
        if (
            currentState.offsetX !== newOffsetX ||
            currentState.offsetY !== newOffsetY
        ) {
            setState({
                offsetX: newOffsetX,
                offsetY: newOffsetY
            });
        }
    };

    const handleMoveEnd = () => {
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
            nextOffsetX !== currentState.offsetX ||
            nextOffsetY !== currentState.offsetY
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

    const handleSwipeStart = ({x: clientX, y: clientY}) => {
        currentActionRef.current = ACTION_SWIPE;
        swipeStartXRef.current = clientX;
        swipeStartYRef.current = clientY;
        swipeEndXRef.current = clientX;
        swipeEndYRef.current = clientY;
    };

    const handleSwipe = ({x: clientX, y: clientY}) => {
        swipeEndXRef.current = clientX;
        swipeEndYRef.current = clientY;
    };

    const requestMove = (direction, event) => {
        const nextState = {
            zoomLevel: MIN_ZOOM_LEVEL,
            offsetX: 0,
            offsetY: 0
        };

        if (
            !propsRef.current.animationDisabled &&
            (!keyPressedRef.current || propsRef.current.animationOnKeyInput)
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

    const requestMoveNext = event => {
        requestMove("next", event);
    };

    const requestMovePrev = event => {
        requestMove("prev", event);
    };

    const handleSwipeEnd = event => {
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
        pointerList = pinchTouchListRef.current
    ) => Math.sqrt((pointerList[0].x - pointerList[1].x) ** 2 + (pointerList[0].y - pointerList[1].y) ** 2);

    const calculatePinchCenter = (pointerList = pinchTouchListRef.current) => ({
        x: pointerList[0].x - (pointerList[0].x - pointerList[1].x) / 2,
        y: pointerList[0].y - (pointerList[0].y - pointerList[1].y) / 2
    });

    const handlePinchStart = pointerList => {
        if (!propsRef.current.enableZoom) {
            return;
        }
        currentActionRef.current = ACTION_PINCH;
        pinchTouchListRef.current = pointerList.map(({id, x, y}) => ({id, x, y}));
        pinchDistanceRef.current = calculatePinchDistance();
    };

    const handlePinch = pointerList => {
        pinchTouchListRef.current = pinchTouchListRef.current.map(oldPointer => {
            for (let i = 0; i < pointerList.length; i += 1) {
                if (pointerList[i].id === oldPointer.id) {
                    return pointerList[i];
                }
            }

            return oldPointer;
        });

        const newDistance = calculatePinchDistance();
        const nextZoomLevel =
            stateRef.current.zoomLevel + newDistance - pinchDistanceRef.current;

        pinchDistanceRef.current = newDistance;
        const {x: clientX, y: clientY} = calculatePinchCenter();
        changeZoom(nextZoomLevel, clientX, clientY);
    };

    const handlePinchEnd = () => {
        currentActionRef.current = ACTION_NONE;
        pinchTouchListRef.current = null;
        pinchDistanceRef.current = 0;
    };

    const handleEnd = event => {
        switch (currentActionRef.current) {
            case ACTION_MOVE:
                handleMoveEnd(event);
                break;
            case ACTION_SWIPE:
                handleSwipeEnd(event);
                break;
            case ACTION_PINCH:
                handlePinchEnd(event);
                break;
            default:
                break;
        }
    };

    const decideMoveOrSwipe = pointer => {
        if (stateRef.current.zoomLevel <= MIN_ZOOM_LEVEL) {
            handleSwipeStart(pointer);
        } else {
            handleMoveStart(pointer);
        }
    };

    const multiPointerStart = event => {
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

    const multiPointerMove = (event, pointerList) => {
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

    const multiPointerEnd = event => {
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

    const shouldHandleEvent = source => {
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

    const addPointer = pointer => {
        pointerListRef.current.push(pointer);
    };

    const removePointer = pointer => {
        pointerListRef.current = pointerListRef.current.filter(
            ({id}) => id !== pointer.id
        );
    };

    const handleMouseDown = event => {
        if (shouldHandleEvent(SOURCE_MOUSE) && isTargetMatchImage(event.target)) {
            addPointer(parseMouseEvent(event));
            multiPointerStart(event);
        }
    };

    const handleMouseMove = event => {
        if (shouldHandleEvent(SOURCE_MOUSE)) {
            multiPointerMove(event, [parseMouseEvent(event)]);
        }
    };

    const handleMouseUp = event => {
        if (shouldHandleEvent(SOURCE_MOUSE)) {
            removePointer(parseMouseEvent(event));
            multiPointerEnd(event);
        }
    };

    const handlePointerEvent = event => {
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

    const handleTouchStart = event => {
        if (shouldHandleEvent(SOURCE_TOUCH) && isTargetMatchImage(event.target)) {
            [].forEach.call(event.changedTouches, eventTouch =>
                addPointer(parseTouchPointer(eventTouch))
            );
            multiPointerStart(event);
        }
    };

    const handleTouchMove = event => {
        if (shouldHandleEvent(SOURCE_TOUCH)) {
            multiPointerMove(
                event,
                [].map.call(event.changedTouches, eventTouch =>
                    parseTouchPointer(eventTouch)
                )
            );
        }
    };

    const handleTouchEnd = event => {
        if (shouldHandleEvent(SOURCE_TOUCH)) {
            [].map.call(event.changedTouches, touch =>
                removePointer(parseTouchPointer(touch))
            );
            multiPointerEnd(event);
        }
    };

    const handleWindowResize = () => {
        clearManagedTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = setManagedTimeout(() => {
            forceUpdate();
        }, 100);
    };

    const handleZoomInButtonClick = () => {
        const nextZoomLevel =
            stateRef.current.zoomLevel + ZOOM_BUTTON_INCREMENT_SIZE;
        changeZoom(nextZoomLevel);
        if (nextZoomLevel === MAX_ZOOM_LEVEL && zoomOutBtn.current) {
            zoomOutBtn.current.focus();
        }
    };

    const handleZoomOutButtonClick = () => {
        const nextZoomLevel =
            stateRef.current.zoomLevel - ZOOM_BUTTON_INCREMENT_SIZE;
        changeZoom(nextZoomLevel);
        if (nextZoomLevel === MIN_ZOOM_LEVEL && zoomInBtn.current) {
            zoomInBtn.current.focus();
        }
    };

    const handleCaptionMousewheel = event => {
        event.stopPropagation();

        if (!caption.current) {
            return;
        }

        const {height} = caption.current.getBoundingClientRect();
        const {scrollHeight, scrollTop} = caption.current;
        if (
            (event.deltaY > 0 && height + scrollTop >= scrollHeight) ||
            (event.deltaY < 0 && scrollTop <= 0)
        ) {
            event.preventDefault();
        }
    };

    const loadImage = (srcType, imageSrc, done) => {
        if (isImageLoaded(imageSrc)) {
            setManagedTimeout(() => {
                done();
            }, 1);
            return;
        }

        const inMemoryImage = new global.Image();

        if (propsRef.current.imageCrossOrigin) {
            inMemoryImage.crossOrigin = propsRef.current.imageCrossOrigin;
        }

        inMemoryImage.onerror = errorEvent => {
            propsRef.current.onImageLoadError(imageSrc, srcType, errorEvent);

            setState(prevState => ({
                loadErrorStatus: {...prevState.loadErrorStatus, [srcType]: true}
            }));

            done(errorEvent);
        };

        inMemoryImage.onload = () => {
            propsRef.current.onImageLoad(imageSrc, srcType, inMemoryImage);

            imageCacheRef.current[imageSrc] = {
                loaded: true,
                width: inMemoryImage.width,
                height: inMemoryImage.height
            };

            done();
        };

        inMemoryImage.src = imageSrc;
    };

    const loadAllImages = (nextProps = propsRef.current) => {
        const generateLoadDoneCallback = (srcType, imageSrc) => err => {
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

    const requestClose = event => {
        const closeLightbox = () => propsRef.current.onCloseRequest(event);

        if (
            propsRef.current.animationDisabled ||
            (event.type === "keydown" && !propsRef.current.animationOnKeyInput)
        ) {
            closeLightbox();
            return;
        }

        setState({isClosing: true});
        setManagedTimeout(closeLightbox, propsRef.current.animationDuration);
    };

    const closeIfClickInner = event => {
        if (
            !preventInnerCloseRef.current &&
            event.target.className.search(/\bril-inner\b/) > -1
        ) {
            requestClose(event);
        }
    };

    const handleKeyInput = event => {
        event.stopPropagation();

        if (isAnimating()) {
            return;
        }

        if (event.type === "keyup") {
            lastKeyDownTimeRef.current -= propsRef.current.keyRepeatKeyupBonus;
            return;
        }

        const keyCode = event.which || event.keyCode;
        const currentTime = new Date();
        if (
            currentTime.getTime() - lastKeyDownTimeRef.current <
                propsRef.current.keyRepeatLimit &&
            keyCode !== KEYS.ESC
        ) {
            return;
        }
        lastKeyDownTimeRef.current = currentTime.getTime();

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

    const handleOuterMousewheel = event => {
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
                scrollXRef.current <= -1 * xThreshold ||
                event.deltaX <= -1 * bigLeapX
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

    const handleImageMouseWheel = event => {
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

    const handleImageDoubleClick = event => {
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
            mouseup: event => actionsRef.current.handleMouseUp(event),
            touchend: event => actionsRef.current.handleTouchEnd(event),
            touchcancel: event => actionsRef.current.handleTouchEnd(event),
            pointerdown: event => actionsRef.current.handlePointerEvent(event),
            pointermove: event => actionsRef.current.handlePointerEvent(event),
            pointerup: event => actionsRef.current.handlePointerEvent(event),
            pointercancel: event => actionsRef.current.handlePointerEvent(event)
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
            timeoutsRef.current.forEach(tid => clearTimeout(tid));
        };
    }, []);

    useEffect(() => {
        const prevProps = previousPropsRef.current;
        let sourcesChanged = false;
        const prevSrcDict = {};
        const nextSrcDict = {};

        getSrcTypes().forEach(srcType => {
            if (prevProps[srcType.name] !== props[srcType.name]) {
                sourcesChanged = true;
                prevSrcDict[prevProps[srcType.name]] = true;
                nextSrcDict[props[srcType.name]] = true;
            }
        });

        if (sourcesChanged || moveRequestedRef.current) {
            Object.keys(prevSrcDict).forEach(prevSrc => {
                if (
                    !(prevSrc in nextSrcDict) &&
                    prevSrc in imageCacheRef.current
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
    let transitionStyle = {};

    if (!animationDisabled && isAnimating()) {
        transitionStyle = {
            ...transitionStyle,
            transition: `transform ${animationDuration}ms`
        };
    }

    const keyEndings = {};
    getSrcTypes().forEach(({name, keyEnding}) => {
        keyEndings[name] = keyEnding;
    });

    const images = [];
    const addImage = (srcType, imageClass, transforms) => {
        if (!props[srcType]) {
            return;
        }
        const bestImageInfo = getBestImageForType(srcType);

        const imageStyle = {
            ...transitionStyle,
            ...getTransform({
                ...transforms,
                ...bestImageInfo
            })
        };

        if (zoomLevel > MIN_ZOOM_LEVEL) {
            imageStyle.cursor = "move";
        }

        const hasTrueValue = object =>
            Object.keys(object).some(key => object[key]);

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
            images.push(
                <img
                    {...(imageCrossOrigin ? {crossOrigin: imageCrossOrigin} : {})}
                    className={`${imageClass} ril__image`}
                    onDoubleClick={handleImageDoubleClick}
                    onWheel={handleImageMouseWheel}
                    onDragStart={e => e.preventDefault()}
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

    const modalStyle = {
        overlay: {
            zIndex: 1000,
            backgroundColor: "transparent",
            ...reactModalStyle.overlay
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
            ...reactModalStyle.content
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
                typeof global.window !== "undefined"
                    ? global.window.document.body
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
                tabIndex="-1"
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
                        {toolbarButtons &&
                            toolbarButtons.map((button, i) => (
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

ReactImageLightbox.isTargetMatchImage = isTargetMatchImage;
ReactImageLightbox.parseMouseEvent = parseMouseEvent;
ReactImageLightbox.parseTouchPointer = parseTouchPointer;
ReactImageLightbox.parsePointerEvent = parsePointerEvent;
ReactImageLightbox.getTransform = getTransform;

ReactImageLightbox.propTypes = {
    //-----------------------------
    // Image sources
    //-----------------------------

    // Main display image url
    mainSrc: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types

    // Previous display image url (displayed to the left)
    // If left undefined, movePrev actions will not be performed, and the button not displayed
    prevSrc: PropTypes.string,

    // Next display image url (displayed to the right)
    // If left undefined, moveNext actions will not be performed, and the button not displayed
    nextSrc: PropTypes.string,

    //-----------------------------
    // Image thumbnail sources
    //-----------------------------

    // Thumbnail image url corresponding to props.mainSrc
    mainSrcThumbnail: PropTypes.string, // eslint-disable-line react/no-unused-prop-types

    // Thumbnail image url corresponding to props.prevSrc
    prevSrcThumbnail: PropTypes.string, // eslint-disable-line react/no-unused-prop-types

    // Thumbnail image url corresponding to props.nextSrc
    nextSrcThumbnail: PropTypes.string, // eslint-disable-line react/no-unused-prop-types

    //-----------------------------
    // Event Handlers
    //-----------------------------

    // Close window event
    // Should change the parent state such that the lightbox is not rendered
    onCloseRequest: PropTypes.func.isRequired,

    // Move to previous image event
    // Should change the parent state such that props.prevSrc becomes props.mainSrc,
    //  props.mainSrc becomes props.nextSrc, etc.
    onMovePrevRequest: PropTypes.func,

    // Move to next image event
    // Should change the parent state such that props.nextSrc becomes props.mainSrc,
    //  props.mainSrc becomes props.prevSrc, etc.
    onMoveNextRequest: PropTypes.func,

    // Called when an image fails to load
    // (imageSrc: string, srcType: string, errorEvent: object): void
    onImageLoadError: PropTypes.func,

    // Called when image successfully loads
    onImageLoad: PropTypes.func,

    // Open window event
    onAfterOpen: PropTypes.func,

    //-----------------------------
    // Download discouragement settings
    //-----------------------------

    // Enable download discouragement (prevents [right-click -> Save Image As...])
    discourageDownloads: PropTypes.bool,

    //-----------------------------
    // Animation settings
    //-----------------------------

    // Disable all animation
    animationDisabled: PropTypes.bool,

    // Disable animation on actions performed with keyboard shortcuts
    animationOnKeyInput: PropTypes.bool,

    // Animation duration (ms)
    animationDuration: PropTypes.number,

    //-----------------------------
    // Keyboard shortcut settings
    //-----------------------------

    // Required interval of time (ms) between key actions
    // (prevents excessively fast navigation of images)
    keyRepeatLimit: PropTypes.number,

    // Amount of time (ms) restored after each keyup
    // (makes rapid key presses slightly faster than holding down the key to navigate images)
    keyRepeatKeyupBonus: PropTypes.number,

    //-----------------------------
    // Image info
    //-----------------------------

    // Image title
    imageTitle: PropTypes.node,

    // Image caption
    imageCaption: PropTypes.node,

    // Optional crossOrigin attribute
    imageCrossOrigin: PropTypes.string,

    //-----------------------------
    // Lightbox style
    //-----------------------------

    // Set z-index style, etc., for the parent react-modal (format: https://github.com/reactjs/react-modal#styles )
    reactModalStyle: PropTypes.shape({}),

    // Padding (px) between the edge of the window and the lightbox
    imagePadding: PropTypes.number,

    wrapperClassName: PropTypes.string,

    //-----------------------------
    // Other
    //-----------------------------

    // Array of custom toolbar buttons
    toolbarButtons: PropTypes.arrayOf(PropTypes.node),

    // When true, clicks outside of the image close the lightbox
    clickOutsideToClose: PropTypes.bool,

    // Set to false to disable zoom functionality and hide zoom buttons
    enableZoom: PropTypes.bool,

    // Override props set on react-modal (https://github.com/reactjs/react-modal)
    reactModalProps: PropTypes.shape({}),

    // Aria-labels
    nextLabel: PropTypes.string,
    prevLabel: PropTypes.string,
    zoomInLabel: PropTypes.string,
    zoomOutLabel: PropTypes.string,
    closeLabel: PropTypes.string,

    imageLoadErrorMessage: PropTypes.node,

    // custom loader
    loader: PropTypes.node
};

ReactImageLightbox.defaultProps = {
    imageTitle: null,
    imageCaption: null,
    toolbarButtons: null,
    reactModalProps: {},
    animationDisabled: false,
    animationDuration: 300,
    animationOnKeyInput: false,
    clickOutsideToClose: true,
    closeLabel: "Close lightbox",
    discourageDownloads: false,
    enableZoom: true,
    imagePadding: 10,
    imageCrossOrigin: null,
    keyRepeatKeyupBonus: 40,
    keyRepeatLimit: 180,
    mainSrcThumbnail: null,
    nextLabel: "Next image",
    nextSrc: null,
    nextSrcThumbnail: null,
    onAfterOpen: () => {},
    onImageLoadError: () => {},
    onImageLoad: () => {},
    onMoveNextRequest: () => {},
    onMovePrevRequest: () => {},
    prevLabel: "Previous image",
    prevSrc: null,
    prevSrcThumbnail: null,
    reactModalStyle: {},
    wrapperClassName: "",
    zoomInLabel: "Zoom in",
    zoomOutLabel: "Zoom out",
    imageLoadErrorMessage: "This image failed to load",
    loader: undefined
};

export default ReactImageLightbox;
