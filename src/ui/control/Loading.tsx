import React from 'react';
import ReactLoading from 'react-loading';
import cx from 'classnames';

import "./Loading.css";

interface Props {
    active?: boolean;
    className?: string | null;
    large?: boolean;
}

export const Loading = ({active = true, className = null, large = false}: Props) => (
    active ?
        <ReactLoading className={cx("loading", className)} type="bubbles" color="black"
                      width={large ? 80 : 32} height={large ? 60 : 24}/>
    :
        null
);
