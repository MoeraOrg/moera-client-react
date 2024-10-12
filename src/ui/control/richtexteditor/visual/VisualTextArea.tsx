import React, { useCallback, useEffect, useRef, useState } from 'react';
import deepEqual from 'react-fast-compare';
import { Delta, Op } from 'quill/core';
import Toolbar from 'quill/modules/toolbar';

import * as Browser from "ui/browser";
import Quill, { QuillOptions, Range } from "ui/control/richtexteditor/visual/quill";
import AddReactionIcon from "ui/control/richtexteditor/visual/icons/add_reaction.isvg";
import RichTextMentionDialog from "ui/control/richtexteditor/RichTextMentionDialog";
import { NameListItem } from "util/names-list";
import { mentionName } from "util/names";
import "./VisualTextArea.css";

interface Props {
    value?: Delta;
    autoFocus?: boolean;
    disabled?: boolean;
    onChange?: (contents: Delta) => void;
}

export function VisualTextArea({value, autoFocus, disabled, onChange}: Props) {
    const [mentionDialog, setMentionDialog] = useState<boolean>(false);

    const onMention = useCallback(
        () => mentionDialog || setMentionDialog(true),
        [mentionDialog]
    );

    const quillOptions = useRef<QuillOptions>({
        modules: {
            toolbar: {
                container: [
                    [{"header": [false, 1, 2, 3, 4, 5]}],
                    ["bold", "italic", "strike"],
                    [{list: "ordered"}, {list: "bullet"}, {indent: "+1"}, {indent: "-1"}],
                    ["blockquote", "blockquote-off"],
                    ["emoji", "mention"],
                    ["image", "link"],
                    ["clean"],
                ],
                handlers: {
                    blockquote: function (this: Toolbar) {
                        const level = parseInt((this.quill.getFormat()?.["quote-level"] as string | undefined) ?? "0");
                        this.quill.format("blockquote", String(level + 1));
                    },

                    "blockquote-off": function (this: Toolbar) {
                        const level = parseInt((this.quill.getFormat()?.["quote-level"] as string | undefined) ?? "0");
                        if (level > 1) {
                            this.quill.format("blockquote", String(level - 1));
                        } else if (level === 1) {
                            this.quill.format("blockquote", false);
                        }
                    },

                    emoji: () => {},

                    mention: onMention,
                }
            },
            magicUrl: true,
            emoji: true,
        },
        readOnly: disabled,
        theme: "snow-extended",
    });

    const [quillElement, setQuillElement] = useState<HTMLDivElement | null>(null);

    const [quill, setQuill] = useState<Quill | null>(null);

    useEffect(() => {
        if (quillElement != null) {
            setQuill(new Quill(quillElement, quillOptions.current));
            quillElement.parentElement?.querySelectorAll(".ql-emoji").forEach(button => {
                if (Browser.isMobile()) {
                    button.classList.add("d-none");
                } else {
                    button.innerHTML = AddReactionIcon;
                }
            });
        }
    }, [quillElement]);

    useEffect(() => quill?.enable(disabled !== true), [disabled, quill]);

    useEffect(() => {
        if (!disabled && autoFocus && quill != null) {
            quill.focus();
        }
    }, [disabled, autoFocus, quill]);

    useEffect(() => {
        if (quill != null && value != null && !deepEqual(value, quill.getContents())) {
            const range = quill.getSelection(false);
            quill.setContents(value, "silent");
            quill.setSelection(range, "silent");
        }
    }, [quill, value]);

    useEffect(() => {
        if (quill != null && onChange != null) {
            const handler = () => onChange(quill.getContents());
            quill.on("text-change", handler);
            return () => {
                quill.off("text-change", handler);
            }
        }
    }, [onChange, quill]);

    useEffect(() => {
        if (quillElement != null) {
            showButtons(quillElement, ".ql-indent", false);
            showButtons(quillElement, ".ql-blockquote-off", false);
        }
    }, [quillElement]);

    const onEditorChange = useCallback((...args: any[]) => {
        if (quill != null && quillElement != null) {
            const range: Range = args[0] === "selection-change" ? args[1] : quill.getSelection();
            const formats: Record<string, any> = range?.index != null ? quill.getFormat(range) : [];

            showButtons(quillElement, ".ql-indent", !!formats["list"]);
            showButtons(quillElement, ".ql-blockquote-off", !!formats["blockquote"] || !!formats["quote-level"]);
        }
    }, [quill, quillElement]);

    useEffect(() => {
        if (quill != null) {
            quill.on("editor-change", onEditorChange);
            return () => {
                quill.off("editor-change", onEditorChange)
            }
        }
    }, [onEditorChange, quill]);

    const onMentionSubmit = (ok: boolean, {nodeName, fullName}: NameListItem) => {
        setMentionDialog(false);

        if (quill == null) {
            return;
        }

        if (!ok) {
            quill.focus();
            return;
        }

        let {index, length} = quill.getSelection(true) ?? {index: 0, length: 0};
        let delta = new Delta();
        if (index > 0 && quill.getText(index - 1, 1) === "@") {
            index--;
            delta = delta.retain(index).delete(1);
        } else {
            delta = delta.retain(index);
        }
        const text = fullName || mentionName(nodeName);
        delta = delta.insert(text, {mention: nodeName}).insert(" ");
        quill.updateContents(delta, "user");
        quill.setSelection(index + text.length + 1, length);
    }

    const onTextEntered = useCallback((...args: any[]) => {
        if (quill != null && quillElement != null && args[0] === "text-change" && args[3] === "user") {
            const mentionIndex = findMention(args[1]);
            if (mentionIndex == null) {
                return;
            }
            if (mentionIndex > 0 && !/^\s$/.test(quill.getText(mentionIndex - 1, 1))) {
                return;
            }
            onMention();
        }
    }, [onMention, quill, quillElement]);

    useEffect(() => {
        if (quill != null) {
            quill.on("editor-change", onTextEntered);
            return () => {
                quill.off("editor-change", onTextEntered)
            }
        }
    }, [onTextEntered, quill]);

    return (
        <div>
            <div ref={setQuillElement}/>
            {mentionDialog && <RichTextMentionDialog onSubmit={onMentionSubmit}/>}
        </div>
    );
}

function showButtons(quillElement: HTMLDivElement, selector: string, visible: boolean): void {
    if (quillElement.parentElement != null) {
        const buttons = quillElement.parentElement.querySelectorAll(selector);
        if (visible) {
            buttons.forEach(button => button.classList.remove("d-none"));
        } else {
            buttons.forEach(button => button.classList.add("d-none"));
        }
    }
}

function findMention(delta: Delta): number | null {
    let index = 0;
    for (const op of delta.ops) {
        if (op.insert && typeof op.insert === "string" && op.insert.endsWith("@")) {
            return index + op.insert.length - 1;
        } else {
            index += Op.length(op);
        }
    }
    return null;
}
