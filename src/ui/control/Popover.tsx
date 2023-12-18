import React, { useCallback, useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import cx from 'classnames';
import { Modifier, usePopper } from 'react-popper';
import { PositioningStrategy } from '@popperjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { PopoverContext } from "ui/control";

import "./Popover.css";

interface Props {
    className?: string;
    text?: string;
    textClassName?: string;
    icon?: IconProp;
    title?: string;
    element?: any;
    detached?: boolean;
    strategy?: PositioningStrategy;
    offset?: [number, number?];
    onToggle?: (visible: boolean) => void;
    children: React.ReactNode;
}

export function Popover({
    className, text, textClassName, icon, title, element, detached, strategy = "fixed", offset, onToggle, children
}: Props) {
    const [visible, setVisible] = useState<boolean>(false);

    // Such usage of useState() is counter-intuitive, but required by react-popper
    const [buttonRef, setButtonRef] = useState<Element | null>(null);
    const [popperRef, setPopperRef] = useState<HTMLElement | null>(null);
    const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);
    const modifiers: Modifier<any>[] = [{name: "arrow", options: {element: arrowRef}}];
    if (offset != null) {
        modifiers.push({name: "offset", options: {offset}});
    }
    const {styles, attributes, state, forceUpdate} =
        usePopper(buttonRef, popperRef, {placement: "bottom", strategy, modifiers});

    const documentClick = useCallback((event: MouseEvent) => {
        if (popperRef != null) {
            const r = popperRef.getBoundingClientRect();
            if (r.left <= event.clientX && r.right >= event.clientX
                && r.top <= event.clientY && r.bottom >= event.clientY
            ) {
                return;
            }
        }
        setVisible(false);
    }, [popperRef]);

    useEffect(() => {
        if (visible) {
            document.getElementById("app-root")!.addEventListener("click", documentClick);
            document.getElementById("modal-root")!.addEventListener("click", documentClick);

            return () => {
                document.getElementById("app-root")!.removeEventListener("click", documentClick);
                document.getElementById("modal-root")!.removeEventListener("click", documentClick);
            }
        }
    }, [documentClick, visible]);

    useEffect(() => {
        if (onToggle != null) {
            onToggle(visible);
        }
    }, [onToggle, visible]);

    useEffect(() => {
        if (visible) {
            forceUpdate && forceUpdate();
        }
    }, [forceUpdate, visible]);

    const toggle = () => setVisible(!visible);

    return (
        <PopoverContext.Provider value={{hide: () => setVisible(false), update: forceUpdate ?? (() => {})}}>
            <span ref={setButtonRef} onClick={toggle} title={title} className={cx(textClassName, {"active": visible})}>
                {element && React.createElement(element)}
                {icon && <FontAwesomeIcon icon={icon}/>}
                {text}
            </span>
            {ReactDOM.createPortal(
                (!detached || visible) &&
                    <div ref={setPopperRef} style={styles.popper} {...attributes.popper} className={cx(
                        "popover",
                        "fade",
                        `bs-popover-${state?.placement}`, // activates Bootstrap style for .popover-arrow
                        {"show": visible},
                        className
                    )}>
                        <div ref={setArrowRef} style={styles.arrow} {...attributes.arrow} className="popover-arrow"/>
                        <div className="popover-body">
                            {children}
                        </div>
                    </div>,
                document.querySelector("#modal-root")!
            )}
        </PopoverContext.Provider>
    );
}
