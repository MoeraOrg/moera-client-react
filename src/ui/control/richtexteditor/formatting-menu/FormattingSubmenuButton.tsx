import React, { useEffect } from 'react';

import { Icon, MaterialSymbol, msChevronRight, msKeyboardArrowDown } from "ui/material-symbols";
import { usePopover } from "ui/control/popover-context";

type Props = {
    icon: MaterialSymbol;
    title: string;
    expanded?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function FormattingSubmenuButton(
    {icon, title, disabled, expanded, ref, ...props}: Props
) {
    const {update: updatePopover} = usePopover();

    useEffect(() => {
        updatePopover();
    }, [expanded, updatePopover]);

    return (
        <button className="formatting-menu-item dropdown-item" ref={ref} {...props}>
            <div className="icon"><Icon icon={icon} size={20}/></div>
            <div className="title">{title}</div>
            <div className="hotkey">
                <Icon icon={expanded ? msKeyboardArrowDown : msChevronRight} size={20}/>
            </div>
        </button>
    );
}
