import React, { ReactNode, useCallback, useRef } from 'react';

import { useIsTinyScreen } from "ui/hook/media-query";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import MarkdownEditorCommands from "ui/control/richtexteditor/markdown/MarkdownEditorCommands";
import RichTextEditorPanel, { RichTextEditorPanelMode } from "ui/control/richtexteditor/panel/RichTextEditorPanel";
import RichTextEditorShortPanel from "ui/control/richtexteditor/formatting-menu/RichTextEditorShortPanel";
import MarkdownArea, { MarkdownAreaProps } from "ui/control/richtexteditor/markdown/MarkdownArea";
import RichTextEditorDropzone from "ui/control/richtexteditor/media/RichTextEditorDropzone";
import { RelNodeName } from "util/rel-node-name";

export type MarkdownEditorProps = {
    value: RichTextValue;
    nodeName: RelNodeName | string;
    panelMode?: RichTextEditorPanelMode;
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
    commentQuote, panelMode = "float", noComplexBlocks, noEmbeddedMedia, noMedia, format, submitKey, onSubmit, onChange,
    onBlur, onUrls, children
}: MarkdownEditorProps) {
    const textArea = useRef<HTMLTextAreaElement>(null);

    // useCallback() is mandatory here
    const onTextChange = useCallback(() => {
        if (onChange != null && textArea.current != null) {
            onChange(textArea.current.value);
        }
    }, [onChange]);

    const tinyScreen = useIsTinyScreen();
    const topPanel = panelMode === "float" && !tinyScreen;

    return (
        <MarkdownEditorCommands
            format={format}
            textArea={textArea}
            noComplexBlocks={noComplexBlocks}
            noEmbeddedMedia={noEmbeddedMedia}
            noMedia={noMedia}
        >
            {format !== "plain-text" && topPanel &&
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
            />
            {!topPanel &&format !== "plain-text" && panelMode !== "none" ?
                <RichTextEditorShortPanel children={children}/>
            :
                children
            }
            {!noMedia &&
                <RichTextEditorDropzone value={value} hiding={panelMode === "none"} nodeName={nodeName}
                                        noEmbeddedMedia={noEmbeddedMedia}/>
            }
        </MarkdownEditorCommands>
    );
}
