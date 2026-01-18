import React, { useCallback, useEffect, useRef, useState } from 'react';
import { arrow, flip, useFloating } from '@floating-ui/react';
import { Placement } from '@floating-ui/utils';
import cx from 'classnames';

import { PopoverContext } from "ui/control";
import { OverlayZIndex, useOverlay } from "ui/overlays/overlays";
import { ParentContext } from "ui/hook";
import { createPortalIfNeeded } from "util/ui";

export type DelayedPopoverElement = (ref: (dom: Element | null) => void) => any;

interface Props {
    placement: Placement;
    arrow?: boolean;
    className?: string;
    styles?: "popover" | "menu";
    disabled?: boolean;
    clickable?: boolean;
    sticky?: boolean;
    parentOverlayId?: string;
    onPreparePopper?: () => void;
    onShow?: () => boolean;
    onHide?: () => void;
    element: DelayedPopoverElement;
    popoverContainer?: Element | DocumentFragment | null;
    children: React.ReactNode;
}

type ClickLocus = "out" | "main" | "popup";

type TouchLocus = "none" | "touch" | "lock";

export function DelayedPopover({
    placement, arrow: withArrow, className, styles = "popover", disabled, clickable, sticky, parentOverlayId,
    onPreparePopper, onShow, onHide, element, popoverContainer, children
}: Props) {
    // Such usage of useState() is counter-intuitive, but required by react-popper
    const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);

    const {
        refs, floatingStyles, placement: finalPlacement, update, middlewareData
    } = useFloating({placement, middleware: [flip(), arrow({element: arrowRef})]});

    const locusRef = useRef<ClickLocus>("out");
    const touchRef = useRef<TouchLocus>("none");
    const [locusUpdates, setLocusUpdates] = useState<number>(0);
    const [touchUpdates, setTouchUpdates] = useState<number>(0);

    const getLocus = useCallback(() => locusRef.current, []);
    const setLocus = useCallback((locus: ClickLocus) => {
        locusRef.current = locus;
        setLocusUpdates(u => u + 1);
    }, []);
    const getTouch = useCallback(() => touchRef.current, []);
    const setTouch = useCallback((touch: TouchLocus) => {
        touchRef.current = touch;
        setTouchUpdates(u => u + 1);
    }, []);

    const [scrollY, setScrollY] = useState<number | null>(null);
    const [popup, setPopup] = useState<boolean>(false);

    let zIndex: OverlayZIndex | undefined;
    let overlayId: string = "";

    const hide = useCallback(() => {
        if (disabled || !window.overlays.isTopmostOverlay(overlayId)) {
            return;
        }
        // setTimeout() is needed here to dismiss the popup only after handling the click on elements inside the popup
        setTimeout(() => {
            setPopup(false);
            onHide && onHide();
        });
        if (getTouch() !== "none") {
            setLocus("out");
            setTouch("none");
        }
    }, [disabled, overlayId, getTouch, onHide, setLocus, setTouch]);

    const show = useCallback(() => {
        if (onShow && !onShow()) {
            return;
        }

        setPopup(true);
        if (getTouch() === "touch") {
            setTouch("lock");
        }
    }, [onShow, getTouch, setTouch]);

    [zIndex, overlayId] = useOverlay(
        refs.floating, {parentId: parentOverlayId, visible: popup, onClose: hide, closeOnSelect: !clickable}
    );

    const onTimeout = useCallback(() => {
        if (getTouch() !== "none" && scrollY != null && Math.abs(scrollY - window.scrollY) > 10) {
            setLocus("out");
            setTouch("none");
            return;
        }

        switch (getLocus()) {
            case "out":
                hide();
                break;
            case "main":
                show();
                break;
            default:
            // do nothing
        }
    }, [getTouch, scrollY, getLocus, setLocus, setTouch, hide, show]);

    useEffect(() => {
        if (disabled) {
            return;
        }

        if (getLocus() === "main" && onPreparePopper) {
            onPreparePopper();
        }
        const id = setTimeout(onTimeout, 1000);
        return () => clearTimeout(id);
    }, [disabled, getLocus, onPreparePopper, onTimeout, locusUpdates]);

    useEffect(() => {
        if (getTouch() !== "none") {
            setScrollY(window.scrollY);
            return () => setScrollY(null);
        }
    }, [getTouch, touchUpdates]);

    const documentClickCapture = useCallback((event: MouseEvent) => {
        if (!disabled) {
            switch (getTouch()) {
                case "touch":
                    setLocus("out");
                    setTouch("none");
                    break;
                case "lock":
                    if (isInPopover(event)) {
                        break;
                    }
                    hide();
                    event.preventDefault();
                    event.stopPropagation();
                    break;
                default:
                // do nothing
            }
        }
    }, [disabled, getTouch, hide, setLocus, setTouch]);

    useEffect(() => {
        if (getTouch() !== "none") {
            document.addEventListener("click", documentClickCapture, {capture: true, passive: false});
            return () => document.removeEventListener("click", documentClickCapture, {capture: true});
        }
    }, [documentClickCapture, getTouch, touchUpdates]);

    const contextMenu = useCallback((event: MouseEvent) => {
        if (getTouch() === "touch") {
            event.preventDefault();
        }
    }, [getTouch]);

    useEffect(() => {
        if (getTouch() === "touch") {
            document.addEventListener("contextmenu", contextMenu);
            return () => document.removeEventListener("contextmenu", contextMenu);
        }
    }, [contextMenu, getTouch, touchUpdates]);

    const mainEnter = useCallback(() => setLocus("main"), [setLocus]);

    const mainLeave = useCallback(() => {
        if (getLocus() === "main") {
            setLocus("out");
        }
    }, [getLocus, setLocus]);

    const mainTouch = useCallback(() => {
        if (getLocus() === "out") {
            setLocus("main");
            setTouch("touch");
        }
    }, [getLocus, setLocus, setTouch]);

    useEffect(() => {
        const buttonRef = refs.reference.current as Element | null;
        if (buttonRef != null) {
            buttonRef.addEventListener("mouseenter", mainEnter);
            if (!sticky) {
                buttonRef.addEventListener("mouseleave", mainLeave);
            }
            buttonRef.addEventListener("touchstart", mainTouch, {passive: true});

            return () => {
                buttonRef.removeEventListener("mouseenter", mainEnter);
                if (!sticky) {
                    buttonRef.removeEventListener("mouseleave", mainLeave);
                }
                buttonRef.removeEventListener("touchstart", mainTouch);
            }
        }
    }, [mainEnter, mainLeave, mainTouch, refs.reference, sticky]);

    const popupEnter = () => setLocus("popup");

    const popupLeave = () => {
        if (getLocus() === "popup") {
            setLocus("out");
        }
    };

    return (
        <ParentContext.Provider value={{hide, overlayId}}>
            <PopoverContext.Provider value={{update}}>
                {element(refs.setReference)}
                {popup && createPortalIfNeeded(
                    <div
                        ref={refs.setFloating}
                        style={{...floatingStyles, zIndex: zIndex?.widget}}
                        data-popper-placement={finalPlacement}
                        className={cx(
                            "shadow",
                            "fade",
                            "show",
                            `bs-popover-${finalPlacement}`, // activates Bootstrap style for .popover-arrow
                            {
                                "popover": styles === "popover",
                                "dropdown-menu": styles === "menu",
                            },
                            className
                        )}
                    >
                        {withArrow &&
                            <div
                                ref={setArrowRef}
                                style={{
                                    position: "absolute",
                                    left: middlewareData.arrow?.x,
                                    top: middlewareData.arrow?.y
                                }}
                                className="popover-arrow"
                            />
                        }
                        <div
                            className={cx({"popover-body": styles === "popover"})}
                            onMouseEnter={popupEnter}
                            onMouseLeave={!sticky ? popupLeave : undefined}
                        >
                            {children}
                        </div>
                    </div>,
                    popoverContainer
                )}
            </PopoverContext.Provider>
        </ParentContext.Provider>
    );
}

function isInPopover(event: MouseEvent) {
    return isInElements(event, ".popover-body") || isInElements(event, ".dropdown-menu");
}

function isInElements(event: MouseEvent, selector: string) {
    for (let element of document.querySelectorAll(selector).values()) {
        const r = element.getBoundingClientRect();
        if (r.left <= event.clientX && r.right >= event.clientX
            && r.top <= event.clientY && r.bottom >= event.clientY) {
            return true;
        }
    }
    return false;
}
