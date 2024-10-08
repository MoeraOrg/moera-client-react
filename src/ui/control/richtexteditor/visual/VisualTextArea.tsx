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
                    ["blockquote"],
                    ["image", "link"],
                    ["clean"],
                ],
                handlers: {
                    blockquote: function (this: Toolbar) {
                        const level = (this.quill.getFormat()?.["quote-level"] as string | undefined) ?? "0";
                        this.quill.format("blockquote", String(parseInt(level) + 1));
                    }
                }
            },
            magicUrl: true,
        },
        readOnly: disabled,
        theme: "snow",
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

    const onSelectionChange = useCallback((range: Range) => {
        if (quill.current != null && quillElement?.parentElement != null) {
            const formats = quill.current.getFormat(range);
            const inList = !!formats["list"];
            const indentButtons = quillElement.parentElement.querySelectorAll(".ql-indent");
            if (inList) {
                indentButtons.forEach(button => button.classList.remove("d-none"));
            } else {
                indentButtons.forEach(button => button.classList.add("d-none"));
            }
        }
    }, [quillElement]);

    useEffect(() => {
        if (quill.current != null) {
            const currentQuill = quill.current;
            currentQuill.on("selection-change", onSelectionChange);
            return () => {
                currentQuill.off("selection-change", onSelectionChange)
            }
        }
    }, [onSelectionChange]);

    return <div><div ref={setQuillElement}/></div>;
}
