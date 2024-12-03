import React from 'react';
import { Node, Range } from 'slate';
import { Editable, ReactEditor, useSlateStatic } from 'slate-react';

import VisualRenderElement from "ui/control/richtexteditor/visual/VisualRenderElement";
import VisualRenderLeaf from "ui/control/richtexteditor/visual/VisualRenderLeaf";
import { useVisualEditorCommands } from "ui/control/richtexteditor/visual/visual-editor-commands-context";
import { letterToKeyCode, VISUAL_EDITOR_KEYS } from "ui/control/richtexteditor/visual/visual-editor-keys";
import {
    createListItemElement,
    createParagraphElement,
    isScriptureText,
    ListItemElement
} from "ui/control/richtexteditor/visual/scripture";
import { findWrappingElement, scriptureReplaceSmileys } from "ui/control/richtexteditor/visual/scripture-util";
import "./VisualTextArea.css";

export interface VisualTextAreaProps {
    rows?: number;
    maxHeight?: string | null;
    placeholder?: string;
    autoFocus?: boolean;
    disabled?: boolean;
}

export default function VisualTextArea({rows, maxHeight, placeholder, autoFocus, disabled}: VisualTextAreaProps) {
    const editor = useSlateStatic() as ReactEditor;
    const {
        enableBlockquote,
        inBlockquote, inList,
        formatBold, formatItalic, formatStrikeout, formatLink, formatMention, formatBlockquote
    } = useVisualEditorCommands();

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
            setTimeout(() => scriptureReplaceSmileys(editor));
        }
        // TODO Ctrl-Enter in the case of comments
        if (
            event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey
            && editor.selection != null && Range.isCollapsed(editor.selection)
        ) {
            if (inBlockquote) {
                const [, path] = findWrappingElement(editor, "paragraph") ?? [null, null];
                if (path != null && editor.string(path) === "") {
                    editor.liftNodes();
                    event.preventDefault();
                }
            }
            if (inList) {
                const [listItem, path] = findWrappingElement<ListItemElement>(editor, "list-item") ?? [null, null];
                if (path != null && editor.string(path) === "") {
                    if (listItem.level > 1) {
                        editor.setNodes(createListItemElement(listItem.ordered, listItem.level - 1, []));
                    } else {
                        editor.setNodes(createParagraphElement([]));
                    }
                    event.preventDefault();
                }
            }
        }
        if (event.key === "Enter" && (event.shiftKey || event.ctrlKey)) {
            editor.insertText("\n");
            event.preventDefault();
        }

        if (
            event.key === "Backspace" && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey
            && editor.selection != null && Range.isCollapsed(editor.selection)
        ) {
            if (inBlockquote) {
                // TODO also 'header' and 'spoiler-block'
                const [, path] = findWrappingElement(editor, "paragraph") ?? [null, null];
                if (path != null && editor.isStart(editor.selection.anchor, path)) {
                    editor.liftNodes();
                    event.preventDefault();
                }
            }
            if (inList) {
                const [listItem, path] = findWrappingElement<ListItemElement>(editor, "list-item") ?? [null, null];
                if (path != null && editor.isStart(editor.selection.anchor, path)) {
                    if (listItem.level > 1) {
                        editor.setNodes(createListItemElement(listItem.ordered, listItem.level - 1, []));
                    } else {
                        editor.setNodes(createParagraphElement([]));
                    }
                    event.preventDefault();
                }
            }
        }

        if (event.key === "@") {
            if (editor.selection != null) {
                const node = Node.get(editor, editor.selection.anchor.path);
                if (isScriptureText(node)) {
                    const offset = editor.selection.anchor.offset;
                    if (offset === 0 || /\s/.test(node.text.charAt(offset - 1))) {
                        formatMention(true);
                        event.preventDefault();
                    }
                }
            }
        }

        if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
            if (event.code === letterToKeyCode(VISUAL_EDITOR_KEYS.BOLD)) {
                formatBold();
                event.preventDefault();
            } else if (event.code === letterToKeyCode(VISUAL_EDITOR_KEYS.ITALIC)) {
                formatItalic();
                event.preventDefault();
            } else if (event.code === letterToKeyCode(VISUAL_EDITOR_KEYS.STRIKEOUT)) {
                formatStrikeout();
                event.preventDefault();
            } else if (event.code === letterToKeyCode(VISUAL_EDITOR_KEYS.LINK)) {
                formatLink();
                event.preventDefault();
            } else if (enableBlockquote && event.code === letterToKeyCode(VISUAL_EDITOR_KEYS.BLOCKQUOTE)) {
                formatBlockquote();
                event.preventDefault();
            }
        }
    };

    return (
        <Editable
            className="visual-text-area"
            style={{
                minHeight: rows != null ? `${Math.ceil(rows * 1.5)}em` : undefined,
                maxHeight: maxHeight ?? "calc(100vh - 26rem)"
            }}
            placeholder={placeholder}
            readOnly={disabled}
            autoFocus={autoFocus}
            renderElement={VisualRenderElement}
            renderLeaf={VisualRenderLeaf}
            onKeyDown={onKeyDown}
        />
    );
}
