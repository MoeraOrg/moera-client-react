import React, { useCallback, useEffect, useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { ReactEditor, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import deepEqual from 'react-fast-compare';

import VisualEditorCommands from "ui/control/richtexteditor/visual/VisualEditorCommands";
import VisualEditorPanel from "ui/control/richtexteditor/visual/VisualEditorPanel";
import VisualTextArea, { VisualTextAreaProps } from "ui/control/richtexteditor/visual/VisualTextArea";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import { toScripture, withScripture } from "ui/control/richtexteditor/visual/scripture-util";

export type VisualEditorProps = {
    value: RichTextValue;
    hidingPanel?: boolean;
    onChange?: (value: RichTextValue) => void;
} & VisualTextAreaProps;

export default function VisualEditor({
    value, rows, maxHeight, placeholder, autoFocus, disabled, hidingPanel, onChange
}: VisualEditorProps) {
    const [editor] = useState(() => withScripture(withHistory(withReact(createEditor(), "x-scripture-fragment"))));

    useEffect(() => {
        if (!disabled && autoFocus) {
            ReactEditor.focus(editor);
        }
    }, [disabled, autoFocus, editor]);

    useEffect(() => {
        if (value.scripture != null && !deepEqual(value.scripture, editor.children)) {
            editor.children = value.scripture;
            editor.select([]);
            editor.onChange();
        }
    }, [editor, value]);

    // useCallback() is mandatory here
    const onScriptureChange = useCallback((content: Scripture) => {
        if (onChange != null) {
            onChange(new RichTextValue(content, "html/visual", value.media));
        }
    }, [onChange, value.media]);

    return (
        <Slate editor={editor} initialValue={toScripture("")}
               onValueChange={onScriptureChange as ((contents: Descendant[]) => void) | undefined}>
            <VisualEditorCommands>
                <VisualEditorPanel hiding={hidingPanel}/>
                <VisualTextArea
                    rows={rows}
                    maxHeight={maxHeight}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoFocus={autoFocus}
                />
            </VisualEditorCommands>
        </Slate>
    );
}
