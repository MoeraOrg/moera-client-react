import React from 'react';
import cx from 'classnames';

import { Icon, MaterialSymbol } from "ui/material-symbols";
import "./LabelButton.css";

interface Props {
    icon: MaterialSymbol;
    className?: string;
    title: string;
    onClick?: () => void;
}

export const LabelButton = ({icon, className, title, onClick}: Props) => (
    <button className={cx("form-label-button", className)} title={title} onClick={onClick}>
        <Icon icon={icon} size="16"/>
    </button>
);
