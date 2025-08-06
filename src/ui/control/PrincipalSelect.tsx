import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { FriendGroupInfo, PrincipalFlag, PrincipalValue } from "api";
import { ClientState } from "state/state";
import { getNodeFriendGroups } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { Button, Principal, useModalDialog } from "ui/control";
import { getPrincipalDisplay, PrincipalDisplay } from "ui/control/principal-display";
import { Icon, MaterialSymbol } from "ui/material-symbols";
import { useButtonPopper } from "ui/hook";
import "./PrincipalSelect.css";

interface Props {
    value: PrincipalValue | null | undefined;
    values? : PrincipalFlag[] | null;
    icons?: Partial<Record<PrincipalValue, MaterialSymbol>> | null;
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

    const {overlayId: parentOverlayId} = useModalDialog();
    const {
        visible, onToggle, setButtonRef, setPopperRef, popperStyles, popperAttributes, zIndex
    } = useButtonPopper("bottom-start", {parentOverlayId});

    const {t} = useTranslation();

    const onClick = (value: PrincipalValue) => onChange ? () => onChange(value) : undefined;

    const principalValues = getValues(values, friendGroups, publicDisabled && value !== "public", t);
    return (
        <div ref={setButtonRef} className={cx("principal-select", className, {long, "dropup": visible})}
             aria-label={t("select")}>
            <Button variant="tool" className="dropdown-toggle" active={visible} disabled={disabled ?? undefined}
                    onClick={onToggle}>
                <Principal value={value} long={long} icons={icons} titles={titles}/>
            </Button>
            {visible &&
                <div
                    ref={setPopperRef}
                    style={{...popperStyles, zIndex: zIndex?.widget}}
                    {...popperAttributes}
                    className="fade dropdown-menu border-primary-600 shadow-sm show"
                >
                    {caption && <div className="caption">{caption}</div>}
                    {principalValues.map(({value: v, icon, title}) =>
                        <div key={v} className={cx("dropdown-item", {"active": v === value})} onClick={onClick(v)}>
                            <Icon icon={icons?.[v] ?? icon} size="1em"/>&nbsp;&nbsp;{titles?.[v] ?? title}
                        </div>
                    )}
                </div>
            }
        </div>
    );
}

type ItemValue = {value: PrincipalValue} & PrincipalDisplay;

function getValues(
    flags: PrincipalFlag[] | null | undefined,
    friendGroups: FriendGroupInfo[],
    publicDisabled: boolean,
    t: TFunction
): ItemValue[] {
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
