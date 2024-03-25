import React, { useCallback, useEffect, useRef, useState } from 'react';

const ROOT_OVERLAY_ZINDEX = 1044;

export interface OverlayProps {
    parent: Overlay<any>;
    onClose: () => void;
    closeOnClick: boolean;
    closeOnEscape: boolean;
}

export class Overlay<E extends Element> {

    readonly element: React.RefObject<E> | null;
    private readonly onClose: (() => void) | undefined;
    readonly closeOnClick: boolean;
    readonly closeOnEscape: boolean;

    private readonly parent: Overlay<any> | undefined;
    private children: Overlay<any>[] = [];
    lower: Overlay<any> | null;
    closed: boolean = false;

    zIndex: number = ROOT_OVERLAY_ZINDEX;

    mouseDownX: number | undefined = undefined;
    mouseDownY: number | undefined = undefined;

    constructor(element: React.RefObject<E> | null, lower: Overlay<any> | null, props: Partial<OverlayProps>) {
        this.element = element;
        this.onClose = props.onClose;
        this.closeOnClick = props.closeOnClick ?? true;
        this.closeOnEscape = props.closeOnEscape ?? true;
        this.parent = props.parent;
        if (this.parent != null) {
            this.parent.children.push(this);
        }
        this.lower = lower;
        if (lower != null) {
            this.zIndex = lower.zIndex + 6;
        }
    }

    close(): void {
        this.children.forEach(o => o.close());
        this.children = [];
        if (this.onClose != null) {
            this.onClose();
        }
        if (this.parent != null) {
            this.parent.children = this.parent.children.filter(o => Object.is(o, this));
        }
        this.closed = true;
    }

}

export class OverlaysManager {

    private readonly rootOverlay: Overlay<any>;
    private topOverlay: Overlay<any>;

    constructor() {
        this.rootOverlay = new Overlay(null, null, {closeOnClick: false, closeOnEscape: false});
        this.topOverlay = this.rootOverlay;

        document.body.addEventListener("keydown", this.onKeyDown);
        document.body.addEventListener("mousedown", this.onMouseDown);
        document.body.addEventListener("mouseup", this.onMouseUp);
    }

    open<E extends Element>(element: React.RefObject<E>, props: Partial<OverlayProps> = {}): Overlay<E> {
        const overlay = new Overlay<E>(element, this.topOverlay, {parent: this.rootOverlay, ...props});
        this.topOverlay = overlay;
        return overlay;
    }

    close(overlay: Overlay<any>): void {
        if (overlay.closed) {
            return;
        }

        overlay.close();
        while (this.topOverlay.closed && this.topOverlay.lower != null) {
            this.topOverlay = this.topOverlay.lower;
        }
    }

    closeUppermost(): boolean {
        if (this.topOverlay.lower != null) {
            this.close(this.topOverlay);
            return true;
        }
        return false;
    }

    private onKeyDown = (event: KeyboardEvent) => {
        if ((event.key === "Escape" || event.key === "Esc") && this.topOverlay.closeOnEscape) {
            this.close(this.topOverlay);
        }
    };

    private onMouseDown = (e: MouseEvent) => {
        const overlay = this.topOverlay;
        if (!overlay.closeOnClick || overlay.element == null || overlay.element.current == null) {
            return;
        }

        const r = overlay.element.current.getBoundingClientRect();
        if (
            (r.left <= e.clientX && r.right >= e.clientX && r.top <= e.clientY && r.bottom >= e.clientY)
            || (e.clientX === 0 && e.clientY === 0) // Ugly hack, but need to workaround wrong mouse events in FF
        ) {
            overlay.mouseDownX = undefined;
            overlay.mouseDownY = undefined;
            return;
        }
        overlay.mouseDownX = e.clientX;
        overlay.mouseDownY = e.clientY;
    }

    private onMouseUp = (e: MouseEvent) => {
        const overlay = this.topOverlay;
        if (!overlay.closeOnClick || overlay.element == null || overlay.element.current == null) {
            return;
        }

        if (
            overlay.mouseDownX != null && Math.abs(overlay.mouseDownX - e.clientX) <= 10
            && overlay.mouseDownY != null && Math.abs(overlay.mouseDownY - e.clientY) <= 10
        ) {
            this.close(overlay);
        }
        overlay.mouseDownX = undefined;
        overlay.mouseDownY = undefined;
    }

}

export type UseOverlayBag<E extends Element> = [
    React.RefObject<E>, () => void, number | undefined, number | undefined, Overlay<E> | null
];

export function useOverlay<E extends Element>(props: Partial<OverlayProps> = {}): UseOverlayBag<E> {
    const ref = useRef<E>(null);
    const [overlay, setOverlay] = useState<Overlay<E> | null>(null);
    useEffect(() => {
        setOverlay(overlay => overlay == null ? window.overlays.open(ref, props) : overlay);
    }, [props]);
    const onClose = useCallback(() => {
        if (overlay != null) {
            window.overlays.close(overlay);
            setOverlay(null);
        }
    }, [overlay]);
    return [
        ref,
        onClose,
        overlay?.zIndex,
        overlay != null ? overlay.zIndex + 3 : undefined,
        overlay
    ];
}
