import type { CSSProperties } from 'react';

// Min image zoom level
export const MIN_ZOOM_LEVEL = 0;

// Max image zoom level
export const MAX_ZOOM_LEVEL = 300;

export const ANIMATION_DURATION_MS = 300;

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

interface TouchListLike {
    item(index: number): TouchPointerLike | null;
    length: number;
}

export interface TransformInput {
    targetWidth: number;
    width: number;
    x?: number;
    y?: number;
    zoom?: number;
}

export function isTargetMatchImage(target: EventTarget | null): boolean {
    return target instanceof Element
        && /\bril-image-current\b/.test(target.getAttribute("class") ?? "");
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

export function getTouches(touchList: TouchListLike): TouchPointerLike[] {
    return Array.from({length: touchList.length}, (_, index) => touchList.item(index)).filter(
        (touch): touch is TouchPointerLike => touch !== null
    );
}

export function getTransform({
    x = 0,
    y = 0,
    zoom = 1,
    width,
    targetWidth
}: TransformInput): CSSProperties {
    let nextX = x;
    const windowWidth = window.innerWidth;
    if (width > windowWidth) {
        nextX += (windowWidth - width) / 2;
    }
    const scaleFactor = zoom * (targetWidth / width);

    return {
        transform: `translate3d(${nextX}px,${y}px,0) scale3d(${scaleFactor},${scaleFactor},1)`
    };
}
