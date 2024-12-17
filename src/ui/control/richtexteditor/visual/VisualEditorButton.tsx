import React from 'react';
import { ReactEditor, useSlateStatic } from 'slate-react';

import { MaterialSymbol } from "ui/material-symbols";
import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";

interface Props {
    icon: MaterialSymbol;
    title: string;
    hotkey?: string;
    className?: string;
    active?: boolean;
    command?: () => void;
}

export function VisualEditorButton({icon, title, hotkey, className, active, command}: Props) {
    const editor = useSlateStatic() as ReactEditor;

    const onClick = (event: React.MouseEvent) => {
        command && command();
        ReactEditor.focus(editor);
        event.preventDefault();
    }

    return <RichTextEditorButton icon={icon} title={title} hotkey={hotkey} className={className} active={active}
                                 onClick={onClick}/>;
}
