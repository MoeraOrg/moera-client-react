import React, { useState } from 'react';
import * as ReactDOM from 'react-dom';
import cx from 'classnames';
import { Modifier, usePopper } from 'react-popper';
import { PositioningStrategy } from '@popperjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { isFunction } from 'formik';

import "./Popover.css";

interface ChildrenProps {
    hide: () => void;
    update: () => void;
}

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
    children: ((props: ChildrenProps) => React.ReactNode) | React.ReactNode;
}

export function Popover({
    className, text, textClassName, icon, title, element, detached, strategy = "fixed", offset, onToggle, children
}: Props) {
    const [visible, setVisible] = useState<boolean>(false);

    const show = () => {
        if (visible) {
            return;
        }
        setVisible(true);
        document.getElementById("app-root")!.addEventListener("click", documentClick);
        if (onToggle != null) {
            onToggle(true);
        }
    };

    const hide = () => {
        if (!visible) {
            return;
        }
        setVisible(false);
        document.getElementById("app-root")!.removeEventListener("click", documentClick);
        if (onToggle != null) {
            onToggle(false);
        }
    };

    const documentClick = (event: MouseEvent) => {
        for (let element of document.querySelectorAll(".popover.show").values()) {
            const r = element.getBoundingClientRect();
            if (r.left <= event.clientX && r.right >= event.clientX
                && r.top <= event.clientY && r.bottom >= event.clientY) {
                return;
            }
        }
        hide();
    };

    const toggle = () => {
        if (!visible) {
            show();
        } else {
            hide();
        }
    };

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

    return (
        <>
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
                        <div className="popover-body">{
                            isFunction(children) ?
                                children({hide: hide, update: forceUpdate ?? (() => {})})
                            :
                                children
                        }</div>
                    </div>,
                document.querySelector("#modal-root")!
            )}
        </>
    );
}
