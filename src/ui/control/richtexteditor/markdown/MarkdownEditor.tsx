import React, { useCallback, useRef, useState } from 'react';

import { PostingFeatures, PrivateMediaFileInfo, VerifiedMediaFile } from "api";
import MarkdownArea, { MarkdownAreaProps } from "ui/control/richtexteditor/markdown/MarkdownArea";
import MarkdownEditorPanel from "ui/control/richtexteditor/markdown/MarkdownEditorPanel";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";

export type MarkdownEditorProps = {
    value: RichTextValue;
    features: PostingFeatures | null;
    hidingPanel?: boolean;
    nodeName?: RelNodeName | string;
    forceImageCompress?: boolean;
    onChange?: (value: RichTextValue) => void;
    onUrls?: (urls: string[]) => void;
    submitKey?: string;
    onSubmit?: () => void;
    noMedia?: boolean;
} & Omit<MarkdownAreaProps, "textArea" | "panel" | "value" | "onChange">;

export function MarkdownEditor({
    name, value, features, rows, maxHeight, placeholder, autoFocus, autoComplete, disabled, smileysEnabled,
    hidingPanel, format, nodeName = REL_CURRENT, forceImageCompress, submitKey, onSubmit, onChange, onBlur, onUrls,
    noMedia
}: MarkdownEditorProps) {
    const panel = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const [selectedImage, setSelectedImage] = useState<PrivateMediaFileInfo | null>(null);
    const [imageFromClipboard, setImageFromClipboard] = useState<File | undefined>(undefined);

    const onImageAdded = (image: VerifiedMediaFile) => {
        if (onChange != null) {
            const media = value.media != null ? value.media.filter(v => v == null || v.id !== image.id) : [];
            media.push(image);
            onChange(new RichTextValue(value.text, format, media));
        }
    }

    const onImageDeleted = (id: string) => {
        if (onChange != null && value.media != null) {
            const media = value.media.filter(v => v == null || v.id !== id);
            onChange(new RichTextValue(value.text, format, media));
        }
    }

    // useCallback() is mandatory here
    const onTextChange = useCallback(() => {
        if (onChange != null && textArea.current != null) {
            onChange(new RichTextValue(textArea.current.value, format, value.media));
        }
    }, [format, onChange, value.media]);

    return (
        <>
            {format !== "plain-text" &&
                <MarkdownEditorPanel panel={panel} textArea={textArea} hiding={hidingPanel} format={format}
                                     features={features} noMedia={noMedia} nodeName={nodeName}
                                     forceImageCompress={forceImageCompress} selectedImage={selectedImage}
                                     selectImage={setSelectedImage} onImageAdded={onImageAdded}
                                     onImageDeleted={onImageDeleted} externalImage={imageFromClipboard}
                                     uploadingExternalImage={() => setImageFromClipboard(undefined)}/>
            }
            <MarkdownArea name={name} value={value.text} format={format} rows={rows} maxHeight={maxHeight}
                          placeholder={placeholder} autoFocus={autoFocus} autoComplete={autoComplete}
                          disabled={disabled} smileysEnabled={smileysEnabled} submitKey={submitKey} onSubmit={onSubmit}
                          onChange={onTextChange} onBlur={onBlur} onUrls={onUrls} ref={textArea} panel={panel}
                          uploadImage={setImageFromClipboard}/>
        </>
    );
}
