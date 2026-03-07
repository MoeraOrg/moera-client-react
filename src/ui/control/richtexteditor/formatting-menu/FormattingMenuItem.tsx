import React from 'react';
import cx from 'classnames';

import { Icon, MaterialSymbol } from "ui/material-symbols";
import { useIsTinyScreen, useParent } from "ui/hook";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import "./FormattingMenuItem.css";

interface Props {
    icon: MaterialSymbol;
    iconSize?: number;
    title: string;
    hotkey?: string;
    className?: string;
    active?: boolean;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent) => void;
    command?: () => void;
    ref?: React.Ref<HTMLButtonElement>;
}

export function FormattingMenuItem(
    {icon, iconSize = 20, title, hotkey, className, active, disabled, onClick, command, ref}: Props
) {
    const {focus} = useRichTextEditorCommands();
    const {hide} = useParent();

    const onCommandClick = (event: React.MouseEvent) => {
        command && command();
        focus();
        hide();
        event.preventDefault();
    }

    const tinyScreen = useIsTinyScreen();

    return (
        <button className={cx("formatting-menu-item dropdown-item", className, {"engaged": active})} disabled={disabled}
                onClick={onClick ?? onCommandClick} ref={ref}>
            <div className="icon">{icon && <Icon icon={icon} size={iconSize}/>}</div>
            <div className="title">{title}</div>
            <div className="hotkey">{hotkey && !tinyScreen ? hotkey : ""}</div>
        </button>
    );
}
