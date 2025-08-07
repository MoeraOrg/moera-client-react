import React from 'react';
import cx from 'classnames';

import { PrincipalValue } from "api";
import { Icon, MaterialSymbol } from "ui/material-symbols";
import { Principal } from "ui/control";
import "./Tabs.css";

type TabStyle = "tabs" | "pills";

export interface TabDescription<V = any> {
    title: string;
    value: V;
    active?: boolean;
    visible?: boolean;
    count?: number | null;
    principal?: PrincipalValue | null;
}

interface Props<V> {
    className?: string;
    tabs: TabDescription<V>[];
    style?: TabStyle;
    scroll?: boolean;
    value: V;
    onChange?: (value: V) => void;
    principalIcons?: Partial<Record<PrincipalValue, MaterialSymbol>> | null;
    principalTitles?: Partial<Record<PrincipalValue, string>> | null;
    addIcon?: MaterialSymbol;
    addTitle?: string;
    onAdd?: () => void;
}

export function Tabs<V = any>({
    className, tabs, style = "tabs", scroll, value: selected, onChange, principalIcons, principalTitles, addIcon,
    addTitle, onAdd
}: Props<V>) {
    return (
        <ul className={cx("nav", "nav-" + style, {scroll}, className)}>
            {tabs
                .filter(({visible}) => visible !== false)
                .map(({title, value, active, count, principal}, index) =>
                    <li key={index} className="nav-item" onClick={() => onChange && onChange(value)}>
                        <span className={cx("nav-link", {"active": active ?? value === selected})} aria-current="page">
                            {title}
                            {principal &&
                                <>{" "}<Principal value={principal} defaultValue="public" icons={principalIcons}
                                                  titles={principalTitles}/></>
                            }
                            {count != null && <span className="badge">{count}</span>}
                        </span>
                    </li>
                )
            }
            {(addIcon != null || addTitle != null) &&
                <li className="nav-item" onClick={() => onAdd && onAdd()}>
                    <span className="nav-link active add-tab">
                        {addIcon && <Icon icon={addIcon} size="1.4em"/>}
                        {addTitle}
                    </span>
                </li>
            }
        </ul>
    );
}
