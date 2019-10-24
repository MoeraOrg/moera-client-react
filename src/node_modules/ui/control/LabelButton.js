import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import "./LabelButton.css";

export const LabelButton = ({icon, className, title, onClick}) => (
    <span className={cx("form-label-button", className)} title={title} onClick={onClick}>
        <FontAwesomeIcon icon={icon} size="sm"/>
    </span>
);

LabelButton.propTypes = {
    icon: PropType.string,
    title: PropType.string,
    onClick: PropType.func
};
