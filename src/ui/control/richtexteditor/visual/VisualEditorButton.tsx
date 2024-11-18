import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ReactEditor, useSlateStatic } from 'slate-react';

import RichTextEditorButton from "ui/control/richtexteditor/RichTextEditorButton";

interface Props {
    icon: IconProp;
    title: string;
    letter?: string;
    className?: string;
    active?: boolean;
    command?: () => void;
}

export function VisualEditorButton({icon, title, letter, className, active, command}: Props) {
    const editor = useSlateStatic() as ReactEditor;

    const onClick = (event: React.MouseEvent) => {
        command && command();
        ReactEditor.focus(editor);
        event.preventDefault();
    }

    return <RichTextEditorButton icon={icon} title={title} letter={letter} className={className} active={active}
                                 onClick={onClick}/>;
}
