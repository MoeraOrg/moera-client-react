import React from 'react';
import cx from 'classnames';

import { Icon, msMoreVert } from "ui/material-symbols";
import "./MenuButton.css";

interface Props {
    active?: boolean;
}

const MenuButton = ({active}: Props) => (
    <div className={cx("menu-button", {active})}>
        <Icon icon={msMoreVert} size="1em"/>
    </div>
);

export default MenuButton;
