import React, { ForwardedRef, forwardRef } from 'react';
import cx from 'classnames';

import { Icon, MaterialSymbol } from "ui/material-symbols";
import { useIsTinyScreen } from "ui/hook/media-query";
import { useDropdownMenu } from "ui/control";
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
}

export function FormattingMenuItemImpl(
    {icon, iconSize = 20, title, hotkey, className, active, disabled, onClick, command}: Props,
    ref: ForwardedRef<HTMLButtonElement>
) {
    const {focus} = useRichTextEditorCommands();
    const {hide} = useDropdownMenu();

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
            <div className="icon">{icon && <Icon icon={icon} width={iconSize} height={iconSize}/>}</div>
            <div className="title">{title}</div>
            <div className="hotkey">{hotkey && !tinyScreen ? hotkey : ""}</div>
        </button>
    );
}

export const FormattingMenuItem = forwardRef(FormattingMenuItemImpl);
