import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import scrollIntoView from 'scroll-into-view-if-needed';

import Twemoji from "ui/twemoji/Twemoji";
import Jump from "ui/navigation/Jump";
import "./UnderlinedTabs.css";

export interface UnderlinedTabDescription<V = any> {
    title: string;
    emoji?: number;
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
        <nav className={cx("underlined-tabs", className)}>
            <div className="tab-scroller">
                {tabs
                    .filter(({visible, value}) => visible !== false || value === selected)
                    .map(({title, emoji, value, href, active, className}, index) =>
                        <TabLink
                            key={index}
                            href={href}
                            active={active ?? value === selected}
                            onClick={onChange && value != null ? () => onChange(value) : undefined}
                            className={className}
                        >
                            {emoji && <Twemoji code={emoji}/>}{title}
                        </TabLink>
                    )
                }
            </div>
            {children}
        </nav>
    );
}

interface TabLinkProps {
    href?: string;
    active: boolean;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

function TabLink({href, active, onClick, className, children}: TabLinkProps) {
    const itemRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (active && itemRef.current != null) {
            scrollIntoView(itemRef.current, {inline: "nearest", scrollMode: "if-needed"});
        }
    });

    if (active) {
        return (
            <span className={cx("tab", "active", className)} onClick={onClick} ref={itemRef}>
                {children}
            </span>
        );
    }
    if (href == null) {
        return (
            <button className={cx("tab", className)} onClick={onClick}>
                {children}
            </button>
        );
    }
    return (
        <Jump className={cx("tab", className)} href={href} onNear={onClick} onFar={onClick}>
            {children}
        </Jump>
    );
}
