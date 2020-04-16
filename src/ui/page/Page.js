import React from 'react';
import cx from 'classnames';

export const Page = ({className, children}) => (
    <div className={cx("container", className)}>{children}</div>
);
