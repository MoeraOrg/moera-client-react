import React, { ForwardedRef, forwardRef } from 'react';
import cx from 'classnames';

import { Icon, MaterialSymbol } from "ui/material-symbols";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import "./RichTextEditorButton.css";

interface Props {
    icon: MaterialSymbol;
    title: string;
    hotkey?: string;
    className?: string;
    active?: boolean;
    onClick?: (event: React.MouseEvent) => void;
    command?: () => void;
}

export function RichTextEditorButtonImpl(
    {icon, title, hotkey, className, active, onClick, command}: Props,
    ref: ForwardedRef<HTMLButtonElement>
) {
    const {focus} = useRichTextEditorCommands();

    const onCommandClick = (event: React.MouseEvent) => {
        command && command();
        focus();
        event.preventDefault();
    }

    return (
        <button className={cx("rich-text-editor-button", className, {active})}
                title={hotkey ? `${title} (${hotkey})` : title} data-hotkey={hotkey} onClick={onClick ?? onCommandClick}
                ref={ref}>
            {icon && <Icon icon={icon}/>}
        </button>
    );
}

export const RichTextEditorButton = forwardRef(RichTextEditorButtonImpl);
