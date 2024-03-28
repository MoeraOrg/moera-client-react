import React, { useCallback, useRef, useSyncExternalStore } from 'react';

import { disableBodyScroll, enableBodyScroll } from "ui/browser";
import { randomId } from "util/ui";

const ROOT_OVERLAY_ZINDEX = 1044;

export interface OverlayProps {
    parentId: string;
    onClose: () => void;
    closeOnClick: boolean;
    closeOnEscape: boolean;
    closeOnBack: boolean;
}

export interface OverlayZIndex {
    shadow: number;
    widget: number;
}

export class Overlay<E extends Element> {

    readonly element: React.RefObject<E> | E | null;
    private onClose: (() => void) | undefined;
    closeOnClick: boolean = false;
    closeOnEscape: boolean = false;
    closeOnBack: boolean = false;

    private readonly parent: Overlay<Element> | null;
    private children: Overlay<Element>[] = [];
    lower: Overlay<Element> | null;
    destroyed: boolean = false;

    readonly zIndex: OverlayZIndex;

    mouseDownX: number | undefined = undefined;
    mouseDownY: number | undefined = undefined;

    constructor(
        element: React.RefObject<E> | E | null, lower: Overlay<Element> | null, parent: Overlay<Element> | null
    ) {
        this.element = element;
        this.parent = parent;
        if (this.parent != null) {
            this.parent.children.push(this);
        }
        this.lower = lower;
        if (lower != null) {
            this.zIndex = {shadow: lower.zIndex.shadow + 6, widget: lower.zIndex.widget + 6};
        } else {
            this.zIndex = {shadow: ROOT_OVERLAY_ZINDEX, widget: ROOT_OVERLAY_ZINDEX + 3};
        }
    }

    setProps(props: Partial<OverlayProps>) {
        this.onClose = props.onClose;
        const closable = props.onClose != null;
        this.closeOnClick = props.closeOnClick ?? closable;
        this.closeOnEscape = props.closeOnEscape ?? closable;
        this.closeOnBack = props.closeOnBack ?? closable;
    }

    private closeChildren(): void {
        this.children.forEach(o => o.close());
        this.children = [];
    }

    private destroySelf(): void {
        if (this.parent != null) {
            this.parent.children = this.parent.children.filter(o => Object.is(o, this));
        }
        this.destroyed = true;
    }

    destroy(): void {
        this.closeChildren();
        this.destroySelf();
    }

    close(): void {
        this.closeChildren();
        if (this.onClose != null) {
            this.onClose();
        }
        this.destroySelf();
    }

}

export class OverlaysManager {

    private readonly overlays: Map<string, Overlay<any>> = new Map();
    private readonly rootOverlay: Overlay<Element>;
    private topOverlay: Overlay<Element>;

    constructor() {
        this.rootOverlay = new Overlay(null, null, null);
        this.rootOverlay.setProps({})
        this.topOverlay = this.rootOverlay;

        document.body.addEventListener("keydown", this.onKeyDown);
        document.body.addEventListener("mousedown", this.onMouseDown);
        document.body.addEventListener("mouseup", this.onMouseUp);
    }

    open<E extends Element>(
        id: string, element: React.RefObject<E> | E | null, parentId: string | null | undefined
    ): Overlay<E> {
        const parent = parentId != null ? this.overlays.get(parentId) : null;
        const overlay = new Overlay<E>(element, this.topOverlay, parent ?? this.rootOverlay);
        this.overlays.set(id, overlay);
        this.topOverlay = overlay;
        disableBodyScroll();
        return overlay;
    }

    get(id: string): Overlay<Element> | undefined {
        return this.overlays.get(id);
    }

    private destroyOverlay(overlay: Overlay<Element> | null | undefined): void {
        if (overlay == null || overlay.destroyed) {
            return;
        }

        overlay.destroy();
        this.updateTopOverlay();
    }

    destroy(id: string): void {
        const overlay = this.overlays.get(id);
        this.destroyOverlay(overlay);
        this.overlays.delete(id);
    }

    private closeOverlay(overlay: Overlay<Element> | null | undefined): void {
        if (overlay == null || overlay.destroyed) {
            return;
        }

        overlay.close();
        this.updateTopOverlay();
    }

    close(id: string): void {
        const overlay = this.overlays.get(id);
        this.closeOverlay(overlay);
        this.overlays.delete(id);
    }

    private updateTopOverlay(): void {
        while (this.topOverlay.destroyed && this.topOverlay.lower != null) {
            this.topOverlay = this.topOverlay.lower;
        }
        if (this.topOverlay.lower == null) {
            enableBodyScroll();
        }
    }

    mobileBack(): void {
        const overlay = this.topOverlay;
        if (overlay.lower == null) {
            window.Android?.back();
        } else if (overlay.closeOnBack) {
            this.closeOverlay(overlay);
        }
    }

    private onKeyDown = (event: KeyboardEvent) => {
        if ((event.key === "Escape" || event.key === "Esc") && this.topOverlay.closeOnEscape) {
            this.closeOverlay(this.topOverlay);
        }
    };

    private onMouseDown = (e: MouseEvent) => {
        const overlay = this.topOverlay;
        if (!overlay.closeOnClick || overlay.element == null) {
            return;
        }
        const element = isRef(overlay.element) ? overlay.element.current : overlay.element;
        if (element == null) {
            return;
        }

        const r = element.getBoundingClientRect();
        if (
            (r.left <= e.clientX && r.right >= e.clientX && r.top <= e.clientY && r.bottom >= e.clientY)
            || (e.clientX === 0 && e.clientY === 0) // Ugly hack, but need to work around wrong mouse events in FF
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
        if (!overlay.closeOnClick || overlay.element == null) {
            return;
        }
        const element = isRef(overlay.element) ? overlay.element.current : overlay.element;
        if (element == null) {
            return;
        }

        if (
            overlay.mouseDownX != null && Math.abs(overlay.mouseDownX - e.clientX) <= 10
            && overlay.mouseDownY != null && Math.abs(overlay.mouseDownY - e.clientY) <= 10
        ) {
            this.closeOverlay(overlay);
        }
        overlay.mouseDownX = undefined;
        overlay.mouseDownY = undefined;
    }

}

function isRef<E extends Element>(ref: React.RefObject<E> | E): ref is React.RefObject<E> {
    return 'current' in ref;
}

export const useNewOverlayId = (): React.MutableRefObject<string> => useRef<string>(randomId(4));

export function useOverlay<E extends Element>(
    id: string, ref: React.RefObject<E> | E | null, props: Partial<OverlayProps> = {}
): OverlayZIndex | undefined {
    const subscribe = useCallback(() => {
        window.overlays.open(id, ref, props.parentId);
        return () => window.overlays.destroy(id);
    }, [id, props.parentId, ref]);
    const zIndex = useSyncExternalStore(
        subscribe,
        () => {
            const overlay = window.overlays.get(id);
            return overlay?.zIndex;
        }
    );
    const overlay = window.overlays.get(id);
    overlay?.setProps(props);

    return zIndex;
}
