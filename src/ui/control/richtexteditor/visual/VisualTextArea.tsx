import { useEffect, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import deepEqual from 'react-fast-compare';

import VisualRenderElement from "ui/control/richtexteditor/visual/VisualRenderElement";
import { Scripture, toScripture } from "util/scripture";
import "./VisualTextArea.css";

interface Props {
    value?: Scripture;
    onChange?: (contents: Scripture) => void;
}

export default function VisualTextArea({value, onChange}: Props) {
    const [editor] = useState(() => withReact(createEditor()));

    useEffect(() => {
        if (value != null && !deepEqual(value, editor.children)) {
            editor.children = value;
            editor.onChange();
        }
    }, [editor, value]);

    return (
        <Slate editor={editor} initialValue={toScripture("")}
               onValueChange={onChange as ((contents: Descendant[]) => void) | undefined}>
            <Editable className="visual-text-area" renderElement={VisualRenderElement}/>
        </Slate>
    );
}
