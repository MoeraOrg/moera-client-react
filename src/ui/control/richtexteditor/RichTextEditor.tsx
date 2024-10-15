import React, { useCallback, useRef, useState } from 'react';
import cx from 'classnames';
import Delta from 'quill-delta';

import { PostingFeatures, PrivateMediaFileInfo, VerifiedMediaFile } from "api";
import { VisualTextArea } from "ui/control/richtexteditor/visual/VisualTextArea";
import RichTextArea, { MarkdownAreaProps } from "ui/control/richtexteditor/markdown/MarkdownArea";
import MarkdownEditorPanel from "ui/control/richtexteditor/markdown/MarkdownEditorPanel";
import RichTextEditorDropzone from "ui/control/richtexteditor/RichTextEditorDropzone";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import { arrayMove } from "util/misc";
import "./RichTextEditor.css";

type Props = {
    className?: string;
    hidingPanel?: boolean;
    value: RichTextValue;
    features: PostingFeatures | null;
    nodeName?: RelNodeName | string;
    forceImageCompress?: boolean;
    onChange?: (value: RichTextValue) => void;
    onUrls?: (urls: string[]) => void;
    noMedia?: boolean;
} & Omit<MarkdownAreaProps, "textArea" | "panel" | "value" | "onChange">;

export function RichTextEditor({
    name, value, features, rows, maxHeight, placeholder, className, autoFocus, autoComplete, disabled, smileysEnabled,
    hidingPanel, format, nodeName = REL_CURRENT, forceImageCompress, onKeyDown, onChange, onBlur, onUrls, noMedia
}: Props) {
    const panel = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const [selectedImage, setSelectedImage] = useState<PrivateMediaFileInfo | null>(null);
    const [imageFromClipboard, setImageFromClipboard] = useState<File | undefined>(undefined);

    const onImageLoadStarted = (count: number) => {
        if (onChange != null && count > 0) {
            const media = value.media != null ? [...value.media] : [];
            for (let i = 0; i < count; i++) {
                media.push(null);
            }
            onChange(new RichTextValue(value.text, format, media));
        }
    }

    const onImageLoaded = (index: number, image: VerifiedMediaFile) => {
        if (onChange != null && value.media != null && index < value.media.length) {
            if (value.media.some(v => v != null && v.id === image.id)) {
                return;
            }
            const media = [...value.media];
            media[index] = image;
            onChange(new RichTextValue(value.text, format, media));
        }
    }

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

    const onImagesReorder = (activeId: string, overId: string) => {
        if (onChange != null && value.media != null && activeId !== overId) {
            const index = value.media.findIndex(v => v != null && v.id === activeId);
            const overIndex = value.media.findIndex(v => v != null && v.id === overId);
            if (index == null || overIndex == null) {
                return;
            }
            const media = arrayMove(value.media, index, overIndex);
            onChange(new RichTextValue(value.text, format, media));
        }
    }

    // useCallback() is mandatory here
    const onTextChange = useCallback(() => {
        if (onChange != null && textArea.current != null) {
            onChange(new RichTextValue(textArea.current.value, format, value.media));
        }
    }, [format, onChange, value.media]);

    // useCallback() is mandatory here
    const onDeltaChange = useCallback((delta: Delta) => {
        if (onChange != null) {
            onChange(new RichTextValue(delta, format, value.media));
        }
    }, [format, onChange, value.media]);

    return (
        <div className={cx("rich-text-editor", className)}>
            {format === "delta" ?
                <VisualTextArea value={value.delta} autoFocus={autoFocus} disabled={disabled} onChange={onDeltaChange}
                                onUrls={onUrls}/>
            :
                <>
                    {format !== "plain-text" &&
                        <MarkdownEditorPanel panel={panel} textArea={textArea} hiding={hidingPanel} format={format}
                                             features={features} noMedia={noMedia} nodeName={nodeName}
                                             forceImageCompress={forceImageCompress} selectedImage={selectedImage}
                                             selectImage={setSelectedImage} onImageAdded={onImageAdded}
                                             onImageDeleted={onImageDeleted} externalImage={imageFromClipboard}
                                             uploadingExternalImage={() => setImageFromClipboard(undefined)}/>
                    }
                    <RichTextArea name={name} value={value.text} format={format} rows={rows} maxHeight={maxHeight}
                                  placeholder={placeholder} autoFocus={autoFocus} autoComplete={autoComplete}
                                  disabled={disabled} smileysEnabled={smileysEnabled} onKeyDown={onKeyDown}
                                  onChange={onTextChange} onBlur={onBlur} onUrls={onUrls} ref={textArea} panel={panel}
                                  uploadImage={setImageFromClipboard}/>
                </>
            }
            {!noMedia &&
                <RichTextEditorDropzone value={value} features={features} hiding={hidingPanel}
                                        nodeName={nodeName ?? null} forceCompress={forceImageCompress}
                                        selectedImage={selectedImage} selectImage={setSelectedImage}
                                        onLoadStarted={onImageLoadStarted} onLoaded={onImageLoaded}
                                        onDeleted={onImageDeleted} onReorder={onImagesReorder}/>
            }
        </div>
    );
}
