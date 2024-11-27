import React, { ReactNode } from 'react';
import { Editor, Element, Node, Path, Range, Transforms } from 'slate';
import { ReactEditor, useSlateSelector, useSlateStatic } from 'slate-react';

import { NodeName } from "api";
import {
    createBlockquoteElement,
    createHorizontalRuleElement,
    createLinkElement,
    createMentionElement,
    createScriptureText,
    createSpoilerBlockElement,
    createSpoilerElement,
    equalScriptureMarks,
    isLinkElement,
    isSpoilerBlockElement,
    isSpoilerElement,
    LinkElement,
    ScriptureMarks,
    SpoilerBlockElement,
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
    const inSpoiler = useSlateSelector(editor => isSelectionInElement(editor, ["spoiler", "spoiler-block"]));
    const inMention = useSlateSelector(editor => isSelectionInElement(editor, "mention"));
    const inBlockquote = useSlateSelector(editor => isSelectionInElement(editor, "blockquote"));
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
        const [element, path] = findWrappingElement(editor, ["spoiler", "spoiler-block"]) ?? [null, null];
        const prevValues = element != null && (isSpoilerElement(element) || isSpoilerBlockElement(element))
            ? {title: element.title}
            : null;

        showSpoilerDialog(true, prevValues, (ok: boolean | null, {title = ""}: Partial<RichTextSpoilerValues>) => {
            showSpoilerDialog(false);
            if (path != null) {
                if (ok) {
                    editor.setNodes<SpoilerElement | SpoilerBlockElement>({title}, {at: path});
                } else if (ok == null) {
                    editor.unwrapNodes({at: path});
                }
            } else {
                if (ok) {
                    if (editor.selection == null || Range.isCollapsed(editor.selection)) {
                        editor.insertNode(createSpoilerElement(title, [createScriptureText("")]));
                    } else {
                        const [parent] = Node.common(editor, editor.selection.anchor.path, editor.selection.focus.path);
                        if (
                            Editor.isEditor(parent)
                            || (Element.isElement(parent) && editor.isBlock(parent) && editor.hasBlocks(parent))
                        ) {
                            editor.wrapNodes(createSpoilerBlockElement(title, []), {split: true});
                        } else {
                            editor.wrapNodes(createSpoilerElement(title, []), {split: true});
                        }
                    }
                }
            }
            ReactEditor.focus(editor);
        });
    }

    const formatMention = (typeOnCancel: boolean) => {
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
            } else if (typeOnCancel) {
                editor.insertText(nodeName ? mentionName(nodeName) : "@");
            }
            ReactEditor.focus(editor);
        });
    }

    const formatHorizontalRule = () =>
        editor.insertNode(createHorizontalRuleElement());

    const formatEmoji = (emoji: string) => {
        editor.insertText(emoji);
        ReactEditor.focus(editor);
    }

    const formatBlockquote = () => {
        if (editor.selection == null || Range.isCollapsed(editor.selection)) {
            editor.wrapNodes(createBlockquoteElement([]));
        } else {
            editor.wrapNodes(createBlockquoteElement([]), {split: true});
        }
    }

    const formatBlockunquote = () => {
        const [, path] = findWrappingElement(editor, "blockquote") ?? [null, null];
        if (path != null) {
            editor.unwrapNodes({at: path});
        }
    }

    return (
        <VisualEditorCommandsContext.Provider value={{
            inBold, inItalic, inStrikeout, inLink, inSpoiler, inMention, inBlockquote,
            formatBold, formatItalic, formatStrikeout, formatLink, formatSpoiler, formatMention, formatHorizontalRule,
            formatEmoji, formatBlockquote, formatBlockunquote
        }}>
            {children}
        </VisualEditorCommandsContext.Provider>
    );
}
