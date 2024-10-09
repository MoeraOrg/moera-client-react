import { useCallback, useEffect, useRef, useState } from 'react';
import deepEqual from 'react-fast-compare';
import Toolbar from 'quill/modules/toolbar';
import Delta from 'quill-delta/dist/Delta';

import Quill, { QuillOptions, Range } from "ui/control/richtexteditor/visual/quill";
import "./VisualTextArea.css";

interface Props {
    value?: Delta;
    autoFocus?: boolean;
    disabled?: boolean;
    onChange?: (contents: Delta) => void;
}

export function VisualTextArea({value, autoFocus, disabled, onChange}: Props) {
    const quillOptions = useRef<QuillOptions>({
        modules: {
            toolbar: {
                container: [
                    [{"header": [false, 1, 2, 3, 4, 5]}],
                    ["bold", "italic", "strike"],
                    [{list: "ordered"}, {list: "bullet"}, {indent: "+1"}, {indent: "-1"}],
                    ["blockquote", "blockquote-off"],
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
                }
            },
            magicUrl: true,
        },
        readOnly: disabled,
        theme: "snow-extended",
    });

    const [quillElement, setQuillElement] = useState<HTMLDivElement | null>(null);

    const quill = useRef<Quill>();

    useEffect(() => {
        if (quillElement != null) {
            quill.current = new Quill(quillElement, quillOptions.current);
        }
    }, [quillElement]);

    useEffect(() => quill.current?.enable(disabled !== true), [disabled]);

    useEffect(() => {
        if (!disabled && autoFocus && quill.current != null) {
            quill.current.focus();
        }
    }, [disabled, autoFocus]);

    useEffect(() => {
        if (quill.current != null && value != null && !deepEqual(value, quill.current.getContents())) {
            const range = quill.current.getSelection(false);
            quill.current.setContents(value, "silent");
            quill.current.setSelection(range, "silent");
        }
    }, [quill, value]);

    useEffect(() => {
        if (quill.current != null && onChange != null) {
            const currentQuill = quill.current;
            const handler = () => onChange(currentQuill.getContents());
            currentQuill.on("text-change", handler);
            return () => {
                currentQuill.off("text-change", handler);
            }
        }
    }, [onChange]);

    const onEditorChange = useCallback((...args: any[]) => {
        if (quill.current != null && quillElement != null) {
            const range: Range = args[0] === "selection-change" ? args[1] : quill.current?.getSelection();
            if (range?.index != null) {
                const formats = quill.current.getFormat(range);

                showButtons(quillElement, ".ql-indent", !!formats["list"]);
                showButtons(quillElement, ".ql-blockquote-off", !!formats["blockquote"] || !!formats["quote-level"]);
            }
        }
    }, [quillElement]);

    useEffect(() => {
        if (quill.current != null) {
            const currentQuill = quill.current;
            currentQuill.on("editor-change", onEditorChange);
            return () => {
                currentQuill.off("editor-change", onEditorChange)
            }
        }
    }, [onEditorChange]);

    return <div><div ref={setQuillElement}/></div>;
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
