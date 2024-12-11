import React from 'react';
import cx from 'classnames';

import "./Tabs.css";

export interface TabDescription<V = any> {
    title: string;
    value: V;
    visible?: boolean;
}

interface Props<V> {
    className?: string;
    tabs: TabDescription<V>[];
    value: V;
    onChange?: (value: V) => void;
}

export function Tabs<V = any>({className, tabs, value: active, onChange}: Props<V>) {
    return (
        <ul className={cx("nav nav-tabs", className)}>
            {tabs
                .filter(({visible}) => visible !== false)
                .map(({title, value}, index) =>
                    <li key={index} className="nav-item" onClick={() => onChange && onChange(value)}>
                        <span className={cx("nav-link", {"active": value === active})} aria-current="page">
                            {title}
                        </span>
                    </li>
                )
            }
        </ul>
    );
}
