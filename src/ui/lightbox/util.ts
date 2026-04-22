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
    id: number;
    x: number;
    y: number;
}

interface PointerEventLike extends CoordinateEventLike {
    pointerId: number;
}

export function isTargetMainImage(target: EventTarget | null): boolean {
    return target instanceof Element
        && target.classList.contains("lightbox-image-main");
}

export function parsePointerEvent(pointerEvent: PointerEventLike): InputPointer {
    return {
        id: pointerEvent.pointerId,
        x: Math.trunc(pointerEvent.clientX),
        y: Math.trunc(pointerEvent.clientY)
    };
}
