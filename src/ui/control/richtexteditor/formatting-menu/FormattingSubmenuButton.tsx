import React, { ForwardedRef, forwardRef } from 'react';

import { Icon, MaterialSymbol, msChevronRight, msKeyboardArrowDown } from "ui/material-symbols";

type Props = {
    icon: MaterialSymbol;
    title: string;
    expanded?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const FormattingSubmenuButton = (
    {icon, title, disabled, expanded, ...props}: Props,
    ref: ForwardedRef<HTMLButtonElement>
) => (
    <button className="formatting-menu-item dropdown-item" ref={ref} {...props}>
        <div className="icon"><Icon icon={icon} size={20}/></div>
        <div className="title">{title}</div>
        <div className="hotkey">
            <Icon icon={expanded ? msKeyboardArrowDown : msChevronRight} size={20}/>
        </div>
    </button>
);

export default forwardRef(FormattingSubmenuButton);
