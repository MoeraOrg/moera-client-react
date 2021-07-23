import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import cx from 'classnames';

import "./LabelButton.css";

interface Props {
    icon: IconProp;
    className?: string;
    title: string;
    onClick?: () => void;
}

export const LabelButton = ({icon, className, title, onClick}: Props) => (
    <span className={cx("form-label-button", className)} title={title} onClick={onClick}>
        <FontAwesomeIcon icon={icon} size="sm"/>
    </span>
);
