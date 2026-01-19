import React, { useCallback, useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { Middleware } from '@floating-ui/dom';
import { arrow, flip, offset, shift, useFloating } from '@floating-ui/react';
import { Placement, Strategy } from '@floating-ui/utils';
import cx from 'classnames';

import { PopoverContext } from "ui/control";
import { useOverlay } from "ui/overlays/overlays";
import { ParentContext } from "ui/hook";
import "./Popover.css";

interface Props {
    className?: string;
    text?: string | React.ReactNode;
    textClassName?: string;
    title?: string;
    detached?: boolean;
    placement?: Placement;
    strategy?: Strategy;
    offset?: number;
    parentOverlayId?: string;
    onToggle?: (visible: boolean) => void;
    children: React.ReactNode;
}

export function Popover({
    className, text, textClassName, title, detached, placement = "bottom", strategy = "fixed", offset: placementOffset,
    parentOverlayId, onToggle, children
}: Props) {
    const [visible, setVisible] = useState<boolean>(false);

    // Such usage of useState() is counter-intuitive, but required by floating-ui
    const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);
    const middleware: Middleware[] = [flip(), shift(), arrow({element: arrowRef})];
    if (placementOffset != null) {
        middleware.unshift(offset(placementOffset));
    }
    const {
        refs, floatingStyles, placement: finalPlacement, update, middlewareData
    } = useFloating({placement, strategy, middleware});

    useEffect(() => {
        if (onToggle != null) {
            onToggle(visible);
        }
    }, [onToggle, visible]);

    useEffect(() => {
        if (visible) {
            // setTimeout() is needed here, because forceUpdate() uses flushSync() that should not be called from
            // lifecycle methods
            update && setTimeout(() => update());
        }
    }, [update, visible]);

    const toggle = () => setVisible(!visible);

    // setTimeout() is needed here to make hide(), invoked from overlay.onClosed, to be called after toggle(),
    // invoked from span.onClick
    const hide = useCallback(() => setTimeout(() => setVisible(false)), []);

    const [zIndex, overlayId]
        = useOverlay(refs.floating, {parentId: parentOverlayId, visible: !detached || visible, onClose: hide});

    return (
        <ParentContext.Provider value={{hide, overlayId}}>
            <PopoverContext.Provider value={{update}}>
                <span
                    ref={refs.setReference}
                    onClick={toggle}
                    title={title}
                    className={cx(textClassName, {"active": visible})}
                >
                    {text}
                </span>
                {ReactDOM.createPortal(
                    (!detached || visible) &&
                        <div
                            ref={refs.setFloating}
                            style={{...floatingStyles, zIndex: zIndex?.widget}}
                            data-popper-placement={finalPlacement}
                            className={cx(
                                "popover",
                                "fade",
                                `bs-popover-${finalPlacement}`, // activates Bootstrap style for .popover-arrow
                                {"show": visible},
                                className
                            )}
                        >
                            <div
                                ref={setArrowRef}
                                style={{
                                    position: "absolute",
                                    left: middlewareData.arrow?.x,
                                    top: middlewareData.arrow?.y
                                }}
                                className="popover-arrow"
                            />
                            <div className="popover-body">
                                {children}
                            </div>
                        </div>,
                    document.getElementById("modal-root")!
                )}
            </PopoverContext.Provider>
        </ParentContext.Provider>
    );
}
