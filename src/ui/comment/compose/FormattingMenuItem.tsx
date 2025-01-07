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

    title = hotkey && !tinyScreen ? `${title} (${hotkey})` : title;

    return (
        <button className={cx("formatting-menu-item dropdown-item", className, {active})} disabled={disabled}
                onClick={onClick ?? onCommandClick} ref={ref}>
            {icon && <Icon icon={icon} width={iconSize} height={iconSize}/>}
            <span className="title">{title}</span>
        </button>
    );
}

export const FormattingMenuItem = forwardRef(FormattingMenuItemImpl);
