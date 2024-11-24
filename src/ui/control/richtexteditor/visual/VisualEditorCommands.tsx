import React, { ReactNode } from 'react';
import { Editor, Path, Range, Transforms } from 'slate';
import { ReactEditor, useSlateSelector, useSlateStatic } from 'slate-react';

import { NodeName } from "api";
import {
    createHorizontalRuleElement,
    createLinkElement,
    createMentionElement,
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
import { NameListItem } from "util/names-list";
import { mentionName } from "util/names";

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
    const inMention = useSlateSelector(editor => isSelectionInElement(editor, "mention"));
    const {showLinkDialog, showSpoilerDialog, showMentionDialog} = useRichTextEditorDialogs();

    const formatBold = () =>
        editor.addMark("bold", !inBold);

    const formatItalic = () =>
        editor.addMark("italic", !inItalic);

    const formatStrikeout = () =>
        editor.addMark("strikeout", !inStrikeout);

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

    const formatMention = () => {
        if (inMention) {
            return;
        }
        showMentionDialog(true, (ok: boolean | null, {nodeName, fullName}: Partial<NameListItem>) => {
            showMentionDialog(false);

            if (ok && nodeName != null) {
                const text = (fullName || NodeName.shorten(nodeName)) ?? nodeName ?? "";
                editor.insertNode(createMentionElement(nodeName, [createScriptureText(text)]));
                const selection = editor.selection?.anchor.path;
                if (selection != null) {
                    Transforms.select(editor, {path: Path.next(Path.parent(selection)), offset: 0});
                }
                editor.insertText(" ");
            } else {
                editor.insertText(nodeName ? mentionName(nodeName) : "@");
            }
            ReactEditor.focus(editor);
        });
    }

    const formatHorizontalRule = () =>
        editor.insertNode(createHorizontalRuleElement());

    return (
        <VisualEditorCommandsContext.Provider value={{
            inBold, inItalic, inStrikeout, inLink, inSpoiler, inMention,
            formatBold, formatItalic, formatStrikeout, formatLink, formatSpoiler, formatMention, formatHorizontalRule
        }}>
            {children}
        </VisualEditorCommandsContext.Provider>
    );
}
