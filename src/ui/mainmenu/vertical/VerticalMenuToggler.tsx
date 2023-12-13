import React from 'react';
import * as ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

import { useButtonPopper } from "ui/hook";
import VerticalMenu from "ui/mainmenu/vertical/VerticalMenu";
import "./VerticalMenuToggler.css";

export default function VerticalMenuToggler() {
    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes
    } = useButtonPopper("bottom", {strategy: "fixed"});

    const {t} = useTranslation();

    return (
        <>
            <button ref={setButtonRef} className="navbar-toggler" type="button" aria-label={t("close")}
                    onClick={onToggle}>
                <span className="navbar-toggler-icon"/>
            </button>
            {visible &&
                ReactDOM.createPortal(
                    <div ref={setPopperRef} style={popperStyles} {...popperAttributes} className="vertical-menu-popper">
                        <VerticalMenu/>
                    </div>,
                    document.querySelector("#modal-root")!
                )
            }
        </>
    );
}
