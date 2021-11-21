import React, { useCallback, useRef, useState } from 'react';
import cx from 'classnames';
import { arrayMove } from '@dnd-kit/sortable';

import { PostingFeatures, PrivateMediaFileInfo } from "api/node/api-types";
import RichTextArea, { RichTextAreaProps } from "ui/control/richtexteditor/RichTextArea";
import RichTextEditorPanel from "ui/control/richtexteditor/RichTextEditorPanel";
import RichTextEditorDropzone from "ui/control/richtexteditor/RichTextEditorDropzone";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import "./RichTextEditor.css";

type Props = {
    className?: string;
    hidingPanel?: boolean;
    value: RichTextValue;
    features: PostingFeatures | null;
    nodeName?: string | null;
    onChange?: (value: RichTextValue) => void;
    noMedia?: boolean;
} & Omit<RichTextAreaProps, "textArea" | "panel" | "value" | "onChange">;

const RichTextEditor = ({name, value, features, rows, placeholder, className, autoFocus, autoComplete,
                         disabled, smileysEnabled, hidingPanel, format, nodeName, onKeyDown, onChange, onBlur,
                         noMedia}: Props) => {
    const panel = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const [selectedImage, setSelectedImage] = useState<PrivateMediaFileInfo | null>(null);

    const onImageLoadStarted = (count: number) => {
        if (onChange != null && count > 0) {
            const media = value.media != null ? [...value.media] : [];
            for (let i = 0; i < count; i++) {
                media.push(null);
            }
            onChange(new RichTextValue(value.text, media));
        }
    }

    const onImageLoaded = (index: number, image: PrivateMediaFileInfo) => {
        if (onChange != null && value.media != null && index < value.media.length) {
            const media = [...value.media];
            media[index] = image;
            onChange(new RichTextValue(value.text, media));
        }
    }

    const onImageAdded = (image: PrivateMediaFileInfo) => {
        if (onChange != null) {
            const media = value.media != null ? value.media.filter(v => v == null || v.id !== image.id) : [];
            media.push(image);
            onChange(new RichTextValue(value.text, media));
        }
    }

    const onImageDeleted = (id: string) => {
        if (onChange != null && value.media != null) {
            const media = value.media.filter(v => v == null || v.id !== id);
            onChange(new RichTextValue(value.text, media));
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
            onChange(new RichTextValue(value.text, media));
        }
    }

    // useCallback() is mandatory here
    const onTextChange = useCallback(() => {
        if (onChange != null && textArea.current != null) {
            onChange(new RichTextValue(textArea.current.value, value.media));
        }
    }, [onChange, value.media]);

    return (
        <div className={cx("rich-text-editor", className)}>
            <RichTextEditorPanel panel={panel} textArea={textArea} hiding={hidingPanel} format={format}
                                 features={features} noMedia={noMedia} nodeName={nodeName} selectedImage={selectedImage}
                                 selectImage={setSelectedImage} onImageAdded={onImageAdded}
                                 onImageDeleted={onImageDeleted}/>
            <RichTextArea name={name} value={value.text} format={format} rows={rows} placeholder={placeholder}
                          autoFocus={autoFocus} autoComplete={autoComplete} disabled={disabled}
                          smileysEnabled={smileysEnabled} onKeyDown={onKeyDown} onChange={onTextChange} onBlur={onBlur}
                          textArea={textArea} panel={panel}/>
            {!noMedia &&
                <RichTextEditorDropzone value={value} features={features} hiding={hidingPanel}
                                        nodeName={nodeName ?? null} selectImage={setSelectedImage}
                                        onLoadStarted={onImageLoadStarted} onLoaded={onImageLoaded}
                                        onDeleted={onImageDeleted} onReorder={onImagesReorder}/>
            }
        </div>
    );
};

export { RichTextEditor };
