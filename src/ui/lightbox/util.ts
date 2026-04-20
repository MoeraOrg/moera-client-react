// Based on react-image-lightbox 5.1.4 by Chris Fritz (MIT License).

// Min image zoom level
export const MIN_ZOOM_LEVEL = 0;

// Max image zoom level
export const MAX_ZOOM_LEVEL = 300;

export const ANIMATION_DURATION_MS = 300;

// How much to increase/decrease the zoom level when the zoom buttons are clicked
export const ZOOM_BUTTON_INCREMENT_SIZE = 100;

// Used to judge the amount of horizontal scroll needed to initiate an image move
export const WHEEL_MOVE_X_THRESHOLD = 200;

export const WHEEL_MOVE_Y_THRESHOLD = 1;

interface CoordinateEventLike {
    clientX: number;
    clientY: number;
}

export interface InputPointer {
    id: number | string;
    source: number;
    x: number;
    y: number;
}

// Events source
export const SOURCE_ANY = 0;
export const SOURCE_MOUSE = 1;
export const SOURCE_TOUCH = 2;
export const SOURCE_POINTER = 3;

interface TouchPointerLike extends CoordinateEventLike {
    identifier: number;
}

export function isTargetMainImage(target: EventTarget | null): boolean {
    return target instanceof Element
        && target.classList.contains("ril__imageMain");
}

export function parseMouseEvent(mouseEvent: CoordinateEventLike): InputPointer {
    return {
        id: "mouse",
        source: SOURCE_MOUSE,
        x: Math.trunc(mouseEvent.clientX),
        y: Math.trunc(mouseEvent.clientY)
    };
}

export function parseTouchPointer(touchPointer: TouchPointerLike): InputPointer {
    return {
        id: touchPointer.identifier,
        source: SOURCE_TOUCH,
        x: Math.trunc(touchPointer.clientX),
        y: Math.trunc(touchPointer.clientY)
    };
}

export function parsePointerEvent(pointerEvent: PointerEvent): InputPointer {
    return {
        id: pointerEvent.pointerId,
        source: SOURCE_POINTER,
        x: Math.trunc(pointerEvent.clientX),
        y: Math.trunc(pointerEvent.clientY)
    };
}
