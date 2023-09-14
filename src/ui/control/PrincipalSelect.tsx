import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

type Props = {
    value: PrincipalValue | null | undefined;
    values? : PrincipalFlag[] | null;
    icons?: Partial<Record<PrincipalValue, IconProp>> | null;
    titles?: Partial<Record<PrincipalValue, string>> | null;
    caption?: string | null;
    long?: boolean | null;
    className?: string;
    disabled?: boolean | null;
    onChange?: (value: PrincipalValue) => void;
} & ConnectedProps<typeof connector>;

function PrincipalSelectImpl({
    value, values, icons, titles, caption, long, className, disabled, onChange, friendGroups, publicDisabled
}: Props) {
    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes
    } = useButtonPopper("bottom-end");

    const {t} = useTranslation();

    const onClick = (value: PrincipalValue) => onChange ? () => onChange(value) : undefined;

    return (
        <>
            <button className={cx("principal-select", className, {long})} ref={setButtonRef} onClick={onToggle}
                    disabled={disabled ?? undefined}>
                <Principal value={value} long={long} icons={icons} titles={titles}/>
                <FontAwesomeIcon icon="chevron-down" className="chevron"/>
            </button>
            {visible &&
                <div ref={setPopperRef} style={popperStyles} {...popperAttributes}
                     className="fade dropdown-menu shadow-sm show">
                    {caption && <div className="caption">{caption}</div>}
                    {getValues(values, friendGroups, publicDisabled && value !== "public", t)
                        .map(({value: v, icon, title}) =>
                            <div key={v} className="dropdown-item" onClick={onClick(v)}>
                                <FontAwesomeIcon icon="check" className={cx({"invisible": v !== value})}/>{" "}
                                <FontAwesomeIcon icon={icons?.[v] ?? icon} fixedWidth/>&nbsp;&nbsp;{titles?.[v] ?? title}
                            </div>
                        )
                    }
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

const connector = connect(
    (state: ClientState) => ({
        friendGroups: getNodeFriendGroups(state),
        publicDisabled: getSetting(state, "principal.public.disabled") as boolean
    })
);

export const PrincipalSelect = connector(PrincipalSelectImpl);
