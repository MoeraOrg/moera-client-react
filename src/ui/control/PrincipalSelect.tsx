import React from 'react';
import { useSelector } from 'react-redux';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { FriendGroupInfo, PrincipalFlag, PrincipalValue } from "api";
import { ClientState } from "state/state";
import { getNodeFriendGroups } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { Principal } from "ui/control/Principal";
import { useButtonPopper } from "ui/hook";
import { getPrincipalDisplay, PrincipalDisplay } from "ui/control/principal-display";
import "./PrincipalSelect.css";

interface Props {
    value: PrincipalValue | null | undefined;
    values? : PrincipalFlag[] | null;
    icons?: Partial<Record<PrincipalValue, IconProp>> | null;
    titles?: Partial<Record<PrincipalValue, string>> | null;
    caption?: string | null;
    long?: boolean | null;
    className?: string;
    disabled?: boolean | null;
    onChange?: (value: PrincipalValue) => void;
}

export function PrincipalSelect({value, values, icons, titles, caption, long, className, disabled, onChange}: Props) {
    const friendGroups = useSelector(getNodeFriendGroups);
    const publicDisabled = useSelector((state: ClientState) =>
        getSetting(state, "principal.public.disabled") as boolean);

    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes, zIndex
    } = useButtonPopper("bottom-end");

    const {t} = useTranslation();

    const onClick = (value: PrincipalValue) => onChange ? () => onChange(value) : undefined;

    const principalValues = getValues(values, friendGroups, publicDisabled && value !== "public", t);
    return (
        <>
            <button className={cx("principal-select", className, {long})} ref={setButtonRef} aria-label={t("select")}
                    onClick={onToggle} disabled={disabled ?? undefined}>
                <Principal value={value} long={long} icons={icons} titles={titles}/>
                <FontAwesomeIcon icon={faChevronDown} className="chevron"/>
            </button>
            {visible &&
                <div ref={setPopperRef} style={{...popperStyles, zIndex: zIndex?.widget}} {...popperAttributes}
                     className="fade dropdown-menu shadow-sm show">
                    {caption && <div className="caption">{caption}</div>}
                    {principalValues.map(({value: v, icon, title}) =>
                        <div key={v} className="dropdown-item" onClick={onClick(v)}>
                            <FontAwesomeIcon icon={faCheck} className={cx({"invisible": v !== value})}/>{" "}
                            <FontAwesomeIcon icon={icons?.[v] ?? icon} fixedWidth/>&nbsp;&nbsp;{titles?.[v] ?? title}
                        </div>
                    )}
                </div>
            }
        </>
    );
}

type ItemValue = {value: PrincipalValue} & PrincipalDisplay;

function getValues(flags: PrincipalFlag[] | null | undefined, friendGroups: FriendGroupInfo[], publicDisabled: boolean,
                   t: TFunction): ItemValue[] {
    if (flags == null) {
        return [];
    }

    const values = [];
    for (const flag of flags) {
        if (flag === "friends") {
            friendGroups
                .map(fg => ({value: `f:${fg.id}`, ...getPrincipalDisplay(`f:${fg.id}`, friendGroups, t)}))
                .forEach(v => values.push(v));
        } else if (flag !== "public" || !publicDisabled) {
            values.push({value: flag, ...getPrincipalDisplay(flag, friendGroups, t)});
        }
    }
    return values;
}
