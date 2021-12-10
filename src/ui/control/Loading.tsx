import React from 'react';
import ReactLoading from 'react-loading';
import cx from 'classnames';

import "./Loading.css";

interface Props {
    active?: boolean;
    className?: string | null;
}

export const Loading = ({active = true, className = null}: Props) => (
    active ?
        <ReactLoading className={cx("loading", className)} type="bubbles" color="black" width={32} height={32}/>
    :
        null
);
