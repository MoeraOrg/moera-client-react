import React from 'react';
import { Trans } from 'react-i18next';
import cx from 'classnames';

import { Icon, msInfo } from "ui/material-symbols";
import { ParentContext, useButtonPopper, useIsTinyScreen } from "ui/hook";
import "./Information.css";

interface Props {
    text: string;
    className?: string;
}

export function Information({text, className}: Props) {
    const {
        visible, setVisible, hide, onToggle, setButtonRef, setArrowRef, setPopperRef, arrowStyles, popperStyles,
        popperAttributes, zIndex, overlayId
    } = useButtonPopper("auto");
    const tinyScreen = useIsTinyScreen();

    return (
        <ParentContext.Provider value={{hide, overlayId}}>
            <button
                type="button"
                className={cx("information", className)}
                ref={setButtonRef}
                onClick={tinyScreen ? onToggle : undefined}
                onMouseEnter={!tinyScreen ? () => setVisible(true) : undefined}
                onMouseLeave={!tinyScreen ? () => setVisible(false) : undefined}
            >
                <Icon icon={msInfo} size="1.2em"/>
            </button>
            <div
                className={cx("tooltip", "bs-tooltip-auto", "fade", {"show": visible})}
                role="tooltip"
                ref={setPopperRef}
                style={{...popperStyles, zIndex: zIndex?.widget}}
                {...popperAttributes}
            >
                <div className="tooltip-arrow" ref={setArrowRef} style={arrowStyles}/>
                <div className="tooltip-inner">
                    <Trans i18nKey={text}><b/></Trans>
                </div>
            </div>
        </ParentContext.Provider>
    );
}
