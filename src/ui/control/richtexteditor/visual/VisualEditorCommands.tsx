import React, { ReactNode } from 'react';
import { Editor } from 'slate';
import { ReactEditor, useSlateSelector, useSlateStatic } from 'slate-react';

import { equalScriptureMarks, ScriptureMarks } from "ui/control/richtexteditor/visual/scripture";
import { VisualEditorCommandsContext } from "ui/control/richtexteditor/visual/visual-editor-commands-context";

interface Props {
    children: ReactNode;
}

export default function VisualEditorCommands({children}: Props) {
    const editor = useSlateStatic() as ReactEditor;
    const marks = useSlateSelector(editor => Editor.marks(editor) as ScriptureMarks, equalScriptureMarks);

    const formatBold = () => {
        editor.addMark("bold", !marks?.bold);
    }

    const formatItalic = () => {
        editor.addMark("italic", !marks?.italic);
    }

    const formatStrikeout = () => {
        editor.addMark("strikeout", !marks?.strikeout);
    }

    return (
        <VisualEditorCommandsContext.Provider value={{formatBold, formatItalic, formatStrikeout}}>
            {children}
        </VisualEditorCommandsContext.Provider>
    );
}
