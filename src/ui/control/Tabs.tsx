import React from 'react';
import cx from 'classnames';

import { PrincipalValue } from "api";
import { Icon, MaterialSymbol } from "ui/material-symbols";
import { Loading, Principal } from "ui/control";
import Jump from "ui/navigation/Jump";
import "./Tabs.css";

type TabStyle = "tabs" | "pills";

export interface TabDescription<V = any> {
    title: string;
    value?: V;
    href?: string;
    active?: boolean;
    visible?: boolean;
    count?: number | null;
    principal?: PrincipalValue | null;
    loading?: boolean;
    className?: string;
}

type ScrollStyle = "always" | "mobile" | "never";

interface Props<V> {
    className?: string;
    tabs: TabDescription<V>[];
    tabStyle?: TabStyle;
    arrow?: MaterialSymbol;
    scroll?: ScrollStyle;
    value: V;
    onChange?: (value: V) => void;
    principalIcons?: Partial<Record<PrincipalValue, MaterialSymbol>> | null;
    principalTitles?: Partial<Record<PrincipalValue, string>> | null;
    addIcon?: MaterialSymbol;
    addTitle?: string;
    onAdd?: () => void;
}

export function Tabs<V = any>({
    className, tabs, tabStyle = "tabs", arrow, scroll = "mobile", value: selected, onChange, principalIcons,
    principalTitles, addIcon, addTitle, onAdd
}: Props<V>) {
    return (
        <ul className={cx("nav", "nav-" + tabStyle, "scroll-" + scroll, className)}>
            {tabs
                .filter(({visible}) => visible !== false)
                .map(({title, value, href, active, count, principal, loading, className}, index) =>
                    <li key={index} className="nav-item">
                        <TabLink
                            active={active ?? value === selected}
                            href={href}
                            onClick={onChange && value != null ? () => onChange(value) : undefined}
                            className={className}
                        >
                            <TabArrowWrapper arrow={arrow}>
                                {title}
                                {principal &&
                                    <>{" "}<Principal value={principal} defaultValue="public" icons={principalIcons}
                                                      titles={principalTitles}/></>
                                }
                                {count != null && <span className="badge">{count}</span>}
                                {loading && <>{" "}<Loading/></>}
                            </TabArrowWrapper>
                        </TabLink>
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

interface TabLinkProps {
    active: boolean;
    href?: string;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

function TabLink({active, href, onClick, className, children}: TabLinkProps) {
    if (active) {
        return (
            <span className={cx("nav-link", "active", className)} aria-current="page" onClick={onClick}>
                {children}
            </span>
        );
    }
    if (href == null) {
        return (
            <span className={cx("nav-link", className)} aria-current="page" onClick={onClick}>
                {children}
            </span>
        );
    }
    return (
        <Jump className={cx("nav-link", className)} href={href} onNear={onClick} onFar={onClick}>
            {children}
        </Jump>
    );
}

interface TabArrowWrapperProps {
    arrow?: MaterialSymbol;
    children?: React.ReactNode;
}

function TabArrowWrapper({arrow, children}: TabArrowWrapperProps) {
    if (!arrow) {
        return children;
    }

    return (
        <div className="arrow-wrapper">
            <span>{children}</span>
            <span><Icon icon={arrow}/></span>
        </div>
    );
}
