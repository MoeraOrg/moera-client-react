import React from 'react';
import cx from 'classnames';
import { Trans } from 'react-i18next';
import type { Placement } from '@floating-ui/utils';

import { ParentContext, useButtonPopper, useIsTinyScreen } from "ui/hook";
import "./Tooltip.css";

export interface TooltipProps {
    text: string;
    className?: string;
    placement?: Placement;
    children?: React.ReactNode;
}

export function Tooltip({text, className, placement, children}: TooltipProps) {
    const {
        visible, setVisible, hide, onToggle, setButtonRef, setArrowRef, setPopperRef, arrowStyles, popperStyles,
        placement: finalPlacement, zIndex, overlayId
    } = useButtonPopper(placement);
    const tinyScreen = useIsTinyScreen();

    return (
        <ParentContext.Provider value={{hide, overlayId}}>
            <button
                type="button"
                className={className}
                ref={setButtonRef}
                onClick={tinyScreen ? onToggle : undefined}
                onMouseEnter={!tinyScreen ? () => setVisible(true) : undefined}
                onMouseLeave={!tinyScreen ? () => setVisible(false) : undefined}
            >
                {children}
            </button>
            <div
                className={cx("tooltip", "tooltip-popup", "bs-tooltip-auto", "fade", {"show": visible})}
                role="tooltip"
                ref={setPopperRef}
                style={{...popperStyles, zIndex: zIndex?.widget}}
                data-popper-placement={finalPlacement}
            >
                <div className="tooltip-arrow" ref={setArrowRef} style={arrowStyles}/>
                <div className="tooltip-inner">
                    <Trans i18nKey={text} components={{b: <b/>}}/>
                </div>
            </div>
        </ParentContext.Provider>
    );
}
