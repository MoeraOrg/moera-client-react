import React, { ReactNode } from 'react';
import { Editor, Range } from 'slate';
import { ReactEditor, useSlateSelector, useSlateStatic } from 'slate-react';

import {
    createLinkElement,
    createScriptureText,
    createSpoilerElement,
    equalScriptureMarks,
    isLinkElement,
    isSpoilerElement,
    LinkElement,
    ScriptureMarks,
    SpoilerElement
} from "ui/control/richtexteditor/visual/scripture";
import { VisualEditorCommandsContext } from "ui/control/richtexteditor/visual/visual-editor-commands-context";
import { useRichTextEditorDialogs } from "ui/control/richtexteditor/rich-text-editor-dialogs-context";
import { RichTextLinkValues } from "ui/control/richtexteditor/RichTextLinkDialog";
import { findWrappingElement, isSelectionInElement } from "ui/control/richtexteditor/visual/scripture-util";
import { RichTextSpoilerValues } from "ui/control/richtexteditor/RichTextSpoilerDialog";

interface Props {
    children: ReactNode;
}

export default function VisualEditorCommands({children}: Props) {
    const editor = useSlateStatic() as ReactEditor;
    const {
        bold: inBold = false, italic: inItalic = false, strikeout: inStrikeout = false
    } = useSlateSelector(
        editor => Editor.marks(editor) as ScriptureMarks ?? {bold: false, italic: false, strikeout: false},
        equalScriptureMarks
    );
    const inLink = useSlateSelector(editor => isSelectionInElement(editor, "link"));
    const inSpoiler = useSlateSelector(editor => isSelectionInElement(editor, "spoiler"));
    const {showLinkDialog, showSpoilerDialog} = useRichTextEditorDialogs();

    const formatBold = () => {
        editor.addMark("bold", !inBold);
    }

    const formatItalic = () => {
        editor.addMark("italic", !inItalic);
    }

    const formatStrikeout = () => {
        editor.addMark("strikeout", !inStrikeout);
    }

    const formatLink = () => {
        const [element, path] = findWrappingElement(editor, "link") ?? [null, null];
        const prevValues = element != null && isLinkElement(element) ? {href: element.href} : null;

        showLinkDialog(true, prevValues, (ok: boolean | null, {href = ""}: Partial<RichTextLinkValues>) => {
            showLinkDialog(false);
            if (path != null) {
                if (ok) {
                    editor.setNodes<LinkElement>({href}, {at: path});
                } else if (ok == null) {
                    editor.unwrapNodes({at: path});
                }
            } else {
                if (ok) {
                    if (editor.selection == null || Range.isCollapsed(editor.selection)) {
                        editor.insertNode(createLinkElement(href, [createScriptureText(href)]));
                    } else {
                        editor.wrapNodes(createLinkElement(href, []), {split: true});
                    }
                }
            }
            ReactEditor.focus(editor);
        });
    }

    const formatSpoiler = () => {
        const [element, path] = findWrappingElement(editor, "spoiler") ?? [null, null];
        const prevValues = element != null && isSpoilerElement(element) ? {title: element.title} : null;

        showSpoilerDialog(true, prevValues, (ok: boolean | null, {title = ""}: Partial<RichTextSpoilerValues>) => {
            showSpoilerDialog(false);
            if (path != null) {
                if (ok) {
                    editor.setNodes<SpoilerElement>({title}, {at: path});
                } else if (ok == null) {
                    editor.unwrapNodes({at: path});
                }
            } else {
                if (ok) {
                    if (editor.selection == null || Range.isCollapsed(editor.selection)) {
                        editor.insertNode(createSpoilerElement(title, [createScriptureText("")]));
                    } else {
                        editor.wrapNodes(createSpoilerElement(title, []), {split: true});
                    }
                }
            }
            ReactEditor.focus(editor);
        });
    }

    return (
        <VisualEditorCommandsContext.Provider value={{
            inBold, inItalic, inStrikeout, inLink, inSpoiler,
            formatBold, formatItalic, formatStrikeout, formatLink, formatSpoiler
        }}>
            {children}
        </VisualEditorCommandsContext.Provider>
    );
}
