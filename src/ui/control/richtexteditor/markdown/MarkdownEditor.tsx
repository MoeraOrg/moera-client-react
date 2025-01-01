import React, { useCallback, useRef, useState } from 'react';

import MarkdownEditorCommands from "ui/control/richtexteditor/markdown/MarkdownEditorCommands";
import VisualEditorPanel from "ui/control/richtexteditor/visual/VisualEditorPanel";
import MarkdownArea, { MarkdownAreaProps } from "ui/control/richtexteditor/markdown/MarkdownArea";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";

export type MarkdownEditorProps = {
    value: RichTextValue;
    hidingPanel?: boolean;
    onChange?: (value: RichTextValue) => void;
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
    const [imageFromClipboard, setImageFromClipboard] = useState<File | undefined>(undefined);

    // useCallback() is mandatory here
    const onTextChange = useCallback(() => {
        if (onChange != null && textArea.current != null) {
            onChange(new RichTextValue(textArea.current.value, format, value.media));
        }
    }, [format, onChange, value.media]);

    return (
        <MarkdownEditorCommands format={format} textArea={textArea}>
            {format !== "plain-text" &&
                <VisualEditorPanel hiding={hidingPanel}/>
            }
            <MarkdownArea name={name} value={value.text} format={format} rows={rows} maxHeight={maxHeight}
                          placeholder={placeholder} autoFocus={autoFocus} autoComplete={autoComplete}
                          disabled={disabled} smileysEnabled={smileysEnabled} submitKey={submitKey} onSubmit={onSubmit}
                          onChange={onTextChange} onBlur={onBlur} onUrls={onUrls} ref={textArea} panel={panel}
                          uploadImage={setImageFromClipboard}/>
        </MarkdownEditorCommands>
    );
}
