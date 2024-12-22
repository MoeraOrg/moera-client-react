import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BaseOperation, createEditor, Descendant } from 'slate';
import { ReactEditor, Slate, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import deepEqual from 'react-fast-compare';

import VisualEditorCommands from "ui/control/richtexteditor/visual/VisualEditorCommands";
import VisualEditorPanel from "ui/control/richtexteditor/visual/VisualEditorPanel";
import VisualTextArea, { VisualTextAreaProps } from "ui/control/richtexteditor/visual/VisualTextArea";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { isLinkElement, Scripture } from "ui/control/richtexteditor/visual/scripture";
import {
    isScriptureEmpty,
    scriptureExtractUrls,
    withScripture
} from "ui/control/richtexteditor/visual/scripture-editor";
import { htmlToScripture } from "ui/control/richtexteditor/visual/scripture-html";

export type VisualEditorProps = {
    value: RichTextValue;
    hidingPanel?: boolean;
    onChange?: (value: RichTextValue) => void;
    submitKey?: string;
    onSubmit?: () => void;
    onUrls?: (urls: string[]) => void;
} & VisualTextAreaProps;

export default function VisualEditor({
    value, rows, maxHeight, placeholder, autoFocus, disabled, hidingPanel, onChange, submitKey, onSubmit, onUrls
}: VisualEditorProps) {
    const [editor] = useState(() => withScripture(withHistory(withReact(createEditor(), "x-scripture-fragment"))));

    useEffect(() => {
        if (!disabled && autoFocus) {
            ReactEditor.focus(editor);
            if (editor.selection == null && editor.children != null) {
                editor.select(editor.start([]));
            }
        }
    }, [disabled, autoFocus, editor]);

    useEffect(() => {
        if (value.scripture != null && !deepEqual(value.scripture, editor.children)) {
            editor.deselect();
            editor.children = value.scripture;
            setTimeout(() => {
                editor.select(editor.start([]));
                editor.collapse({edge: "start"});
            });
            editor.onChange();
        }
    }, [editor, value]);


    const updateUrls = useCallback(() => {
        onUrls && onUrls(scriptureExtractUrls(editor.children as Scripture));
    }, [editor.children, onUrls]);

    const updateUrlsTimeout = useRef<number | NodeJS.Timeout | null>(null);

    const delayedUpdateUrls = useCallback(() => {
        if (updateUrlsTimeout.current != null) {
            clearTimeout(updateUrlsTimeout.current);
        }
        updateUrlsTimeout.current = setTimeout(updateUrls, 1500);
    }, [updateUrls]);

    const onEditorChange = useCallback((operation: BaseOperation) => {
        switch (operation.type) {
            case "remove_node":
            case "remove_text":
                delayedUpdateUrls();
                break;
            case "insert_node":
                if (isLinkElement(operation.node)) {
                    setTimeout(() => updateUrls());
                }
                break;
            case "set_node":
                if (isLinkElement(operation.properties)) {
                    setTimeout(() => updateUrls());
                }
                break;
        }
    }, [delayedUpdateUrls, updateUrls]);

    useEffect(() => {
        editor.addChangeListener(onEditorChange);
        return () => editor.removeChangeListener(onEditorChange);
    }, [editor, onEditorChange]);

    // useCallback() is mandatory here
    const onScriptureChange = useCallback((content: Scripture) => {
        if (onChange != null) {
            onChange(new RichTextValue(content, "html/visual", value.media));
        }
    }, [onChange, value.media]);

    return (
        <Slate editor={editor} initialValue={htmlToScripture("")}
               onValueChange={onScriptureChange as ((contents: Descendant[]) => void) | undefined}>
            <VisualEditorCommands>
                <VisualEditorPanel hiding={hidingPanel}/>
                <VisualTextArea
                    rows={rows}
                    maxHeight={maxHeight}
                    placeholder={isScriptureEmpty(editor.children) ? placeholder : undefined}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    submitKey={submitKey}
                    onSubmit={onSubmit}
                />
            </VisualEditorCommands>
        </Slate>
    );
}
