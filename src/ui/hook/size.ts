import React from 'react';

export interface ElementSize {
    width: number;
    height: number;
}

const EMPTY_SIZE: ElementSize = {
    width: 0,
    height: 0,
};

function updateSize(
    setSize: React.Dispatch<React.SetStateAction<ElementSize>>,
    nextSize: ElementSize
): void {
    setSize(currentSize =>
        currentSize.width === nextSize.width && currentSize.height === nextSize.height ? currentSize : nextSize
    );
}

function getWindowSize(): ElementSize {
    if (typeof window === "undefined") {
        return EMPTY_SIZE;
    }

    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
}

// Based on @uidotdev/usehooks package

export function useWindowSize(): ElementSize {
    const [size, setSize] = React.useState<ElementSize>(getWindowSize);

    React.useLayoutEffect(() => {
        const handleResize = () => {
            updateSize(setSize, getWindowSize());
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return size;
}

export function useElementSize<T extends Element>(): [React.RefObject<T | null>, ElementSize] {
    const [element, setElement] = React.useState<T | null>(null);
    const [size, setSize] = React.useState<ElementSize>(EMPTY_SIZE);

    const elementRef = React.useRef<T | null>(null);
    // Keep a normal ref API while still reacting to ref attachment changes.
    const ref = React.useMemo<React.RefObject<T | null>>(() => ({
        get current() {
            return elementRef.current;
        },
        set current(node: T | null) {
            elementRef.current = node;
            setElement(current => current === node ? current : node);
        }
    }), []);

    React.useLayoutEffect(() => {
        if (element == null) {
            updateSize(setSize, EMPTY_SIZE);
            return;
        }

        const measure = () => {
            const rect = element.getBoundingClientRect();
            updateSize(setSize, {width: rect.width, height: rect.height});
        };

        measure();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", measure);
            return () => {
                window.removeEventListener("resize", measure);
            };
        }

        const observer = new ResizeObserver(measure);
        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [element]);

    return [ref, size];
}
