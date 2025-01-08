import React from 'react';

import { Icon, MaterialSymbol, msChevronRight, msKeyboardArrowDown } from "ui/material-symbols";

type Props = {
    icon: MaterialSymbol;
    title: string;
    expanded?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const FormattingSubmenuButton = ({icon, title, disabled, expanded, ...props}: Props) => (
    <button className="formatting-menu-item dropdown-item" {...props}>
        <div className="icon"><Icon icon={icon} width={20} height={20}/></div>
        <div className="title">{title}</div>
        <div className="hotkey">
            <Icon icon={expanded ? msKeyboardArrowDown : msChevronRight} width={20} height={20}/>
        </div>
    </button>
);

export default FormattingSubmenuButton;
