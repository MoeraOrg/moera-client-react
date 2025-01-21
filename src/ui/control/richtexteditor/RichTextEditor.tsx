import React, { ReactNode, useEffect } from 'react';
import cx from 'classnames';

import { PostingFeatures, SourceFormat, VerifiedMediaFile } from "api";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { htmlToMarkdown, markdownToHtml } from "ui/control/richtexteditor/markdown/markdown-html";
import { MarkdownEditor, MarkdownEditorProps } from "ui/control/richtexteditor/markdown/MarkdownEditor";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import {
    normalizeDocument,
    safeImportScripture,
    scriptureToHtml
} from "ui/control/richtexteditor/visual/scripture-html";
import VisualEditor, { VisualEditorProps } from "ui/control/richtexteditor/visual/VisualEditor";
import RichTextEditorDialogs from "ui/control/richtexteditor/dialog/RichTextEditorDialogs";
import RichTextEditorMedia from "ui/control/richtexteditor/media/RichTextEditorMedia";
import { REL_CURRENT } from "util/rel-node-name";
import { htmlToLinefeeds, plainTextToHtml, prettyHtml } from "util/html";
import "./RichTextEditor.css";

type Props = {
    className?: string;
    features: PostingFeatures | null;
    forceImageCompress?: boolean;
    onChange?: (value: RichTextValue, converted: boolean) => void;
    children?: ReactNode;
} & Omit<MarkdownEditorProps, "onChange"> & Omit<VisualEditorProps, "onChange">;

export function RichTextEditor({
    name, value, touched, features, rows, minHeight, maxHeight, placeholder, className, autoFocus, autoComplete,
    disabled, smileysEnabled = true, commentQuote, panelMode, format, nodeName = REL_CURRENT, forceImageCompress,
    onChange, submitKey, onSubmit, onBlur, onUrls, noComplexBlocks, noEmbeddedMedia, noMedia, noVideo, children
}: Props) {
    const textRef = React.useRef<string | Scripture>();
    textRef.current = value.value;
    const mediaRef = React.useRef<(VerifiedMediaFile | null)[] | null>(null);
    mediaRef.current = value.media ?? null;

    const onTextChange = (text: string | Scripture) => {
        textRef.current = text;
        onChange?.(new RichTextValue(text, format, mediaRef.current), false);
    };

    const onMediaChange = (media: (VerifiedMediaFile | null)[]) => {
        mediaRef.current = media;
        onChange?.(new RichTextValue(textRef.current ?? "", format, media), false);
    };

    useEffect(() => {
        convertFormat(value.value, value.format, format).then(convertedValue => {
            if (convertedValue !== value.value) {
                textRef.current = convertedValue;
                onChange?.(new RichTextValue(convertedValue, format, mediaRef.current), true);
            }
        });
    }, [format, onChange, value.format, value.value]);

    return (
        <div className={cx("rich-text-editor", className)}>
            <RichTextEditorDialogs>
                <RichTextEditorMedia
                    value={value.media ?? []}
                    features={features}
                    nodeName={nodeName}
                    forceCompress={forceImageCompress}
                    srcFormat={format}
                    smileysEnabled={smileysEnabled}
                    onChange={onMediaChange}
                >
                    {format.endsWith("/visual") ?
                        <VisualEditor
                            name={name}
                            value={value}
                            touched={touched}
                            nodeName={nodeName}
                            rows={rows}
                            minHeight={minHeight}
                            maxHeight={maxHeight}
                            placeholder={placeholder}
                            autoFocus={autoFocus}
                            disabled={disabled}
                            smileysEnabled={smileysEnabled}
                            commentQuote={commentQuote}
                            panelMode={panelMode}
                            noComplexBlocks={noComplexBlocks}
                            noEmbeddedMedia={noEmbeddedMedia}
                            noMedia={noMedia}
                            noVideo={noVideo}
                            submitKey={submitKey}
                            onSubmit={onSubmit}
                            onChange={onTextChange}
                            onBlur={onBlur}
                            onUrls={onUrls}
                            children={children}
                        />
                    :
                        <MarkdownEditor
                            name={name}
                            value={value}
                            nodeName={nodeName}
                            rows={rows}
                            minHeight={minHeight}
                            maxHeight={maxHeight}
                            placeholder={placeholder}
                            autoFocus={autoFocus}
                            autoComplete={autoComplete}
                            disabled={disabled}
                            smileysEnabled={smileysEnabled}
                            commentQuote={commentQuote}
                            panelMode={panelMode}
                            noComplexBlocks={noComplexBlocks}
                            noEmbeddedMedia={noEmbeddedMedia}
                            noMedia={noMedia}
                            format={format}
                            submitKey={submitKey}
                            onSubmit={onSubmit}
                            onChange={onTextChange}
                            onBlur={onBlur}
                            onUrls={onUrls}
                            children={children}
                        />
                    }
                </RichTextEditorMedia>
            </RichTextEditorDialogs>
        </div>
    );
}

async function convertFormat(
    value: string | Scripture, prevFormat: SourceFormat, format: SourceFormat
): Promise<string | Scripture> {
    if (prevFormat === format) {
        return value;
    }

    switch (format) {
        case "plain-text":
            switch (prevFormat) {
                case "markdown":
                    return value;
                case "html":
                    return htmlToLinefeeds(value as string);
                case "html/visual":
                    return htmlToLinefeeds(scriptureToHtml(value as Scripture));
            }
            break;
        case "markdown":
            switch (prevFormat) {
                case "plain-text":
                    return value;
                case "html":
                    return htmlToMarkdown(value as string);
                case "html/visual":
                    return htmlToMarkdown(scriptureToHtml(value as Scripture));
            }
            break;
        case "html":
            switch (prevFormat) {
                case "plain-text":
                    return prettyHtml(plainTextToHtml(value as string));
                case "markdown":
                    return prettyHtml(await markdownToHtml(value as string));
                case "html/visual":
                    return prettyHtml(scriptureToHtml(value as Scripture));
            }
            break;
        case "html/visual":
            switch (prevFormat) {
                case "plain-text":
                    return normalizeDocument(safeImportScripture(plainTextToHtml(value as string)));
                case "markdown":
                    return normalizeDocument(safeImportScripture(await markdownToHtml(value as string)));
                case "html":
                    return normalizeDocument(safeImportScripture(value as string));
            }
    }

    return value;
}
