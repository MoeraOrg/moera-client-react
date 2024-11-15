import { useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';

import VisualRenderElement from "ui/control/richtexteditor/visual/VisualRenderElement";
import { Scripture, toScripture } from "util/scripture";

interface Props {
    value?: string;
    onChange?: (contents: Scripture) => void;
}

export default function VisualTextArea({value, onChange}: Props) {
    const [editor] = useState(() => withReact(createEditor()));

    return (
        <Slate editor={editor} initialValue={toScripture("")}
               onChange={onChange as ((contents: Descendant[]) => void) | undefined}>
            <Editable renderElement={VisualRenderElement}/>
        </Slate>
    );
}
