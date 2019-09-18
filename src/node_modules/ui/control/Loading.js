import React from 'react';
import PropType from 'prop-types';
import ReactLoading from 'react-loading';
import cx from 'classnames';

import "./Loading.css";

export const Loading = ({active = true, className = null}) => (
    active && <ReactLoading className={cx("loading", className)} type="bubbles" color="black" width={32} height={32} />
);

Loading.propTypes = {
    active: PropType.bool,
    className: PropType.string
};
