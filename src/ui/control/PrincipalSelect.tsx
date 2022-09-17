import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { PrincipalValue } from "api/node/api-types";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { Principal } from "ui/control/Principal";
import { useButtonPopper } from "ui/hook";
import { getPrincipalDisplay } from "ui/control/principal-display";
import "./PrincipalSelect.css";

type Props = {
    value: PrincipalValue | null | undefined;
    values? : PrincipalValue[] | null;
    long?: boolean | null;
    className?: string;
    disabled?: boolean | null;
    onChange?: (value: PrincipalValue) => void;
} & ConnectedProps<typeof connector>;

function PrincipalSelectImpl({value, values, long, className, disabled, onChange, publicDisabled}: Props) {
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
                    {(values ?? [])
                        .filter(v => !publicDisabled || value === "public" || v !== "public")
                        .map(v =>
                            <div key={v} className="dropdown-item" onClick={onClick(v)}>
                                <PrincipalSelectItem value={v}/>
                            </div>
                        )
                    }
                </div>
            }
        </>
    );
}

interface PrincipalSelectItemProps {
    value: PrincipalValue;
}

function PrincipalSelectItem({value}: PrincipalSelectItemProps) {
    const {t} = useTranslation();

    const {icon, title} = getPrincipalDisplay(value);
    return <><FontAwesomeIcon icon={icon}/>&nbsp;&nbsp;{t(title)}</>;
}

const connector = connect(
    (state: ClientState) => ({
        publicDisabled: getSetting(state, "principal.public.disabled") as boolean
    })
);

export const PrincipalSelect = connector(PrincipalSelectImpl);
