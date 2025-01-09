import React, { ReactNode, useCallback, useRef } from 'react';

import MarkdownEditorCommands from "ui/control/richtexteditor/markdown/MarkdownEditorCommands";
import RichTextEditorPanel from "ui/control/richtexteditor/panel/RichTextEditorPanel";
import MarkdownArea, { MarkdownAreaProps } from "ui/control/richtexteditor/markdown/MarkdownArea";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import RichTextEditorDropzone from "ui/control/richtexteditor/media/RichTextEditorDropzone";
import { RelNodeName } from "util/rel-node-name";

export type MarkdownEditorProps = {
    value: RichTextValue;
    nodeName: RelNodeName | string;
    noPanel?: boolean;
    noComplexBlocks?: boolean | null;
    noEmbeddedMedia?: boolean | null;
    noMedia?: boolean | null;
    onChange?: (value: string) => void;
    onUrls?: (urls: string[]) => void;
    submitKey?: string;
    onSubmit?: () => void;
    children?: ReactNode;
} & Omit<MarkdownAreaProps, "textArea" | "panel" | "value" | "onChange">;

export function MarkdownEditor({
    name, value, nodeName, rows, minHeight, maxHeight, placeholder, autoFocus, autoComplete, disabled, smileysEnabled,
    commentQuote, noPanel, noComplexBlocks, noEmbeddedMedia, noMedia, format, submitKey, onSubmit, onChange, onBlur,
    onUrls, children
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
        <MarkdownEditorCommands
            format={format}
            textArea={textArea}
            noComplexBlocks={noComplexBlocks}
            noEmbeddedMedia={noEmbeddedMedia}
            noMedia={noMedia}
        >
            {format !== "plain-text" && !noPanel &&
                <RichTextEditorPanel/>
            }
            <MarkdownArea
                name={name}
                value={value.text}
                format={format}
                rows={rows}
                minHeight={minHeight}
                maxHeight={maxHeight}
                placeholder={placeholder}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                disabled={disabled}
                smileysEnabled={smileysEnabled}
                commentQuote={commentQuote}
                submitKey={submitKey}
                onSubmit={onSubmit}
                onChange={onTextChange}
                onBlur={onBlur}
                onUrls={onUrls}
                ref={textArea}
                panel={panel}
            />
            {!noMedia &&
                <RichTextEditorDropzone value={value} hiding={noPanel} nodeName={nodeName}/>
            }
            {children}
        </MarkdownEditorCommands>
    );
}
