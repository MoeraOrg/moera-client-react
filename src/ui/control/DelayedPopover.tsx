import React, { useCallback, useEffect, useState } from 'react';
import { Modifier, usePopper } from 'react-popper';
import PopperJS from '@popperjs/core';
import cx from "classnames";

import { PopoverContext } from "ui/control";

export type DelayedPopoverElement = (ref: (dom: Element | null) => void) => any;

interface Props {
    placement: PopperJS.Placement;
    arrow?: boolean;
    className?: string;
    styles?: "popover" | "menu";
    disabled?: boolean;
    clickable?: boolean;
    sticky?: boolean;
    onPreparePopper?: () => void;
    onShow?: () => boolean;
    element: DelayedPopoverElement;
    children: React.ReactNode;
}

type ClickLocus = "out" | "main" | "popup";

type TouchLocus = "none" | "touch" | "lock";

export function DelayedPopover({
    placement, arrow, className, styles = "popover", disabled, clickable, sticky, onPreparePopper, onShow, element,
    children
}: Props) {
    // Such usage of useState() is counter-intuitive, but required by react-popper
    const [buttonRef, setButtonRef] = useState<Element | null>(null);
    const [popperRef, setPopperRef] = useState<HTMLElement | null>(null);
    const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);
    const modifiers: Modifier<any>[] = [{name: "arrow", options: {element: arrowRef}}];

    const {styles: popperStyles, attributes, state, forceUpdate} =
        usePopper(buttonRef, popperRef, {placement, modifiers});

    const [locus, setLocus] = useState<ClickLocus>("out");
    const [touch, setTouch] = useState<TouchLocus>("none");
    const [scrollY, setScrollY] = useState<number | null>(null);
    const [popup, setPopup] = useState<boolean>(false);

    const hide = useCallback(() => {
        setPopup(false);
        if (touch !== "none") {
            setLocus("out");
            setTouch("none");
        }
    }, [touch]);

    const show = useCallback(() => {
        if (onShow && !onShow()) {
            return;
        }

        setPopup(true);
        if (touch === "touch") {
            setTouch("lock");
        }
    }, [onShow, touch]);

    const documentClick = useCallback((event: MouseEvent) => {
        if (!disabled && (!clickable || !isInPopover(event))) {
            hide();
        }
    }, [clickable, disabled, hide]);

    useEffect(() => {
        if (popup) {
            document.addEventListener("click", documentClick);
            return () => document.removeEventListener("click", documentClick);
        }
    }, [documentClick, popup]);

    const onTimeout = useCallback(() => {
        if (touch !== "none" && scrollY != null && Math.abs(scrollY - window.scrollY) > 10) {
            setLocus("out");
            setTouch("none");
            return;
        }

        switch (locus) {
            case "out":
                hide();
                break;
            case "main":
                show();
                break;
            default:
            // do nothing
        }
    }, [hide, locus, scrollY, show, touch]);

    useEffect(() => {
        if (disabled) {
            return;
        }

        if (locus === "main" && onPreparePopper) {
            onPreparePopper();
        }
        const id = setTimeout(onTimeout, 1000);
        return () => clearTimeout(id);
    }, [disabled, locus, onPreparePopper, onTimeout]);

    useEffect(() => {
        if (touch !== "none") {
            setScrollY(window.scrollY);
            return () => setScrollY(null);
        }
    }, [touch]);

    const documentClickCapture = useCallback((event: MouseEvent) => {
        if (!disabled) {
            switch (touch) {
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
    }, [disabled, hide, touch]);

    useEffect(() => {
        if (touch !== "none") {
            document.addEventListener("click", documentClickCapture, {capture: true, passive: false});
            return () => document.removeEventListener("click", documentClickCapture, {capture: true});
        }
    }, [documentClickCapture, touch]);

    const contextMenu = useCallback((event: MouseEvent) => {
        if (touch === "touch") {
            event.preventDefault();
        }
    }, [touch]);

    useEffect(() => {
        if (touch === "touch") {
            document.addEventListener("contextmenu", contextMenu);
            return () => document.removeEventListener("contextmenu", contextMenu);
        }
    }, [contextMenu, touch]);

    const mainEnter = useCallback(() => setLocus("main"), []);

    const mainLeave = useCallback(() => {
        if (locus === "main") {
            setLocus("out");
        }
    }, [locus]);

    const mainTouch = useCallback(() => {
        if (locus === "out") {
            setLocus("main");
            setTouch("touch");
        }
    }, [locus]);

    useEffect(() => {
        if (buttonRef != null) {
            buttonRef.addEventListener("mouseenter", mainEnter);
            if (!sticky) {
                buttonRef.addEventListener("mouseleave", mainLeave);
            }
            buttonRef.addEventListener("touchstart", mainTouch);

            return () => {
                buttonRef.removeEventListener("mouseenter", mainEnter);
                if (!sticky) {
                    buttonRef.removeEventListener("mouseleave", mainLeave);
                }
                buttonRef.removeEventListener("touchstart", mainTouch);
            }
        }
    }, [buttonRef, mainEnter, mainLeave, mainTouch, sticky]);

    const popupEnter = () => setLocus("popup");

    const popupLeave = () => {
        if (locus === "popup") {
            setLocus("out");
        }
    };

    return (
        <PopoverContext.Provider value={{hide, update: forceUpdate ?? (() => {})}}>
            {element(setButtonRef)}
            {(popup || locus !== "out") &&
                <div ref={setPopperRef} style={popperStyles.popper} {...attributes.popper} className={cx(
                    "shadow",
                    "fade",
                    `bs-popover-${state?.placement}`, // activates Bootstrap style for .popover-arrow
                    {
                        "popover": styles === "popover",
                        "dropdown-menu": styles === "menu",
                        "show": popup
                    },
                    className
                )}>
                    {arrow &&
                        <div ref={setArrowRef} style={popperStyles.arrow} {...attributes.arrow}
                             className="popover-arrow"/>
                    }
                    <div className={cx({"popover-body": styles === "popover"})}
                         onMouseEnter={popupEnter}
                         onMouseLeave={!sticky ? popupLeave : undefined}>
                        {children}
                    </div>
                </div>
            }
        </PopoverContext.Provider>
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
