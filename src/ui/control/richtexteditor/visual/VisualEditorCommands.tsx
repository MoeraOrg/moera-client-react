import React, { ReactNode } from 'react';
import { Editor, Range } from 'slate';
import { ReactEditor, useSlateSelector, useSlateStatic } from 'slate-react';

import {
    createLinkElement,
    createScriptureText,
    equalScriptureMarks,
    ScriptureMarks
} from "ui/control/richtexteditor/visual/scripture";
import { VisualEditorCommandsContext } from "ui/control/richtexteditor/visual/visual-editor-commands-context";
import { useRichTextEditorDialogs } from "ui/control/richtexteditor/rich-text-editor-dialogs-context";
import { RichTextLinkValues } from "ui/control/richtexteditor/RichTextLinkDialog";

interface Props {
    children: ReactNode;
}

export default function VisualEditorCommands({children}: Props) {
    const editor = useSlateStatic() as ReactEditor;
    const marks = useSlateSelector(editor => Editor.marks(editor) as ScriptureMarks, equalScriptureMarks);
    const {showLinkDialog} = useRichTextEditorDialogs();

    const formatBold = () => {
        editor.addMark("bold", !marks?.bold);
    }

    const formatItalic = () => {
        editor.addMark("italic", !marks?.italic);
    }

    const formatStrikeout = () => {
        editor.addMark("strikeout", !marks?.strikeout);
    }

    const formatLink = () => {
        showLinkDialog(true, (ok: boolean, {href = ""}: Partial<RichTextLinkValues>) => {
            showLinkDialog(false);

            if (ok) {
                if (editor.selection == null || Range.isCollapsed(editor.selection)) {
                    editor.insertNode(createLinkElement(href, [createScriptureText(href)]));
                } else {
                    editor.wrapNodes(createLinkElement(href, []), {split: true});
                }
            }
            ReactEditor.focus(editor);
        });
    }

    return (
        <VisualEditorCommandsContext.Provider value={{formatBold, formatItalic, formatStrikeout, formatLink}}>
            {children}
        </VisualEditorCommandsContext.Provider>
    );
}
