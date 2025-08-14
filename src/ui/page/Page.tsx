import React from 'react';
import cx from 'classnames';

import "./Page.css";

interface Props {
    className?: string | null;
    children?: any;
}

export const Page = ({className, children}: Props) => (
    <div className={cx("page", className)}>{children}</div>
);
