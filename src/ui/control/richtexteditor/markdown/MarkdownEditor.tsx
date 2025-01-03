import React, { useCallback, useRef } from 'react';

import MarkdownEditorCommands from "ui/control/richtexteditor/markdown/MarkdownEditorCommands";
import RichTextEditorPanel from "ui/control/richtexteditor/panel/RichTextEditorPanel";
import MarkdownArea, { MarkdownAreaProps } from "ui/control/richtexteditor/markdown/MarkdownArea";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";

export type MarkdownEditorProps = {
    value: RichTextValue;
    hidingPanel?: boolean;
    onChange?: (value: string) => void;
    onUrls?: (urls: string[]) => void;
    submitKey?: string;
    onSubmit?: () => void;
} & Omit<MarkdownAreaProps, "textArea" | "panel" | "value" | "onChange">;

export function MarkdownEditor({
    name, value, rows, maxHeight, placeholder, autoFocus, autoComplete, disabled, smileysEnabled, hidingPanel, format,
                                   submitKey, onSubmit, onChange, onBlur, onUrls
}: MarkdownEditorProps) {
    const panel = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);

    // useCallback() is mandatory here
    const onTextChange = useCallback(() => {
        if (onChange != null && textArea.current != null) {
            onChange(textArea.current.value);
        }
    }, [onChange]);

    return (
        <MarkdownEditorCommands format={format} textArea={textArea}>
            {format !== "plain-text" &&
                <RichTextEditorPanel hiding={hidingPanel}/>
            }
            <MarkdownArea name={name} value={value.text} format={format} rows={rows} maxHeight={maxHeight}
                          placeholder={placeholder} autoFocus={autoFocus} autoComplete={autoComplete}
                          disabled={disabled} smileysEnabled={smileysEnabled} submitKey={submitKey} onSubmit={onSubmit}
                          onChange={onTextChange} onBlur={onBlur} onUrls={onUrls} ref={textArea} panel={panel}/>
        </MarkdownEditorCommands>
    );
}
