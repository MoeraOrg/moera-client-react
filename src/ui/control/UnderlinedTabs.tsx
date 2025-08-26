import cx from 'classnames';

import "./UnderlinedTabs.css";
import React from "react";
import Jump from "ui/navigation/Jump";

export interface UnderlinedTabDescription<V = any> {
    title: string;
    value?: V;
    href?: string;
    active?: boolean;
    visible?: boolean;
    className?: string;
}

interface Props<V> {
    className?: string;
    tabs: UnderlinedTabDescription<V>[];
    value: V;
    onChange?: (value: V) => void;
    children?: React.ReactNode;

}

export function UnderlinedTabs<V = any>({className, tabs, value: selected, onChange, children}: Props<V>) {
    return (
        <div className={cx("underlined-tabs", className)}>
            <div className="tab-scroller">
                {tabs
                    .filter(({visible}) => visible !== false)
                    .map(({title, value, href, active, className}, index) =>
                        <TabLink
                            key={index}
                            href={href}
                            onClick={onChange && value != null ? () => onChange(value) : undefined}
                            className={cx("tab", {"active": active ?? value === selected}, className)}
                        >
                            {title}
                        </TabLink>
                    )
                }
            </div>
            {children}
        </div>
    );
}

interface TabLinkProps {
    href?: string;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

function TabLink({href, onClick, className, children}: TabLinkProps) {
    if (href == null) {
        return (
            <button className={className} onClick={onClick}>
                {children}
            </button>
        );
    } else {
        return (
            <Jump className={className} href={href} onNear={onClick} onFar={onClick}>
                {children}
            </Jump>
        );
    }
}
