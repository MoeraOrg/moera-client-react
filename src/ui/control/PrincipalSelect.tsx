import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Principal } from "ui/control/Principal";
import { useButtonPopper } from "ui/hook";
import "./PrincipalSelect.css";

interface Props {
    value: string | null | undefined;
    onChange?: (value: string) => void;
}

export function PrincipalSelect({value, onChange}: Props) {
    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes
    } = useButtonPopper("bottom-end");

    const onClick = (value: string) => onChange ? () => onChange(value) : undefined;

    return (
        <>
            <button className="principal-select" ref={setButtonRef} onClick={onToggle}>
                <Principal value={value}/>
                <FontAwesomeIcon icon="chevron-down" className="chevron"/>
            </button>
            {visible &&
                <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                     className="fade dropdown-menu shadow-sm show">
                    <div className="dropdown-item" onClick={onClick("public")}>
                        <FontAwesomeIcon icon="globe"/>&nbsp;&nbsp;Public
                    </div>
                    <div className="dropdown-item" onClick={onClick("signed")}>
                        <FontAwesomeIcon icon="shield-halved"/>&nbsp;&nbsp;Signed
                    </div>
                    <div className="dropdown-item" onClick={onClick("private")}>
                        <FontAwesomeIcon icon="lock"/>&nbsp;&nbsp;Only me
                    </div>
                </div>
            }
        </>
    );
}
