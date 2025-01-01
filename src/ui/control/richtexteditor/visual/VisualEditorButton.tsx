import React from 'react';

import { MaterialSymbol } from "ui/material-symbols";
import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";

interface Props {
    icon: MaterialSymbol;
    title: string;
    hotkey?: string;
    className?: string;
    active?: boolean;
    command?: () => void;
}

export function VisualEditorButton({icon, title, hotkey, className, active, command}: Props) {
    const {focus} = useRichTextEditorCommands();

    const onClick = (event: React.MouseEvent) => {
        command && command();
        focus();
        event.preventDefault();
    }

    return <RichTextEditorButton icon={icon} title={title} hotkey={hotkey} className={className} active={active}
                                 onClick={onClick}/>;
}
