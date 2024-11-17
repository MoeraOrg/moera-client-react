import React, { useCallback, useEffect, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import deepEqual from 'react-fast-compare';

import VisualEditorPanel from "ui/control/richtexteditor/visual/VisualEditorPanel";
import VisualRenderElement from "ui/control/richtexteditor/visual/VisualRenderElement";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import { toScripture } from "ui/control/richtexteditor/visual/scripture-util";
import "./VisualEditor.css";

export interface VisualEditorProps {
    value: RichTextValue;
    hidingPanel?: boolean;
    onChange?: (value: RichTextValue) => void;
}

export default function VisualEditor({hidingPanel, value, onChange}: VisualEditorProps) {
    const [editor] = useState(() => withReact(createEditor()));

    useEffect(() => {
        if (value.scripture != null && !deepEqual(value.scripture, editor.children)) {
            editor.children = value.scripture;
            editor.onChange();
        }
    }, [editor, value]);

    // useCallback() is mandatory here
    const onScriptureChange = useCallback((content: Scripture) => {
        if (onChange != null) {
            onChange(new RichTextValue(content, "visual-html", value.media));
        }
    }, [onChange, value.media]);

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && (event.shiftKey || event.ctrlKey)) {
            editor.insertText("\n");
            event.preventDefault();
        }
    };

    return (
        <Slate editor={editor} initialValue={toScripture("")}
               onValueChange={onScriptureChange as ((contents: Descendant[]) => void) | undefined}>
            <VisualEditorPanel hiding={hidingPanel}/>
            <Editable className="visual-text-area" renderElement={VisualRenderElement} onKeyDown={onKeyDown}/>
        </Slate>
    );
}
