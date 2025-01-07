import React, { ForwardedRef, forwardRef } from 'react';
import cx from 'classnames';

import { Icon, MaterialSymbol } from "ui/material-symbols";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import "./RichTextEditorButton.css";

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

export function RichTextEditorButtonImpl(
    {icon, iconSize = 24, title, hotkey, className, active, disabled, onClick, command}: Props,
    ref: ForwardedRef<HTMLButtonElement>
) {
    const {focus} = useRichTextEditorCommands();

    const onCommandClick = (event: React.MouseEvent) => {
        command && command();
        focus();
        event.preventDefault();
    }

    return (
        <button className={cx("rich-text-editor-button", className, {active})} disabled={disabled}
                title={hotkey ? `${title} (${hotkey})` : title} data-hotkey={hotkey} onClick={onClick ?? onCommandClick}
                ref={ref}>
            {icon && <Icon icon={icon} width={iconSize} height={iconSize}/>}
        </button>
    );
}

export const RichTextEditorButton = forwardRef(RichTextEditorButtonImpl);
