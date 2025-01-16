import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Node, Path, Range } from 'slate';
import { Editable, ReactEditor, useSlateStatic } from 'slate-react';
import isHotkey from 'is-hotkey';

import { NodeName } from "api";
import { UI_EVENT_COMMENT_QUOTE, UiEventCommentQuote } from "state/detailedposting/events";
import * as Browser from "ui/browser";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { safeImportScripture } from "ui/control/richtexteditor/visual/scripture-html";
import VisualRenderElement from "ui/control/richtexteditor/visual/VisualRenderElement";
import VisualRenderLeaf from "ui/control/richtexteditor/visual/VisualRenderLeaf";
import {
    createListItemElement,
    createParagraphElement,
    createScriptureText,
    isScriptureText,
    ListItemElement
} from "ui/control/richtexteditor/visual/scripture";
import {
    findWrappingElement,
    scriptureReplaceSmileys,
    scriptureReplaceUrl
} from "ui/control/richtexteditor/visual/scripture-editor";
import "./VisualTextArea.css";
import { htmlEntities } from "util/html";

export interface VisualTextAreaProps {
    name: string;
    rows?: number;
    minHeight?: string | null;
    maxHeight?: string | null;
    placeholder?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    smileysEnabled?: boolean;
    commentQuote?: boolean;
    submitKey?: string;
    onSubmit?: () => void;
    onBlur?: (event: React.FocusEvent) => void;
}

const isBackspace = isHotkey("Backspace");

export default function VisualTextArea({
    name, rows, minHeight, maxHeight, placeholder, autoFocus, disabled, smileysEnabled, commentQuote, submitKey,
    onSubmit, onBlur
}: VisualTextAreaProps) {
    const editor = useSlateStatic() as ReactEditor;
    const textArea = useRef<HTMLDivElement>(null);
    const {
        inBlockquote, inList, headingLevel, inVoid, inCodeBlock, inFormula, inImageEmbedded, inImageAttached,
        formatMention, formatFormula, formatImage, handleHotKeys,
    } = useRichTextEditorCommands();

    const [isSubmitKey, isHardEnter, isSoftEnter] = useMemo(() => {
        const submitHotkey = !Browser.isTouchScreen()
            ? submitKey?.toLowerCase().replace("ctrl-", "mod-").replaceAll("-", "+")
            : undefined;
        return [
            submitHotkey ? isHotkey(submitHotkey) : () => false,
            submitHotkey === "enter" ? isHotkey("Mod+Enter") : isHotkey("Enter"),
            submitHotkey != null ? isHotkey("Shift+Enter") : isHotkey(["Mod+Enter", "Shift+Enter"])
        ];
    }, [submitKey]);

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (onSubmit != null && isSubmitKey(event)) {
            onSubmit();
            event.preventDefault();
            return;
        }

        if (event.key === "Enter" || event.key === " ") {
            if (smileysEnabled) {
                setTimeout(() => scriptureReplaceSmileys(editor));
            }
            if (editor.selection != null && Range.isCollapsed(editor.selection)) {
                const point = editor.selection.anchor;
                setTimeout(() => scriptureReplaceUrl(editor, point));
            }
        }
        if (isHardEnter(event) && editor.selection != null && Range.isCollapsed(editor.selection)) {
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
            if (headingLevel > 0 || inCodeBlock) {
                const [, path] = findWrappingElement(editor, ["heading", "code-block"]) ?? [null, null];
                if (path != null && editor.isEdge(editor.selection.anchor, path)) {
                    editor.insertNode(createParagraphElement([createScriptureText("")]));
                    event.preventDefault();
                }
            }
            if (inVoid) {
                editor.insertNode(createParagraphElement([createScriptureText("")]));
                event.preventDefault();
            }

            if (!event.defaultPrevented) {
                const [node] = editor.node(editor.selection.anchor);
                if (isScriptureText(node)) {
                    const {offset} = editor.selection.anchor;
                    let m = node.text.substring(0, offset).match(/\s*$/);
                    if (m) {
                        for (let i = 0; i < m[0].length; i++) {
                            editor.deleteBackward("character");
                        }
                    }
                    m = node.text.substring(offset).match(/^\s*/);
                    if (m) {
                        for (let i = 0; i < m[0].length; i++) {
                            editor.deleteForward("character");
                        }
                    }
                }
            }
            editor.insertBreak();
            event.preventDefault();
        }
        if (isSoftEnter(event)) {
            if (inVoid && editor.selection != null && Range.isCollapsed(editor.selection)) {
                const parent = Path.parent(editor.selection.anchor.path);
                editor.insertNode(createParagraphElement([createScriptureText("")]), {at: parent});
                event.preventDefault();
            } else {
                editor.insertText("\n");
                event.preventDefault();
            }
        }

        if (isBackspace(event) && editor.selection != null && Range.isCollapsed(editor.selection)) {
            const [, blockPath] = findWrappingElement(editor, [
                "blockquote", "spoiler-block", "details"
            ]) ?? [null, null];
            if (blockPath != null) {
                const [, path] = findWrappingElement(editor, ["paragraph", "heading"]) ?? [null, null];
                if (path != null && path.length > blockPath.length && editor.isStart(editor.selection.anchor, path)) {
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

            if (inCodeBlock) {
                const [, path] = findWrappingElement(editor, "code-block") ?? [null, null];
                if (path != null && editor.isStart(editor.selection.anchor, path)) {
                    editor.setNodes(createParagraphElement([]));
                    event.preventDefault();
                }
            }
        }

        if (event.code === "Space") {
            if (inFormula) {
                formatFormula();
                event.preventDefault();
            }
            if (inImageEmbedded || inImageAttached) {
                formatImage();
                event.preventDefault();
            }
        }

        if (event.key === "@") {
            if (editor.selection != null) {
                const node = Node.get(editor, editor.selection.anchor.path);
                if (isScriptureText(node)) {
                    const offset = editor.selection.anchor.offset;
                    if (offset === 0 || /[\s(]/.test(node.text.charAt(offset - 1))) {
                        formatMention(true);
                        event.preventDefault();
                    }
                }
            }
        }

        if (handleHotKeys(event)) {
            event.preventDefault();
        }

        if (textArea.current != null) {
            const selection = window.getSelection();
            if (selection?.rangeCount) {
                const range = selection.getRangeAt(0).cloneRange();
                range.collapse(true);
                const bottom = range.getBoundingClientRect().bottom - textArea.current.getBoundingClientRect().top;
                if (bottom > textArea.current.clientHeight) {
                    textArea.current.scrollTop += bottom - textArea.current.clientHeight;
                }
            }
        }
    };

    const onCommentQuote = useCallback((event: UiEventCommentQuote) => {
        const {html, ownerName, ownerFullName} = event.detail;

        let insertHtml = "";
        if (ownerName) {
            const name = ownerFullName || NodeName.shorten(ownerName);
            const mention = `<a data-nodename="${htmlEntities(ownerName)}">${htmlEntities(name)}</a>`;
            if (html) {
                insertHtml = `<p>${mention}:</p><blockquote>${html}</blockquote>`;
            } else {
                insertHtml = mention;
            }
        } else {
            if (html) {
                insertHtml = `<blockquote>${html}</blockquote>`;
            }
        }
        editor.insertFragment(safeImportScripture(insertHtml));
    }, [editor]);

    useEffect(() => {
        if (commentQuote) {
            // @ts-ignore
            document.addEventListener(UI_EVENT_COMMENT_QUOTE, onCommentQuote);
            return () => {
                // @ts-ignore
                document.removeEventListener(UI_EVENT_COMMENT_QUOTE, onCommentQuote);
            }
        }
    }, [commentQuote, onCommentQuote]);

    return (
        <Editable
            id={name}
            className="visual-text-area"
            ref={textArea}
            style={{
                minHeight: minHeight ?? (rows != null ? `${Math.ceil(rows * 18) / 10}em` : undefined),
                maxHeight: maxHeight ?? "calc(100vh - 26rem)"
            }}
            placeholder={placeholder}
            readOnly={disabled}
            autoFocus={autoFocus}
            renderElement={VisualRenderElement}
            renderLeaf={VisualRenderLeaf}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            scrollSelectionIntoView={() => {}}
        />
    );
}
