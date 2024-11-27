import React from 'react';
import { Node, Path, Range } from 'slate';
import { Editable, ReactEditor, useSlateStatic } from 'slate-react';

import VisualRenderElement from "ui/control/richtexteditor/visual/VisualRenderElement";
import VisualRenderLeaf from "ui/control/richtexteditor/visual/VisualRenderLeaf";
import { useVisualEditorCommands } from "ui/control/richtexteditor/visual/visual-editor-commands-context";
import { VISUAL_EDITOR_KEYS } from "ui/control/richtexteditor/visual/visual-editor-keys";
import {
    createParagraphElement,
    createScriptureText,
    isScriptureText
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
        inBlockquote, formatBold, formatItalic, formatStrikeout, formatLink, formatMention
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
                const [, path] = findWrappingElement(editor, "blockquote") ?? [null, null];
                if (path != null) {
                    if (editor.isStart(editor.selection.anchor, path) && !Path.hasPrevious(path)) {
                        editor.insertNode(createParagraphElement([createScriptureText("")]), {at: path});
                        event.preventDefault();
                    }
                    if (editor.isEnd(editor.selection.anchor, path) && !Node.has(editor, Path.next(path))) {
                        editor.insertNode(createParagraphElement([createScriptureText("")]), {at: Path.next(path)});
                        editor.move({distance: 1, unit: "line"});
                        event.preventDefault();
                    }
                }
            }
        }
        if (event.key === "Enter" && (event.shiftKey || event.ctrlKey)) {
            editor.insertText("\n");
            event.preventDefault();
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
            if (event.code === "Key" + VISUAL_EDITOR_KEYS.BOLD) {
                formatBold();
                event.preventDefault();
            } else if (event.code === "Key" + VISUAL_EDITOR_KEYS.ITALIC) {
                formatItalic();
                event.preventDefault();
            } else if (event.code === "Key" + VISUAL_EDITOR_KEYS.STRIKEOUT) {
                formatStrikeout();
                event.preventDefault();
            } else if (event.code === "Key" + VISUAL_EDITOR_KEYS.LINK) {
                formatLink();
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
