import React from 'react';
import cx from 'classnames';

interface Props {
    className?: string | null;
    children?: any;
}

export const Page = ({className, children}: Props) => (
    <div className={cx("container", className)}>{children}</div>
);
