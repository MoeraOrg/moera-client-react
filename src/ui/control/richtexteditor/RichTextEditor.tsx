import React from 'react';
import cx from 'classnames';

import { PostingFeatures, VerifiedMediaFile } from "api";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { MarkdownEditor, MarkdownEditorProps } from "ui/control/richtexteditor/markdown/MarkdownEditor";
import { Scripture } from "ui/control/richtexteditor/visual/scripture";
import VisualEditor, { VisualEditorProps } from "ui/control/richtexteditor/visual/VisualEditor";
import RichTextEditorDropzone from "ui/control/richtexteditor/media/RichTextEditorDropzone";
import RichTextEditorDialogs from "ui/control/richtexteditor/dialog/RichTextEditorDialogs";
import RichTextEditorMedia from "ui/control/richtexteditor/media/RichTextEditorMedia";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import "./RichTextEditor.css";

type Props = {
    className?: string;
    features: PostingFeatures | null;
    nodeName?: RelNodeName | string;
    forceImageCompress?: boolean;
    noMedia?: boolean;
    onChange?: (value: RichTextValue) => void;
} & Omit<MarkdownEditorProps, "onChange"> & Omit<VisualEditorProps, "onChange">;

export function RichTextEditor({
    name, value, features, rows, maxHeight, placeholder, className, autoFocus, autoComplete, disabled, smileysEnabled,
    hidingPanel, format, nodeName = REL_CURRENT, forceImageCompress, onChange, submitKey, onSubmit, onBlur, onUrls,
    noMedia
}: Props) {
    const textRef = React.useRef<string | Scripture>();
    textRef.current = value.text;
    const mediaRef = React.useRef<(VerifiedMediaFile | null)[] | null>(null);
    mediaRef.current = value.media ?? null;

    const onTextChange = (text: string | Scripture) => {
        textRef.current = text;
        onChange?.(new RichTextValue(text, format, mediaRef.current));
    }

    const onMediaChange = (media: (VerifiedMediaFile | null)[]) => {
        mediaRef.current = media;
        onChange?.(new RichTextValue(textRef.current ?? "", format, media));
    }

    return (
        <div className={cx("rich-text-editor", className)}>
            <RichTextEditorDialogs>
                <RichTextEditorMedia value={value.media ?? []} features={features} nodeName={nodeName}
                                     forceCompress={forceImageCompress} srcFormat={format}
                                     smileysEnabled={smileysEnabled} onChange={onMediaChange}>
                    {format.endsWith("/visual") ?
                        <VisualEditor name={name} value={value} rows={rows} maxHeight={maxHeight}
                                      placeholder={placeholder} autoFocus={autoFocus} disabled={disabled}
                                      smileysEnabled={smileysEnabled} hidingPanel={hidingPanel} submitKey={submitKey}
                                      onSubmit={onSubmit} onChange={onTextChange} onBlur={onBlur} onUrls={onUrls}/>
                    :
                        <MarkdownEditor name={name} value={value} rows={rows} maxHeight={maxHeight}
                                        placeholder={placeholder} autoFocus={autoFocus} autoComplete={autoComplete}
                                        disabled={disabled} smileysEnabled={smileysEnabled} hidingPanel={hidingPanel}
                                        format={format} submitKey={submitKey} onSubmit={onSubmit}
                                        onChange={onTextChange} onBlur={onBlur} onUrls={onUrls}/>
                    }
                    {!noMedia &&
                        <RichTextEditorDropzone value={value} hiding={hidingPanel} nodeName={nodeName ?? null}/>
                    }
                </RichTextEditorMedia>
            </RichTextEditorDialogs>
        </div>
    );
}
