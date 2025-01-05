import React, { useCallback, useRef } from 'react';

import MarkdownEditorCommands from "ui/control/richtexteditor/markdown/MarkdownEditorCommands";
import RichTextEditorPanel from "ui/control/richtexteditor/panel/RichTextEditorPanel";
import MarkdownArea, { MarkdownAreaProps } from "ui/control/richtexteditor/markdown/MarkdownArea";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";

export type MarkdownEditorProps = {
    value: RichTextValue;
    hidingPanel?: boolean;
    noComplexBlocks?: boolean | null;
    noEmbeddedMedia?: boolean | null;
    noMedia?: boolean | null;
    onChange?: (value: string) => void;
    onUrls?: (urls: string[]) => void;
    submitKey?: string;
    onSubmit?: () => void;
} & Omit<MarkdownAreaProps, "textArea" | "panel" | "value" | "onChange">;

export function MarkdownEditor({
    name, value, rows, minHeight, maxHeight, placeholder, autoFocus, autoComplete, disabled, smileysEnabled,
    hidingPanel, noComplexBlocks, noEmbeddedMedia, noMedia, format, submitKey, onSubmit, onChange, onBlur, onUrls
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
        <MarkdownEditorCommands format={format} textArea={textArea} noComplexBlocks={noComplexBlocks}
                                noEmbeddedMedia={noEmbeddedMedia} noMedia={noMedia}>
            {format !== "plain-text" &&
                <RichTextEditorPanel hiding={hidingPanel}/>
            }
            <MarkdownArea name={name} value={value.text} format={format} rows={rows} minHeight={minHeight}
                          maxHeight={maxHeight} placeholder={placeholder} autoFocus={autoFocus}
                          autoComplete={autoComplete} disabled={disabled} smileysEnabled={smileysEnabled}
                          submitKey={submitKey} onSubmit={onSubmit} onChange={onTextChange} onBlur={onBlur}
                          onUrls={onUrls} ref={textArea} panel={panel}/>
        </MarkdownEditorCommands>
    );
}
