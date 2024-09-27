import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import deepEqual from 'react-fast-compare';
import Delta from 'quill-delta/dist/Delta';
import 'quill/dist/quill.snow.css';

import "./VisualTextArea.css";

interface Props {
    value?: Delta;
    onChange?: (contents: Delta) => void;
}

export function VisualTextArea({value, onChange}: Props) {
    const {quill, quillRef} = useQuill({
        modules: {
            toolbar: [
                [{"header": [false, 1, 2, 3, 4, 5]}],
                ["bold", "italic", "strike"],
                [{"list": "ordered"}, {"list": "bullet"}],
                ["blockquote"],
                ["image", "link"],
                ["clean"],
            ]
        }
    });

    useEffect(() => {
        if (quill != null && value != null && !deepEqual(value, quill.getContents())) {
            const range = quill.getSelection(false);
            quill.setContents(value, "silent");
            quill.setSelection(range, "silent");
        }
    }, [quill, value]);

    useEffect(() => {
        if (quill != null && onChange != null) {
            const handler = (delta: Delta, oldContent: Delta) => {
                console.log(delta, oldContent, quill.getContents());
                onChange(quill.getContents());
            }
            quill.on('text-change', handler);
            return () => {
                quill.off('text-change', handler)
            }
        }
    }, [quill, onChange]);

    return <div><div ref={quillRef}/></div>;
}
