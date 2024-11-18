import React, { useState } from 'react';
import cx from 'classnames';

import { PrivateMediaFileInfo, VerifiedMediaFile } from "api";
import { MarkdownEditor, MarkdownEditorProps } from "ui/control/richtexteditor/markdown/MarkdownEditor";
import VisualEditor, { VisualEditorProps } from "ui/control/richtexteditor/visual/VisualEditor";
import RichTextEditorDropzone from "ui/control/richtexteditor/RichTextEditorDropzone";
import { RichTextValue } from "ui/control/richtexteditor/rich-text-value";
import { REL_CURRENT } from "util/rel-node-name";
import { arrayMove } from "util/misc";
import "./RichTextEditor.css";
import RichTextEditorDialogs from "ui/control/richtexteditor/RichTextEditorDialogs";

type Props = {
    className?: string;
} & MarkdownEditorProps & VisualEditorProps;

export function RichTextEditor({
    name, value, features, rows, maxHeight, placeholder, className, autoFocus, autoComplete, disabled, smileysEnabled,
    hidingPanel, format, nodeName = REL_CURRENT, forceImageCompress, onKeyDown, onChange, onBlur, onUrls, noMedia
}: Props) {
    const [selectedImage, setSelectedImage] = useState<PrivateMediaFileInfo | null>(null);

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

    return (
        <div className={cx("rich-text-editor", className)}>
            <RichTextEditorDialogs>
                {format === "visual-html" ?
                    <VisualEditor value={value} rows={rows} maxHeight={maxHeight} placeholder={placeholder}
                                  autoFocus={autoFocus} disabled={disabled} hidingPanel={hidingPanel}
                                  onChange={onChange}/>
                :
                    <MarkdownEditor name={name} value={value} features={features} rows={rows} maxHeight={maxHeight}
                                    placeholder={placeholder} autoFocus={autoFocus} autoComplete={autoComplete}
                                    disabled={disabled} smileysEnabled={smileysEnabled} hidingPanel={hidingPanel}
                                    format={format} nodeName={nodeName} forceImageCompress={forceImageCompress}
                                    onKeyDown={onKeyDown} onChange={onChange} onBlur={onBlur} onUrls={onUrls}
                                    noMedia={noMedia}/>
                }
            </RichTextEditorDialogs>
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
