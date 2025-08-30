import React, { useCallback, useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import cx from 'classnames';
import { Modifier, usePopper } from 'react-popper';
import { PositioningStrategy } from '@popperjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { PopoverContext } from "ui/control";
import { useOverlay } from "ui/overlays/overlays";
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
    parentOverlayId?: string;
    onToggle?: (visible: boolean) => void;
    children: React.ReactNode;
}

export function Popover({
    className, text, textClassName, icon, title, element, detached, strategy = "fixed", offset, parentOverlayId,
    onToggle, children
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

    useEffect(() => {
        if (onToggle != null) {
            onToggle(visible);
        }
    }, [onToggle, visible]);

    useEffect(() => {
        if (visible) {
            // setTimeout() is needed here, because forceUpdate() uses flushSync() that should not be called from
            // lifecycle methods
            forceUpdate && setTimeout(() => forceUpdate());
        }
    }, [forceUpdate, visible]);

    const toggle = () => setVisible(!visible);

    // setTimeout() is needed here to make hide(), invoked from overlay.onClosed, to be called after toggle(),
    // invoked from span.onClick
    const hide = useCallback(() => setTimeout(() => setVisible(false)), []);

    const [zIndex, overlayId]
        = useOverlay(popperRef, {parentId: parentOverlayId, visible: !detached || visible, onClose: hide});

    return (
        <PopoverContext.Provider value={{hide, update: forceUpdate ?? (() => {}), overlayId}}>
            <span ref={setButtonRef} onClick={toggle} title={title} className={cx(textClassName, {"active": visible})}>
                {element && React.createElement(element)}
                {icon && <FontAwesomeIcon icon={icon}/>}
                {text}
            </span>
            {ReactDOM.createPortal(
                (!detached || visible) &&
                    <div
                        ref={setPopperRef}
                        style={{...styles.popper, zIndex: zIndex?.widget}}
                        {...attributes.popper}
                        className={cx(
                            "popover",
                            "fade",
                            `bs-popover-${state?.placement}`, // activates Bootstrap style for .popover-arrow
                            {"show": visible},
                            className
                        )}
                    >
                        <div
                            ref={setArrowRef}
                            style={styles.arrow}
                            {...attributes.arrow}
                            className="popover-arrow"
                        />
                        <div className="popover-body">
                            {children}
                        </div>
                    </div>,
                document.getElementById("modal-root")!
            )}
        </PopoverContext.Provider>
    );
}
