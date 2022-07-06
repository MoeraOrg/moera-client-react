import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { PrincipalValue } from "api/node/api-types";
import { Principal } from "ui/control/Principal";
import { useButtonPopper } from "ui/hook";
import "./PrincipalSelect.css";
import { getPrincipalDisplay } from "ui/control/principal-display";

interface Props {
    value: PrincipalValue | null | undefined;
    values? : PrincipalValue[] | null;
    long?: boolean | null;
    className?: string;
    disabled?: boolean | null;
    onChange?: (value: PrincipalValue) => void;
}

export function PrincipalSelect({value, values, long, className, disabled, onChange}: Props) {
    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes
    } = useButtonPopper("bottom-end");

    const onClick = (value: PrincipalValue) => onChange ? () => onChange(value) : undefined;

    return (
        <>
            <button className={cx("principal-select", className, {long})} ref={setButtonRef} onClick={onToggle}
                    disabled={disabled ?? undefined}>
                <Principal value={value} long={long}/>
                <FontAwesomeIcon icon="chevron-down" className="chevron"/>
            </button>
            {visible &&
                <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                     className="fade dropdown-menu shadow-sm show">
                    {(values ?? []).map(v =>
                        <div key={v} className="dropdown-item" onClick={onClick(v)}>
                            <PrincipalSelectItem value={v}/>
                        </div>
                    )}
                </div>
            }
        </>
    );
}

interface PrincipalSelectItemProps {
    value: PrincipalValue;
}

function PrincipalSelectItem({value}: PrincipalSelectItemProps) {
    const {icon, title} = getPrincipalDisplay(value);
    return <><FontAwesomeIcon icon={icon}/>&nbsp;&nbsp;{title}</>;
}