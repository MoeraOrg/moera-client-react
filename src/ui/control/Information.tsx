import React from 'react';
import cx from 'classnames';

import { Icon, msInfo } from "ui/material-symbols";
import { Tooltip } from "ui/control/Tooltip";
import "./Information.css";

interface Props {
    text: string;
    className?: string;
}

export const Information = ({text, className}: Props) => (
    <Tooltip className={cx("information", className)} text={text}>
        <Icon icon={msInfo} size="1.2em"/>
    </Tooltip>
);
